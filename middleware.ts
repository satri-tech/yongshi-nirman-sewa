import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect unauthenticated users away from protected routes
  if (!token && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect authenticated users away from auth pages or home
  if (
    token &&
    (pathname === "/" || pathname.startsWith("/auth")) &&
    !pathname.startsWith("/admin")
  ) {
    const redirectUrl = token.isVerified ? "/admin" : "/verification";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Prevent verified users from accessing verification page
  if (token?.isVerified && pathname.startsWith("/verification")) {
    const redirectUrl = "/admin";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Prevent unverified users from accessing  admin route
  if (token && !token.isVerified && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/verification", request.url));
  }

  return NextResponse.next();
}
