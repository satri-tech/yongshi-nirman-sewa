import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  uploadFiles,
  extractFilesFromFormData,
  deleteFiles,
  PROJECTS_CONFIG,
} from "@/features/shared/hooks/fileUpload";

const SINGLETON_ID = "singleton";
const LANDING_PAGE_TAG = "landing-page";

// GET - Fetch landing page data
export async function GET() {
  try {
    const landingData = await prisma.landingPage.findUnique({
      where: { id: SINGLETON_ID },
    });

    if (!landingData) {
      return NextResponse.json(
        { success: false, message: "Landing page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: landingData,
    });
  } catch (error) {
    console.error("Error fetching landing page:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch landing page" },
      { status: 500 }
    );
  }
}

// PUT - Update landing page
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const existingImagesJson = formData.get("existingImages") as string;
    const existingImages = JSON.parse(existingImagesJson || "[]");

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Extract new files
    const newFiles = extractFilesFromFormData(formData, "attachments");

    // Upload new files if any
    let newImageFilenames: string[] = [];
    if (newFiles.length > 0) {
      const uploadResult = await uploadFiles(newFiles, PROJECTS_CONFIG);
      if (!uploadResult.success) {
        return NextResponse.json(
          { success: false, error: uploadResult.errors.join(", ") },
          { status: 400 }
        );
      }
      newImageFilenames = uploadResult.files;
    }

    // Combine existing images to keep with new uploads
    const allImages = [...existingImages, ...newImageFilenames];

    // Update landing page
    const updatedLanding = await prisma.landingPage.upsert({
      where: { id: SINGLETON_ID },
      update: {
        title,
        description,
        sliderImages: allImages,
      },
      create: {
        id: SINGLETON_ID,
        title,
        description,
        sliderImages: allImages,
      },
    });

    revalidatePath("/admin/landing");
    revalidatePath("/");
    revalidateTag(LANDING_PAGE_TAG);

    return NextResponse.json({
      success: true,
      message: "Landing page updated successfully",
      data: updatedLanding,
    });
  } catch (error) {
    console.error("Error updating landing page:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update landing page" },
      { status: 500 }
    );
  }
}

// DELETE - Remove specific images
export async function DELETE(request: NextRequest) {
  try {
    const { images } = await request.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { success: false, error: "No images provided for deletion" },
        { status: 400 }
      );
    }

    // Delete files from disk
    const deleteResult = await deleteFiles(images, "public/projects");

    // Update landing page to remove deleted images
    const landingData = await prisma.landingPage.findUnique({
      where: { id: SINGLETON_ID },
    });

    if (landingData) {
      const updatedImages = landingData.sliderImages.filter(
        (img) => !deleteResult.deleted.includes(img)
      );

      await prisma.landingPage.update({
        where: { id: SINGLETON_ID },
        data: { sliderImages: updatedImages },
      });
    }

    revalidatePath("/admin/landing");
    revalidatePath("/");
    revalidateTag(LANDING_PAGE_TAG);

    return NextResponse.json({
      success: true,
      message: "Images deleted successfully",
      deleted: deleteResult.deleted,
      failed: deleteResult.failed,
    });
  } catch (error) {
    console.error("Error deleting images:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete images" },
      { status: 500 }
    );
  }
}
