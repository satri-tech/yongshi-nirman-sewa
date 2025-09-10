"use server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir, access } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

interface IProjectData {
  title: string;
  description: string;
  location: string;
  client?: string;
  startDate?: string;
  endDate?: string;
  area: string;
  status: "Completed" | "InProgress" | "OnHold" | "Pending";
}

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
      const publicUrl = `/projects/${uniqueFilename}`;
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

// Main server action to create project with file uploads
export async function createProject(formData: FormData) {
  try {
    console.log("Starting project creation...");

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
      return { success: false, error: "Project title is required" };
    }
    if (!description?.trim()) {
      return { success: false, error: "Project description is required" };
    }
    if (!location?.trim()) {
      return { success: false, error: "Location is required" };
    }
    if (!area?.trim()) {
      return { success: false, error: "Area is required" };
    }
    if (!status) {
      return { success: false, error: "Status is required" };
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
      return { success: false, error: "Start date cannot be after end date" };
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

    return {
      success: true,
      data: {
        id: portfolio.id,
        title: portfolio.title,
        imageCount: imageUrls.length,
        images: imageUrls,
      },
      message: `Project "${title}" created successfully with ${imageUrls.length} images uploaded`,
    };
  } catch (error) {
    console.error("Error in createProject:", error);

    // Handle specific Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      switch ((error as any).code) {
        case "P2002":
          return {
            success: false,
            error: "A project with this title already exists",
          };
        case "P2025":
          return { success: false, error: "Database record not found" };
        default:
          console.error("Prisma error:", error);
      }
    }

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create project",
    };
  }
}
