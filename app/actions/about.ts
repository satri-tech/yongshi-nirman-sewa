"use server";

import { prisma } from "@/lib/prisma"; // Adjust the import path to your Prisma client
import { revalidatePath } from "next/cache";

export interface IAboutUs {
  mainHeading: string;
  description: string;
  stat1Number: string;
  stat1Label: string;
  stat2Number: string;
  stat2Label: string;
  stat3Number: string;
  stat3Label: string;
}

const SINGLETON_ID = "singleton";

export async function updateAboutUs(data: IAboutUs) {
  try {
    const {
      mainHeading,
      description,
      stat1Label,
      stat1Number,
      stat2Label,
      stat2Number,
      stat3Label,
      stat3Number,
    } = data;

    // Validate required fields
    if (!mainHeading || !description) {
      return {
        success: false,
        message: "Main heading and description are required.",
      };
    }

    // Upsert AboutUs record using fixed singleton ID
    const updatedAboutUs = await prisma.aboutUs.upsert({
      where: { id: SINGLETON_ID },
      update: {
        mainHeading,
        description,
        stat1Number,
        stat1Label,
        stat2Number,
        stat2Label,
        stat3Number,
        stat3Label,
      },
      create: {
        id: SINGLETON_ID,
        mainHeading,
        description,
        stat1Number,
        stat1Label,
        stat2Number,
        stat2Label,
        stat3Number,
        stat3Label,
      },
    });

    // Revalidate relevant pages
    revalidatePath("/"); // homepage
    revalidatePath("/about"); // about page

    return {
      success: true,
      message: "About Us section updated successfully.",
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

// Get About Us data
export async function fetchAboutUs() {
  try {
    const aboutUs = await prisma.aboutUs.findUnique({
      where: { id: SINGLETON_ID },
    });

    if (!aboutUs) {
      return {
        success: false,
        message: "About Us section not found.",
        data: null,
      };
    }

    return {
      success: true,
      data: aboutUs,
    };
  } catch (error) {
    console.error("Error fetching About Us:", error);
    return {
      success: false,
      message: "Failed to fetch About Us data.",
      data: null,
    };
  }
}
