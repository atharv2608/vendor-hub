import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Get the token from the request
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Check the current path
  const { pathname } = req.nextUrl;

  // Redirect to dashboard page if user is authenticated and trying to access /sign-in
  if (token && (pathname === "/sign-in" || pathname === "/")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token && (pathname.startsWith("/dashboard") || pathname === "/") ) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Allow access to other routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up", "/"],
};
