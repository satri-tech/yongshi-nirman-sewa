// app/api/projects/route.ts
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir, access } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Allowed file types and their extensions
const ALLOWED_FILE_TYPES = {
  // Images
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  // Documents
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
    ".docx",
  ],
  "application/vnd.ms-excel": [".xls"],
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
    ".xlsx",
  ],
  "application/vnd.ms-powerpoint": [".ppt"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    ".pptx",
  ],
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Helper function to validate file type
function isValidFileType(file: File): boolean {
  const allowedTypes = Object.keys(ALLOWED_FILE_TYPES);
  return allowedTypes.includes(file.type);
}

// Helper function to get file extension from MIME type
function getFileExtension(file: File): string {
  const extensions =
    ALLOWED_FILE_TYPES[file.type as keyof typeof ALLOWED_FILE_TYPES];
  if (extensions && extensions.length > 0) {
    return extensions[0];
  }
  // Fallback to original file extension
  const originalExtension = file.name.split(".").pop();
  return originalExtension ? `.${originalExtension}` : ".bin";
}

// Helper function to ensure directory exists
async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await access(dirPath);
  } catch {
    // Directory doesn't exist, create it
    await mkdir(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

// Helper function to save uploaded files to public/projects
async function saveFilesToPublic(files: File[]): Promise<string[]> {
  const uploadDir = join(process.cwd(), "public", "projects");

  // Ensure the projects directory exists
  await ensureDirectoryExists(uploadDir);

  const savedFiles: string[] = [];

  for (const file of files) {
    try {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File ${file.name} exceeds maximum size of 5MB`);
      }

      // Validate file type
      if (!isValidFileType(file)) {
        throw new Error(
          `File type ${file.type} is not allowed for ${file.name}`
        );
      }

      // Generate unique filename
      const fileExtension = getFileExtension(file);
      const uniqueFilename = `${uuidv4()}${fileExtension}`;
      const filePath = join(uploadDir, uniqueFilename);

      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Write file to disk
      await writeFile(filePath, buffer);
      console.log(`Successfully saved file: ${uniqueFilename}`);

      // Store the public URL path (accessible via web)
      const publicUrl = `${uniqueFilename}`;
      savedFiles.push(publicUrl);
    } catch (error) {
      console.error(`Error saving file ${file.name}:`, error);
      throw new Error(
        `Failed to save file ${file.name}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  return savedFiles;
}

// Helper function to clean up file name for logging
function sanitizeFileName(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.-]/g, "_");
}

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
    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Project title is required" },
        { status: 400 }
      );
    }
    if (!description?.trim()) {
      return NextResponse.json(
        { success: false, error: "Project description is required" },
        { status: 400 }
      );
    }
    if (!location?.trim()) {
      return NextResponse.json(
        { success: false, error: "Location is required" },
        { status: 400 }
      );
    }
    if (!area?.trim()) {
      return NextResponse.json(
        { success: false, error: "Area is required" },
        { status: 400 }
      );
    }
    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status is required" },
        { status: 400 }
      );
    }

    // Extract and process files
    const attachments = formData.getAll("attachments") as File[];
    let imageUrls: string[] = [];

    if (attachments && attachments.length > 0) {
      // Filter out empty files and log file info
      const validFiles = attachments.filter((file) => {
        const isValid = file && file.size > 0 && file.name !== "undefined";
        if (isValid) {
          console.log(
            `Processing file: ${sanitizeFileName(file.name)}, Size: ${
              file.size
            } bytes, Type: ${file.type}`
          );
        }
        return isValid;
      });

      if (validFiles.length > 0) {
        console.log(`Uploading ${validFiles.length} files...`);
        imageUrls = await saveFilesToPublic(validFiles);
        console.log(`Successfully uploaded ${imageUrls.length} files`);
      } else {
        console.log("No valid files to upload");
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
        images: imageUrls, // Array of uploaded file URLs
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log(`Project created successfully with ID: ${portfolio.id}`);

    // Revalidate any cached pages that might show this data
    revalidatePath("/projects"); // Adjust path as needed
    revalidatePath("/portfolio"); // Adjust path as needed

    return NextResponse.json({
      success: true,
      data: {
        id: portfolio.id,
        title: portfolio.title,
        imageCount: imageUrls.length,
        images: imageUrls,
      },
      message: `Project "${title}" created successfully with ${imageUrls.length} files uploaded`,
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

    // Parse the form data
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
    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Project title is required" },
        { status: 400 }
      );
    }
    if (!description?.trim()) {
      return NextResponse.json(
        { success: false, error: "Project description is required" },
        { status: 400 }
      );
    }
    if (!location?.trim()) {
      return NextResponse.json(
        { success: false, error: "Location is required" },
        { status: 400 }
      );
    }
    if (!area?.trim()) {
      return NextResponse.json(
        { success: false, error: "Area is required" },
        { status: 400 }
      );
    }
    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status is required" },
        { status: 400 }
      );
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

    // Extract and process new files
    const newAttachments = formData.getAll("attachments") as File[];
    let newImageUrls: string[] = [];

    if (newAttachments && newAttachments.length > 0) {
      // Filter out empty files and log file info
      const validFiles = newAttachments.filter((file) => {
        const isValid = file && file.size > 0 && file.name !== "undefined";
        if (isValid) {
          console.log(
            `Processing file: ${sanitizeFileName(file.name)}, Size: ${
              file.size
            } bytes, Type: ${file.type}`
          );
        }
        return isValid;
      });

      if (validFiles.length > 0) {
        console.log(`Uploading ${validFiles.length} new files...`);
        newImageUrls = await saveFilesToPublic(validFiles);
        console.log(`Successfully uploaded ${newImageUrls.length} files`);
      } else {
        console.log("No valid new files to upload");
      }
    }

    // Combine existing and new images
    const allImages = [...keepImages, ...newImageUrls];

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
    revalidatePath("/projects"); // Adjust path as needed
    revalidatePath("/portfolio"); // Adjust path as needed
    revalidatePath("/admin/portfolio"); // Admin page

    return NextResponse.json({
      success: true,
      data: {
        id: updatedPortfolio.id,
        title: updatedPortfolio.title,
        imageCount: allImages.length,
        images: allImages,
      },
      message: `Project "${title}" updated successfully`,
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

// Helper function to delete files from public/projects
async function deleteFilesFromPublic(imageUrls: string[]): Promise<{
  deleted: string[];
  failed: string[];
}> {
  const deleted: string[] = [];
  const failed: string[] = [];

  for (const imageUrl of imageUrls) {
    try {
      // Extract filename from URL (e.g., "/projects/uuid.jpg" -> "uuid.jpg")
      const filename = imageUrl.replace(/^\/projects\//, "");

      if (!filename) {
        console.warn(`Invalid image URL format: ${imageUrl}`);
        failed.push(imageUrl);
        continue;
      }

      // Construct full file path
      const filePath = join(process.cwd(), "public", "projects", filename);

      // Check if file exists before attempting to delete
      try {
        await access(filePath);
        // File exists, delete it
        const { unlink } = await import("fs/promises");
        await unlink(filePath);
        console.log(`Deleted file: ${filename}`);
        deleted.push(imageUrl);
      } catch (error) {
        // File doesn't exist or can't be accessed
        console.warn(`File not found or inaccessible: ${filename}`, error);
        failed.push(imageUrl);
      }
    } catch (error) {
      console.error(`Error deleting file ${imageUrl}:`, error);
      failed.push(imageUrl);
    }
  }

  return { deleted, failed };
}

// DELETE handler to delete a project
export async function DELETE(request: NextRequest) {
  try {
    console.log("Starting project deletion via API...");

    // Parse the request body
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

    // Delete associated image files from disk
    let fileCleanupResult = { deleted: [], failed: [] } as {
      deleted: string[];
      failed: string[];
    };

    if (existingProject.images && existingProject.images.length > 0) {
      console.log(`Deleting ${existingProject.images.length} image files...`);
      fileCleanupResult = await deleteFilesFromPublic(existingProject.images);

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
