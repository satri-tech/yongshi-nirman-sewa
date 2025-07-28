// lib/fetchUsers.ts

import { prisma } from "../prisma";

export async function getAllUsers() {
  console.log("🔥 Fetching users from DB...");
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

  return users;
}
