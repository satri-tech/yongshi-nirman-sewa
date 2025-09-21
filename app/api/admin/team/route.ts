import { prisma } from "@/lib/prisma";
import {
  deleteFiles,
  extractFilesFromFormData,
  TEAM_NEW_MEMBER_CONFIG,
  UploadResult,
  uploadSingleFile,
} from "@/lib/upload/fileUpload";
import { NextRequest, NextResponse } from "next/server";

// PUT handler for updating a team member
export async function PUT(request: NextRequest) {
  try {
    console.log("Starting team member update via API...");

    const formData = await request.formData();
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Team member ID is required" },
        { status: 400 }
      );
    }

    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const facebookUrl = formData.get("facebookUrl") as string;
    console.log(facebookUrl)
    console.log("-------------Facebook Url:----------- ", facebookUrl,"-------------");

    const existingTeamMember = await prisma.team.findUnique({
      where: { id },
      select: { image: true },
    });

    if (!existingTeamMember) {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }

    let newImageFilename: string | null | undefined = undefined;
    let imageChanged = false;
    const imageFiles = extractFilesFromFormData(formData, "image");
    const removeImage = formData.get("removeImage") === "true";

    if (imageFiles.length > 0) {
      // A new image is being uploaded
      if (existingTeamMember.image) {
        // Delete the old image
        await deleteFiles(
          [existingTeamMember.image],
          TEAM_NEW_MEMBER_CONFIG.uploadPath
        );
      }

      const uploadResult = await uploadSingleFile(
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
      newImageFilename = uploadResult.files[0];
      imageChanged = true;
    } else if (removeImage && existingTeamMember.image) {
      // The image is being explicitly removed
      await deleteFiles(
        [existingTeamMember.image],
        TEAM_NEW_MEMBER_CONFIG.uploadPath
      );
      newImageFilename = null; // Explicitly set to null for removal
      imageChanged = true;
    }
    // If neither condition is met, imageChanged remains false and image stays unchanged

    const updatedTeamMember = await prisma.team.update({
      where: { id },
      data: {
        name: name.trim(),
        position: role.trim(),
        facebookurl: facebookUrl,
        image: imageChanged ? newImageFilename : existingTeamMember.image,
        updatedAt: new Date(),
      },
    });

    console.log(`Team member updated successfully: ${updatedTeamMember.id}`);

    return NextResponse.json({
      success: true,
      data: updatedTeamMember,
      message: `Team member "${updatedTeamMember.name}" updated successfully`,
    });
  } catch (error) {
    console.error("Error in team member PUT API route:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update team member",
      },
      { status: 500 }
    );
  }
}

// POST API route handler for creating testimonials
// POST API route handler for creating team members
export async function POST(request: NextRequest) {
  try {
    console.log("Starting team member creation via API...");

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
      // Use uploadSingleFile for team members (only one image allowed)
      if (imageFiles.length > 1) {
        return NextResponse.json(
          {
            success: false,
            error: "Only one image is allowed for team members",
          },
          { status: 400 }
        );
      }

      console.log(`Processing team member image...`);
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

    // Image is required for team member
    if (uploadResult.files.length === 0) {
      return NextResponse.json(
        { success: false, error: "Image is required for team members" },
        { status: 400 }
      );
    }

    // Get the maximum displayOrder to assign the new member the next order
    console.log("Getting maximum display order...");

    try {
      const result = await prisma.team.aggregate({
        _max: {
          displayOrder: true,
        },
        where: {
          displayOrder: {
            not: null, // Only consider non-null displayOrder values
          },
        },
      });

      // If no team members exist or all have null displayOrder, start with 1
      // Otherwise, increment the maximum by 1
      const nextDisplayOrder = (result._max.displayOrder ?? 0) + 1;
      console.log(`Assigning display order: ${nextDisplayOrder}`);

      // Create team member in database
      console.log("Creating team member in database...");
      const teamMember = await prisma.team.create({
        data: {
          name: name.trim(),
          position: role.trim(),
          facebookurl: facebookUrl,
          image: uploadResult.files[0], // Single image
          displayOrder: nextDisplayOrder,
          isActive: true, // Set as active by default
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      console.log(
        `Team member created successfully with ID: ${teamMember.id} and display order: ${teamMember.displayOrder}`
      );

      return NextResponse.json({
        success: true,
        data: {
          id: teamMember.id,
          name: teamMember.name,
          position: teamMember.position,
          facebookUrl: teamMember.facebookurl,
          image: teamMember.image,
          displayOrder: teamMember.displayOrder,
          isActive: teamMember.isActive,
        },
        message: `Team Member "${name}" created successfully with display order ${teamMember.displayOrder}`,
      });
    } catch (dbError) {
      console.error("Database error while creating team member:", dbError);

      // Clean up uploaded file if database operation failed
      if (uploadResult.files.length > 0) {
        console.log("Cleaning up uploaded file due to database error...");
        await deleteFiles(
          uploadResult.files,
          TEAM_NEW_MEMBER_CONFIG.uploadPath
        );
      }

      throw dbError; // Re-throw to be handled by outer catch block
    }
  } catch (error) {
    console.error("Error in team member API route:", error);

    // Handle specific Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      switch (error.code) {
        case "P2002":
          return NextResponse.json(
            {
              success: false,
              error: "A team member with this information already exists",
            },
            { status: 409 }
          );
        case "P2003":
          return NextResponse.json(
            {
              success: false,
              error: "Database constraint violation",
            },
            { status: 400 }
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
            : "Failed to create team member",
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
