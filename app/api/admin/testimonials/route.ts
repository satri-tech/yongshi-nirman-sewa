// app/api/testimonials/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  uploadSingleFile,
  deleteFiles,
  extractFilesFromFormData,
  TESTIMONIALS_CONFIG,
  UploadResult,
} from "@/lib/upload/fileUpload";

// POST API route handler for creating testimonials
export async function POST(request: NextRequest) {
  try {
    console.log("Starting testimonial creation via API...");

    // Parse the form data
    const formData = await request.formData();

    // Extract and validate form data
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const content = formData.get("content") as string;
    const rating = formData.get("rating") as string;

    // Validate required fields
    const requiredFields = [
      { field: name, name: "Name" },
      { field: role, name: "Role" },
      { field: content, name: "Content" },
      { field: rating, name: "Rating" },
    ];

    for (const { field, name } of requiredFields) {
      if (!field?.trim()) {
        return NextResponse.json(
          { success: false, error: `${name} is required` },
          { status: 400 }
        );
      }
    }

    // Validate rating
    const numericRating = parseInt(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Extract and process single image file using the utility
    const imageFiles = extractFilesFromFormData(formData, "image");
    let uploadResult: UploadResult = { success: true, files: [], errors: [] };

    if (imageFiles.length > 0) {
      // Use uploadSingleFile for testimonials (only one image allowed)
      if (imageFiles.length > 1) {
        return NextResponse.json(
          {
            success: false,
            error: "Only one image is allowed for testimonials",
          },
          { status: 400 }
        );
      }

      console.log(`Processing testimonial image...`);
      uploadResult = await uploadSingleFile(imageFiles[0], TESTIMONIALS_CONFIG);

      if (!uploadResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: "Image upload failed",
            details: uploadResult.errors,
          },
          { status: 400 }
        );
      }
    }

    // Image is required for testimonial
    if (uploadResult.files.length === 0) {
      return NextResponse.json(
        { success: false, error: "Image is required for testimonials" },
        { status: 400 }
      );
    }

    // Create testimonial in database
    console.log("Creating testimonial in database...");
    const testimonial = await prisma.testimonial.create({
      data: {
        name: name.trim(),
        role: role.trim(),
        content: content.trim(),
        rating: numericRating,
        image: uploadResult.files[0], // Single image
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log(`Testimonial created successfully with ID: ${testimonial.id}`);

    // Revalidate any cached pages that might show this data
    revalidatePath("/testimonials");
    revalidatePath("/admin/testimonials");

    return NextResponse.json({
      success: true,
      data: {
        id: testimonial.id,
        name: testimonial.name,
        role: testimonial.role,
        rating: testimonial.rating,
        image: testimonial.image,
      },
      message: `Testimonial from "${name}" created successfully with image`,
    });
  } catch (error) {
    console.error("Error in testimonials API route:", error);

    // Handle specific Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      switch (error.code) {
        case "P2002":
          return NextResponse.json(
            {
              success: false,
              error: "A testimonial with this information already exists",
            },
            { status: 409 }
          );
        default:
          console.error("Prisma error:", error);
      }
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create testimonial",
      },
      { status: 500 }
    );
  }
}

// PUT handler to update a testimonial
export async function PUT(request: NextRequest) {
  try {
    console.log("Starting testimonial update via API...");

    const formData = await request.formData();

    // Extract testimonial ID
    const testimonialId = formData.get("id") as string;
    if (!testimonialId) {
      return NextResponse.json(
        { success: false, error: "Testimonial ID is required" },
        { status: 400 }
      );
    }

    // Extract and validate form data
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const content = formData.get("content") as string;
    const rating = formData.get("rating") as string;
    const keepExistingImage = formData.get("keepExistingImage") === "true";

    // Validate required fields
    const requiredFields = [
      { field: name, name: "Name" },
      { field: role, name: "Role" },
      { field: content, name: "Content" },
      { field: rating, name: "Rating" },
    ];

    for (const { field, name } of requiredFields) {
      if (!field?.trim()) {
        return NextResponse.json(
          { success: false, error: `${name} is required` },
          { status: 400 }
        );
      }
    }

    // Validate rating
    const numericRating = parseInt(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if testimonial exists
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id: testimonialId },
      select: { id: true, name: true, image: true },
    });

    if (!existingTestimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }

    let finalImageUrl = existingTestimonial.image;

    // Handle image update
    if (!keepExistingImage) {
      // Extract and process new image file
      const imageFiles = extractFilesFromFormData(formData, "image");

      if (imageFiles.length > 0) {
        if (imageFiles.length > 1) {
          return NextResponse.json(
            {
              success: false,
              error: "Only one image is allowed for testimonials",
            },
            { status: 400 }
          );
        }

        console.log(`Processing new testimonial image...`);
        const uploadResult = await uploadSingleFile(
          imageFiles[0],
          TESTIMONIALS_CONFIG
        );

        if (!uploadResult.success) {
          return NextResponse.json(
            {
              success: false,
              error: "Image upload failed",
              details: uploadResult.errors,
            },
            { status: 400 }
          );
        }

        // Delete old image if upload was successful
        if (existingTestimonial.image) {
          console.log("Deleting old image...");
          await deleteFiles(
            [existingTestimonial.image],
            TESTIMONIALS_CONFIG.uploadPath
          );
        }

        finalImageUrl = uploadResult.files[0];
      } else {
        // If no new image provided and not keeping existing, image is required
        return NextResponse.json(
          { success: false, error: "Image is required for testimonials" },
          { status: 400 }
        );
      }
    }

    // Update testimonial in database
    console.log("Updating testimonial in database...");
    const updatedTestimonial = await prisma.testimonial.update({
      where: { id: testimonialId },
      data: {
        name: name.trim(),
        role: role.trim(),
        content: content.trim(),
        rating: numericRating,
        image: finalImageUrl,
        updatedAt: new Date(),
      },
    });

    console.log(
      `Testimonial updated successfully with ID: ${updatedTestimonial.id}`
    );

    // Revalidate any cached pages that might show this data
    revalidatePath("/testimonials");
    revalidatePath("/admin/testimonials");

    return NextResponse.json({
      success: true,
      data: {
        id: updatedTestimonial.id,
        name: updatedTestimonial.name,
        role: updatedTestimonial.role,
        rating: updatedTestimonial.rating,
        image: updatedTestimonial.image,
      },
      message: `Testimonial from "${name}" updated successfully`,
    });
  } catch (error) {
    console.error("Error in testimonials PUT API route:", error);

    // Handle specific Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      switch (error.code) {
        case "P2002":
          return NextResponse.json(
            {
              success: false,
              error: "A testimonial with this information already exists",
            },
            { status: 409 }
          );
        case "P2025":
          return NextResponse.json(
            { success: false, error: "Testimonial not found" },
            { status: 404 }
          );
        default:
          console.error("Prisma error:", error);
      }
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update testimonial",
      },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a testimonial
export async function DELETE(request: NextRequest) {
  try {
    console.log("Starting testimonial deletion via API...");

    const body = await request.json();
    const testimonialId = body.id;

    if (!testimonialId) {
      return NextResponse.json(
        { success: false, error: "Testimonial ID is required" },
        { status: 400 }
      );
    }

    // Check if testimonial exists and get its data (including image)
    const existingTestimonial = await prisma.testimonial.findUnique({
      where: { id: testimonialId },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });

    if (!existingTestimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Delete associated image file from disk using the utility
    let fileCleanupResult = { deleted: [], failed: [] } as {
      deleted: string[];
      failed: string[];
    };

    if (existingTestimonial.image) {
      console.log(`Deleting testimonial image file...`);
      fileCleanupResult = await deleteFiles(
        [existingTestimonial.image],
        TESTIMONIALS_CONFIG.uploadPath
      );

      if (fileCleanupResult.deleted.length > 0) {
        console.log(`Successfully deleted image file`);
      }
      if (fileCleanupResult.failed.length > 0) {
        console.warn(`Failed to delete image file`);
      }
    }

    // Delete testimonial from database
    console.log(`Deleting testimonial from database: ${testimonialId}`);
    const deletedTestimonial = await prisma.testimonial.delete({
      where: { id: testimonialId },
    });

    console.log(`Testimonial deleted successfully: ${deletedTestimonial.name}`);

    // Revalidate any cached pages that might show this data
    revalidatePath("/testimonials");
    revalidatePath("/admin/testimonials");

    return NextResponse.json({
      success: true,
      data: {
        id: deletedTestimonial.id,
        name: deletedTestimonial.name,
        imageDeleted: fileCleanupResult.deleted.length > 0,
      },
      message: `Testimonial from "${deletedTestimonial.name}" deleted successfully`,
    });
  } catch (error) {
    console.error("Error in testimonials DELETE API route:", error);

    // Handle specific Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      switch (error.code) {
        case "P2025":
          return NextResponse.json(
            { success: false, error: "Testimonial not found" },
            { status: 404 }
          );
        case "P2003":
          return NextResponse.json(
            {
              success: false,
              error: "Cannot delete testimonial due to existing references",
            },
            { status: 409 }
          );
        default:
          console.error("Prisma error:", error);
      }
    }

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete testimonial",
      },
      { status: 500 }
    );
  }
}
