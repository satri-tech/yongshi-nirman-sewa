"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkPermissions } from "@/utils/auth-utils";

export interface IProjectsSection {
  title: string;
  subtitle: string;
}

const SINGLETON_ID = "singleton";

export async function updateProjectsSection(data: IProjectsSection) {
  try {
    const auth = await checkPermissions(true, true);
    if (!auth.authorized) {
      return { success: false, message: auth.error };
    }

    const { title, subtitle } = data;

    if (!title || !subtitle) {
      return {
        success: false,
        message: "Title and subtitle are required.",
      };
    }

    const updatedProjectsSection = await prisma.projectsSection.upsert({
      where: { id: SINGLETON_ID },
      update: {
        title,
        subtitle,
      },
      create: {
        id: SINGLETON_ID,
        title,
        subtitle,
      },
    });

    revalidatePath("/");
    revalidatePath("/projects");

    return {
      success: true,
      message: "Projects section updated successfully.",
      data: updatedProjectsSection,
    };
  } catch (error) {
    console.error("Error updating projects section:", error);
    return {
      success: false,
      message: "Failed to update projects section. Please try again.",
    };
  }
}

export async function fetchProjectsSection() {
  try {
    const projectsSection = await prisma.projectsSection.findUnique({
      where: { id: SINGLETON_ID },
    });

    return {
      success: true,
      data: projectsSection,
    };
  } catch (error) {
    console.error("Error fetching projects section:", error);
    return {
      success: false,
      message: "Failed to fetch projects section.",
      data: null,
    };
  }
}
