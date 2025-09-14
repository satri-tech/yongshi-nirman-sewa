// app/api/projects/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  uploadFiles,
  deleteFiles,
  extractFilesFromFormData,
  PROJECTS_CONFIG,
  UploadResult,
} from "@/lib/upload/fileUpload";

// POST API route handler
export async function POST(request: NextRequest) {
  try {
    console.log("Starting project creation via API...");

    // Parse the form data
    const formData = await request.formData();

    // Extract and validate form data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const client = formData.get("clientname") as string;
    const area = formData.get("area") as string;
    const status = formData.get("status") as
      | "Completed"
      | "InProgress"
      | "OnHold"
      | "Pending";
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;

    // Validate required fields
    const requiredFields = [
      { field: title, name: "Project title" },
      { field: description, name: "Project description" },
      { field: location, name: "Location" },
      { field: area, name: "Area" },
      { field: status, name: "Status" },
    ];

    for (const { field, name } of requiredFields) {
      if (!field?.trim()) {
        return NextResponse.json(
          { success: false, error: `${name} is required` },
          { status: 400 }
        );
      }
    }

    // Extract and process files using the utility
    const attachments = extractFilesFromFormData(formData, "attachments");
    let uploadResult: UploadResult = { success: true, files: [], errors: [] };

    if (attachments.length > 0) {
      console.log(`Processing ${attachments.length} files...`);
      uploadResult = await uploadFiles(attachments, PROJECTS_CONFIG);

      if (!uploadResult.success && uploadResult.files.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "File upload failed",
            details: uploadResult.errors,
          },
          { status: 400 }
        );
      }

      if (uploadResult.errors.length > 0) {
        console.warn("Some files failed to upload:", uploadResult.errors);
      }
    }

    // Parse dates
    const parsedStartDate = startDate ? new Date(startDate) : null;
    const parsedEndDate = endDate ? new Date(endDate) : null;

    // Validate date logic
    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      return NextResponse.json(
        { success: false, error: "Start date cannot be after end date" },
        { status: 400 }
      );
    }

    // Create project in database
    console.log("Creating project in database...");
    const portfolio = await prisma.portfolio.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        client: client?.trim() || null,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        area: area.trim(),
        status,
        images: uploadResult.files, // Array of uploaded file URLs
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log(`Project created successfully with ID: ${portfolio.id}`);

    // Revalidate any cached pages that might show this data
    revalidatePath("/projects");
    revalidatePath("/portfolio");

    return NextResponse.json({
      success: true,
      data: {
        id: portfolio.id,
        title: portfolio.title,
        imageCount: uploadResult.files.length,
        images: uploadResult.files,
      },
      message: `Project "${title}" created successfully with ${uploadResult.files.length} files uploaded`,
      uploadErrors:
        uploadResult.errors.length > 0 ? uploadResult.errors : undefined,
    });
  } catch (error) {
    console.error("Error in API route:", error);

    // Handle specific Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      switch (error.code) {
        case "P2002":
          return NextResponse.json(
            {
              success: false,
              error: "A project with this title already exists",
            },
            { status: 409 }
          );
        case "P2025":
          return NextResponse.json(
            { success: false, error: "Database record not found" },
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
          error instanceof Error ? error.message : "Failed to create project",
      },
      { status: 500 }
    );
  }
}

// PUT handler to update a project
export async function PUT(request: NextRequest) {
  try {
    console.log("Starting project update via API...");

    const formData = await request.formData();

    // Extract project ID
    const projectId = formData.get("id") as string;
    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Extract and validate form data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const client = formData.get("clientname") as string;
    const area = formData.get("area") as string;
    const status = formData.get("status") as
      | "Completed"
      | "InProgress"
      | "OnHold"
      | "Pending";
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const existingImages = formData.get("existingImages") as string;

    // Validate required fields
    const requiredFields = [
      { field: title, name: "Project title" },
      { field: description, name: "Project description" },
      { field: location, name: "Location" },
      { field: area, name: "Area" },
      { field: status, name: "Status" },
    ];

    for (const { field, name } of requiredFields) {
      if (!field?.trim()) {
        return NextResponse.json(
          { success: false, error: `${name} is required` },
          { status: 400 }
        );
      }
    }

    // Check if project exists
    const existingProject = await prisma.portfolio.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Parse existing images (if any)
    let keepImages: string[] = [];
    if (existingImages) {
      try {
        keepImages = JSON.parse(existingImages);
      } catch (e) {
        console.error("Error parsing existing images:", e);
      }
    }

    // Extract and process new files using the utility
    const newAttachments = extractFilesFromFormData(formData, "attachments");
    let uploadResult: UploadResult = { success: true, files: [], errors: [] };

    if (newAttachments.length > 0) {
      console.log(`Processing ${newAttachments.length} new files...`);
      uploadResult = await uploadFiles(newAttachments, PROJECTS_CONFIG);

      if (uploadResult.errors.length > 0) {
        console.warn("Some new files failed to upload:", uploadResult.errors);
      }
    }

    // Combine existing and new images
    const allImages = [...keepImages, ...uploadResult.files];

    // Parse dates
    const parsedStartDate = startDate ? new Date(startDate) : null;
    const parsedEndDate = endDate ? new Date(endDate) : null;

    // Validate date logic
    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      return NextResponse.json(
        { success: false, error: "Start date cannot be after end date" },
        { status: 400 }
      );
    }

    // Update project in database
    console.log("Updating project in database...");
    const updatedPortfolio = await prisma.portfolio.update({
      where: { id: projectId },
      data: {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        client: client?.trim() || null,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        area: area.trim(),
        status,
        images: allImages,
        updatedAt: new Date(),
      },
    });

    console.log(`Project updated successfully with ID: ${updatedPortfolio.id}`);

    // Revalidate any cached pages that might show this data
    revalidatePath("/projects");
    revalidatePath("/portfolio");
    revalidatePath("/admin/portfolio");

    return NextResponse.json({
      success: true,
      data: {
        id: updatedPortfolio.id,
        title: updatedPortfolio.title,
        imageCount: allImages.length,
        images: allImages,
      },
      message: `Project "${title}" updated successfully`,
      uploadErrors:
        uploadResult.errors.length > 0 ? uploadResult.errors : undefined,
    });
  } catch (error) {
    console.error("Error in API route:", error);

    // Handle specific Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      switch (error.code) {
        case "P2002":
          return NextResponse.json(
            {
              success: false,
              error: "A project with this title already exists",
            },
            { status: 409 }
          );
        case "P2025":
          return NextResponse.json(
            { success: false, error: "Project not found" },
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
          error instanceof Error ? error.message : "Failed to update project",
      },
      { status: 500 }
    );
  }
}

// DELETE handler to delete a project
export async function DELETE(request: NextRequest) {
  try {
    console.log("Starting project deletion via API...");

    const body = await request.json();
    const projectId = body.id;

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Check if project exists and get its data (including images)
    const existingProject = await prisma.portfolio.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        title: true,
        images: true,
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Delete associated image files from disk using the utility
    let fileCleanupResult = { deleted: [], failed: [] } as {
      deleted: string[];
      failed: string[];
    };

    if (existingProject.images && existingProject.images.length > 0) {
      console.log(`Deleting ${existingProject.images.length} image files...`);
      fileCleanupResult = await deleteFiles(
        existingProject.images,
        PROJECTS_CONFIG.uploadPath
      );

      if (fileCleanupResult.deleted.length > 0) {
        console.log(
          `Successfully deleted ${fileCleanupResult.deleted.length} files`
        );
      }
      if (fileCleanupResult.failed.length > 0) {
        console.warn(
          `Failed to delete ${fileCleanupResult.failed.length} files`
        );
      }
    }

    // Delete project from database
    console.log(`Deleting project from database: ${projectId}`);
    const deletedProject = await prisma.portfolio.delete({
      where: { id: projectId },
    });

    console.log(`Project deleted successfully: ${deletedProject.title}`);

    // Revalidate any cached pages that might show this data
    revalidatePath("/projects");
    revalidatePath("/portfolio");
    revalidatePath("/admin/portfolio");

    return NextResponse.json({
      success: true,
      data: {
        id: deletedProject.id,
        title: deletedProject.title,
        filesDeleted: fileCleanupResult.deleted.length,
        filesFailed: fileCleanupResult.failed.length,
      },
      message: `Project "${deletedProject.title}" deleted successfully`,
    });
  } catch (error) {
    console.error("Error in DELETE API route:", error);

    // Handle specific Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      switch (error.code) {
        case "P2025":
          return NextResponse.json(
            { success: false, error: "Project not found" },
            { status: 404 }
          );
        case "P2003":
          return NextResponse.json(
            {
              success: false,
              error: "Cannot delete project due to existing references",
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
          error instanceof Error ? error.message : "Failed to delete project",
      },
      { status: 500 }
    );
  }
}
