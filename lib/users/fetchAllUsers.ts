// lib/users/fetchAllUsers.ts
import { prisma } from "../prisma";

export async function getAllUsers() {
  const timestamp = new Date().toISOString();
  console.log(`🔥 [${timestamp}] Fetching users from DB...`);

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`✅ [${timestamp}] Found ${users.length} users`);
    return users;
  } catch (error) {
    console.error(`❌ [${timestamp}] Database error:`, error);
    throw error;
  }
}
