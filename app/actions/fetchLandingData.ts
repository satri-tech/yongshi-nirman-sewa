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
    });

    if (!landingData) {
      return {
        success: false,
        message: "Landing page section not found.",
        data: null,
      };
    }

    return {
      success: true,
      data: landingData,
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

    // Upsert AboutUs record using fixed singleton ID
    const updatedAboutUs = await prisma.landingPage.upsert({
      where: { id: SINGLETON_ID },
      update: {
        title,
        description,
        sliderImages: images,
      },
      create: {
        title,
        id: SINGLETON_ID,
        sliderImages: images,
        description,
      },
    });

    revalidatePath("/");
    return {
      success: true,
      message: "Landing page section updated successfully.",
      data: updatedAboutUs,
    };
  } catch (error) {
    console.error("Error updating About Us:", error);
    return {
      success: false,
      message: "Failed to update About Us. Please try again.",
    };
  }
}
