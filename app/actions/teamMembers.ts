"use server";

import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/utils/auth-utils";

export interface ITeamMember {
  id: string;
  name: string;
  image: string | null; // Allow null
  position: string;
  displayOrder: number | null; // Should be number, and allow null
  facebookurl: string | null; // Allow null
}

export async function fetchTeamMembers(): Promise<ApiResponse<ITeamMember[]>> {
  try {
    const teamMembers = await prisma.team.findMany({
      orderBy: {
        displayOrder: "asc",
      },
      select: {
        id: true,
        name: true,
        image: true,
        position: true,
        displayOrder: true,
        facebookurl: true,
      },
    });
    return {
      success: true,
      data: teamMembers,
      message: "Team Members Fetched Succesfully",
    };
  } catch (error) {
    console.log(error);
    console.log(error);
    return {
      success: false,
      error: "Failed to fetch team members. Please try again.",
    };
  }
}
