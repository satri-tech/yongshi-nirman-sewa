import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/utils/auth-utils";
import { deleteFiles, TESTIMONIALS_CONFIG } from "@/lib/upload/fileUpload";

export interface ITestimonial {
  id: string;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
}

export async function fetchTestimonials(): Promise<
  ApiResponse<ITestimonial[]>
> {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      message: "Testimonials fetched successfully",
      data: testimonials,
    };
  } catch {
    return {
      success: false,
      error: "Failed to fetch testimonials. Please try again.",
    };
  }
}

export async function deleteTestimonial(id: string): Promise<
  ApiResponse<{
    id: string;
    name: string;
    imageDeleted: boolean;
    imageDeleteError?: string;
  }>
> {
  try {
    // First, get the testimonial data to retrieve the image path
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
      },
    });

    if (!testimonial) {
      return {
        success: false,
        error: "Testimonial not found",
      };
    }

    // Delete the image file from disk if it exists
    let imageDeleted = false;
    let imageDeleteError: string | undefined;

    if (testimonial.image) {
      try {
        console.log(`Attempting to delete image: ${testimonial.image}`);
        const deleteResult = await deleteFiles(
          [testimonial.image],
          TESTIMONIALS_CONFIG.uploadPath
        );

        if (deleteResult.deleted.length > 0) {
          imageDeleted = true;
          console.log(`Successfully deleted image file: ${testimonial.image}`);
        } else if (deleteResult.failed.length > 0) {
          imageDeleteError = `Failed to delete image file: ${testimonial.image}`;
          console.warn(imageDeleteError);
        }
      } catch (error) {
        imageDeleteError = `Error deleting image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
        console.error(imageDeleteError);
      }
    }

    // Delete the testimonial from database
    const deletedTestimonial = await prisma.testimonial.delete({
      where: { id },
    });

    return {
      success: true,
      message: `Testimonial from "${
        deletedTestimonial.name
      }" deleted successfully${imageDeleted ? " with image" : ""}${
        imageDeleteError ? " (image deletion failed)" : ""
      }`,
      data: {
        id: deletedTestimonial.id,
        name: deletedTestimonial.name,
        imageDeleted,
        imageDeleteError,
      },
    };
  } catch (error) {
    console.error("Error deleting testimonial:", error);

    // Handle Prisma-specific errors
    if (error && typeof error === "object" && "code" in error) {
      switch (error.code) {
        case "P2025":
          return {
            success: false,
            error: "Testimonial not found",
          };
        case "P2003":
          return {
            success: false,
            error: "Cannot delete testimonial due to existing references",
          };
        default:
          console.error("Prisma error:", error);
      }
    }

    return {
      success: false,
      error: "Failed to delete testimonial. Please try again.",
    };
  }
}
