import { prisma } from "@/lib/prisma";
import {
  deleteFiles,
  extractFilesFromFormData,
  TEAM_NEW_MEMBER_CONFIG,
  TESTIMONIALS_CONFIG,
  UploadResult,
  uploadSingleFile,
} from "@/lib/upload/fileUpload";
import { NextRequest, NextResponse } from "next/server";

// POST API route handler for creating testimonials
export async function POST(request: NextRequest) {
  try {
    console.log("Starting testimonial creation via API...");

    // Parse the form data
    const formData = await request.formData();

    // Extract and validate form data
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const facebookUrl = formData.get("facebookUrl") as string;

    // Validate required fields
    const requiredFields = [
      { field: name, name: "Name" },
      { field: role, name: "Role" },
      { field: facebookUrl, name: "FacebookUrl" },
    ];

    for (const { field, name } of requiredFields) {
      if (!field?.trim()) {
        return NextResponse.json(
          { success: false, error: `${name} is required` },
          { status: 400 }
        );
      }
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
      uploadResult = await uploadSingleFile(
        imageFiles[0],
        TEAM_NEW_MEMBER_CONFIG
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
    const teamMember = await prisma.team.create({
      data: {
        name: name.trim(),
        position: role.trim(),
        facebookurl: facebookUrl,
        image: uploadResult.files[0], // Single image
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log(`Testimonial created successfully with ID: ${teamMember.id}`);

    return NextResponse.json({
      success: true,
      data: {
        id: teamMember.id,
        name: teamMember.name,
        position: teamMember.position,
        facebookUrl: teamMember.facebookurl,
        image: teamMember.image,
      },
      message: `Team Member from "${name}" created successfully with image`,
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

// DELETE handler to delete a testimonial
export async function DELETE(request: NextRequest) {
  try {
    console.log("Starting team member deletion via API...");

    const body = await request.json();
    const testimonialId = body.id;

    if (!testimonialId) {
      return NextResponse.json(
        { success: false, error: "Team member ID is required" },
        { status: 400 }
      );
    }

    // Check if testimonial exists and get its data (including image)
    const existingTestimonial = await prisma.team.findUnique({
      where: { id: testimonialId },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });

    if (!existingTestimonial) {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }

    // Delete associated image file from disk using the utility
    let fileCleanupResult = { deleted: [], failed: [] } as {
      deleted: string[];
      failed: string[];
    };

    if (existingTestimonial.image) {
      console.log(`Deleting team members image file...`);
      fileCleanupResult = await deleteFiles(
        [existingTestimonial.image],
        TEAM_NEW_MEMBER_CONFIG.uploadPath
      );

      if (fileCleanupResult.deleted.length > 0) {
        console.log(`Successfully deleted image file`);
      }
      if (fileCleanupResult.failed.length > 0) {
        console.warn(`Failed to delete image file`);
      }
    }

    // Delete testimonial from database
    console.log(`Deleting team member from database: ${testimonialId}`);
    const deletedImage = await prisma.team.delete({
      where: { id: testimonialId },
    });

    console.log(`Team member deleted successfully: ${deletedImage.name}`);

    return NextResponse.json({
      success: true,
      data: {
        id: deletedImage.id,
        name: deletedImage.name,
        imageDeleted: fileCleanupResult.deleted.length > 0,
      },
      message: `Team member from "${deletedImage.name}" deleted successfully`,
    });
  } catch (error) {
    console.error("Error in team member DELETE API route:", error);

    // Handle specific Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      switch (error.code) {
        case "P2025":
          return NextResponse.json(
            { success: false, error: "Team member not found" },
            { status: 404 }
          );
        case "P2003":
          return NextResponse.json(
            {
              success: false,
              error: "Cannot delete team member due to existing references",
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
            : "Failed to delete team member",
      },
      { status: 500 }
    );
  }
}
