"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkPermissions } from "@/utils/auth-utils";

export interface ISocialLink {
  id?: string;
  platform: string;
  icon: string;
  url: string;
  displayOrder: number;
}

export interface IContactInfo {
  address: string;
  phone: string;
  email: string;
  socialLinks?: ISocialLink[];
}

const SINGLETON_ID = "singleton";

export async function updateContactInfo(data: IContactInfo) {
  try {
    const auth = await checkPermissions(true, true);
    if (!auth.authorized) {
      return { success: false, message: auth.error };
    }

    const { address, phone, email, socialLinks = [] } = data;

    if (!address || !phone || !email) {
      return {
        success: false,
        message: "Address, phone, and email are required.",
      };
    }

    // Upsert contact info and handle social links
    const updatedContactInfo = await prisma.contactInfo.upsert({
      where: { id: SINGLETON_ID },
      update: {
        address,
        phone,
        email,
      },
      create: {
        id: SINGLETON_ID,
        address,
        phone,
        email,
      },
    });

    // Delete existing social links and create new ones
    await prisma.socialLink.deleteMany({
      where: { contactInfoId: SINGLETON_ID },
    });

    if (socialLinks.length > 0) {
      await prisma.socialLink.createMany({
        data: socialLinks.map((link, index) => ({
          platform: link.platform,
          icon: link.icon,
          url: link.url,
          displayOrder: link.displayOrder ?? index,
          contactInfoId: SINGLETON_ID,
        })),
      });
    }

    revalidatePath("/");
    revalidatePath("/contact");

    return {
      success: true,
      message: "Contact information updated successfully.",
      data: updatedContactInfo,
    };
  } catch (error) {
    console.error("Error updating contact info:", error);
    return {
      success: false,
      message: "Failed to update contact information. Please try again.",
    };
  }
}

export async function fetchContactInfo() {
  try {
    const contactInfo = await prisma.contactInfo.findUnique({
      where: { id: SINGLETON_ID },
      include: {
        socialLinks: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    return {
      success: true,
      data: contactInfo,
    };
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return {
      success: false,
      message: "Failed to fetch contact information.",
      data: null,
    };
  }
}
