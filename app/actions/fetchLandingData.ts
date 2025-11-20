"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

const SINGLETON_ID = "singleton";

export interface ILandingPage {
  title: string;
  description: string;
  images: string[];
}

export async function fetchLandingData() {
  try {
    const landingData = await prisma.landingPage.findUnique({
      where: { id: SINGLETON_ID },
      include: {
        sliderImages: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!landingData) {
      return {
        success: false,
        message: "Landing page section not found.",
        data: null,
      };
    }

    // Map to expected format if needed, or return as is.
    // For backward compatibility with some components, we might want to return URLs.
    // But for the admin panel, we might want objects.
    // Let's return the full object with mapped images for now to match the interface roughly,
    // but the interface says images: string[].
    // Let's map it to string[] for the consumer, but the admin API might need more.
    // Actually, the admin page uses the API route, not this action (mostly).
    // The home page uses this action.
    // Home page expects { title, description, sliderImages: string[] } (from schema.prisma before).
    // Now landingData has sliderImages as objects.
    
    return {
      success: true,
      data: {
        ...landingData,
        sliderImages: landingData.sliderImages.map(img => img.url),
      },
    };
  } catch (error) {
    console.error("Error fetching landing page Data:", error);
    return {
      success: false,
      message: "Failed to fetch landing Page data.",
      data: null,
    };
  }
}

export async function updateAboutUs(data: ILandingPage) {
  try {
    const { title, description, images } = data;

    // Validate required fields
    if (!title || !description) {
      return {
        success: false,
        message: "Main title and description are required.",
      };
    }

    // Transaction to update landing page and images
    const updatedLandingPage = await prisma.$transaction(async (tx) => {
      // 1. Update Landing Page details
      const landing = await tx.landingPage.upsert({
        where: { id: SINGLETON_ID },
        update: {
          title,
          description,
        },
        create: {
          id: SINGLETON_ID,
          title,
          description,
        },
      });

      // 2. Handle Images
      // Delete existing images
      await tx.sliderImage.deleteMany({
        where: { landingPageId: SINGLETON_ID },
      });

      // Create new images with positions
      if (images && images.length > 0) {
        await tx.sliderImage.createMany({
          data: images.map((url, index) => ({
            url,
            position: index,
            landingPageId: SINGLETON_ID,
          })),
        });
      }

      return landing;
    });

    revalidatePath("/");
    return {
      success: true,
      message: "Landing page section updated successfully.",
      data: updatedLandingPage,
    };
  } catch (error) {
    console.error("Error updating About Us:", error);
    return {
      success: false,
      message: "Failed to update About Us. Please try again.",
    };
  }
}
