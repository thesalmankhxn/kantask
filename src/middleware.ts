import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware function to handle authentication and route protection
 * @param request - The incoming request object
 */
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/signup";

  // Get the token from the cookies
  const token = request.cookies.get("token")?.value || "";

  // Redirect logic
  if (isPublicPath && token) {
    // If user is logged in and tries to access auth pages, redirect to workspace
    return NextResponse.redirect(new URL("/workspace", request.url));
  }

  if (!isPublicPath && !token) {
    // If user is not logged in and tries to access protected pages, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

/**
 * Configure which paths the middleware should run on
 */
export const config = {
  matcher: ["/", "/login", "/signup", "/workspace/:path*", "/settings/:path*"],
};
