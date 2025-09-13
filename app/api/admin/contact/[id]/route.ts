import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// DELETE /api/admin/contact/[id] - Delete a specific contact message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Contact message ID is required" },
        { status: 400 }
      );
    }

    // Check if contact message exists
    const existingContact = await prisma.contactUs.findUnique({
      where: { id },
    });

    if (!existingContact) {
      return NextResponse.json(
        { success: false, error: "Contact message not found" },
        { status: 404 }
      );
    }

    // Delete the contact message
    await prisma.contactUs.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete contact message" },
      { status: 500 }
    );
  }
}

// GET /api/admin/contact/[id] - Get a specific contact message
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Contact message ID is required" },
        { status: 400 }
      );
    }

    // Get the contact message
    const contactMessage = await prisma.contactUs.findUnique({
      where: { id },
    });

    if (!contactMessage) {
      return NextResponse.json(
        { success: false, error: "Contact message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contactMessage,
    });
  } catch (error) {
    console.error("Error fetching contact message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contact message" },
      { status: 500 }
    );
  }
}
