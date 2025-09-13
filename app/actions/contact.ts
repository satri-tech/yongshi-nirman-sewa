"use server";

import { prisma } from "@/lib/prisma";
import { ApiResponse, checkPermissions } from "@/utils/auth-utils";
import { ContactUs } from "@prisma/client";

// Define the type for contact data
interface ContactData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

// Fetch all contacts - Admin only
export async function fetchContacts(): Promise<ApiResponse<ContactUs[]>> {
  try {
    // Single auth check
    const auth = await checkPermissions(true, true); // needsAdmin=true, needsVerified=true

    if (!auth.authorized) {
      return {
        success: false,
        error: auth.error,
      };
    }

    const contacts = await prisma.contactUs.findMany({
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      message: "Contacts fetched successfully",
      data: contacts,
    };
  } catch {
    return {
      success: false,
      error: "Failed to fetch contacts. Please try again.",
    };
  }
}

// Delete contact - Admin only
export async function deleteContact(id: string): Promise<ApiResponse> {
  try {
    if (!id) {
      return { success: false, error: "Contact ID is required" };
    }

    const auth = await checkPermissions(true, true);

    if (!auth.authorized) {
      return { success: false, error: auth.error };
    }

    const existingContact = await prisma.contactUs.findUnique({
      where: { id },
      select: { id: true, fullName: true, email: true },
    });

    if (!existingContact) {
      return { success: false, error: "Contact not found" };
    }

    await prisma.contactUs.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Contact deleted successfully",
    };
  } catch {
    return { success: false, error: "Failed to delete contact" };
  }
}

export async function createContact(data: ContactData) {
  try {
    const { fullName, email, phone, message } = data;

    // Basic validation
    if (!fullName || !email || !message) {
      throw new Error("Full name, email, and message are required.");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Please enter a valid email address.");
    }

    // Save to database
    const newContact = await prisma.contactUs.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || "",
        message: message.trim(),
      },
    });

    return {
      success: true,
      message: "Thank you for your message! We'll get back to you soon.",
      data: newContact,
    };
  } catch {
    return {
      success: false,
      message: "Failed to send message. Please try again.",
    };
  }
}
