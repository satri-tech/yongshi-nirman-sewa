// lib/auth-utils.ts - Optimized version
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export type UserRole = "user" | "admin";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Single source of truth - call this once per request
export async function getAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      authenticated: false,
      verified: false,
      admin: false,
      user: null,
    };
  }

  return {
    authenticated: true,
    verified: session.user.isVerified || false,
    admin: session.user.role === "admin",
    user: {
      id: session.user.id,
      name: session.user.name || "",
      email: session.user.email || "",
      role: (session.user.role || "user") as UserRole,
      isVerified: session.user.isVerified || false,
    },
  };
}

// Simple page protection functions
export async function requireAuth() {
  const auth = await getAuth();
  if (!auth.authenticated) redirect("/auth/signin");
  return auth;
}

export async function requireVerified() {
  const auth = await requireAuth();
  if (!auth.verified) redirect("/verification");
  return auth;
}

export async function requireAdmin() {
  const auth = await requireVerified();
  if (!auth.admin) redirect("/");
  return auth;
}

// For server actions - returns response instead of redirecting
export async function checkPermissions(
  needsAdmin = false,
  needsVerified = false
) {
  const auth = await getAuth();
  console.log(auth)

  if (!auth.authenticated) {
    return { authorized: false, error: "Authentication required" };
  }

  if (needsVerified && !auth.verified) {
    return { authorized: false, error: "Verification required" };
  }

  if (needsAdmin && !auth.admin) {
    return { authorized: false, error: "Admin access required" };
  }

  return { authorized: true, user: auth.user };
}

// Client-side helper
export function getClientAuth(session: any) {
  if (!session?.user) {
    return { authenticated: false, verified: false, admin: false, user: null };
  }

  return {
    authenticated: true,
    verified: session.user.isVerified || false,
    admin: session.user.role === "admin",
    user: session.user,
  };
}
