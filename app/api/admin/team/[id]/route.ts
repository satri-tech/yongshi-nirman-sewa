// app/api/admin/teamMembers/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

interface IUpdatedData {
  name: string;
  position: string;
  image: string;
  facebookurl: string;
  isActive: boolean;
  displayOrder: number;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate the ID
    if (!id) {
      return NextResponse.json(
        { error: "Team member ID is required" },
        { status: 400 }
      );
    }

    // Extract fields that can be updated
    const { name, position, image, facebookurl, isActive, displayOrder } = body;

    // Build update object with only provided fields
    const updateData: Partial<IUpdatedData> = {};
    if (name !== undefined) updateData.name = name;
    if (position !== undefined) updateData.position = position;
    if (image !== undefined) updateData.image = image;
    if (facebookurl !== undefined) updateData.facebookurl = facebookurl;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;

    // Update the team member
    const updatedTeamMember = await prisma.team.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Team member updated successfully",
      teamMember: updatedTeamMember,
    });
  } catch (error: unknown) {
    console.error("Error updating team member:", error);

    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Team member not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
