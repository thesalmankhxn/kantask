import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Configuration for protected and public routes
 * @constant {Object} routeConfig
 */
const routeConfig = {
  // Routes that require authentication
  protected: ["/dashboard", "/profile", "/settings", "/workspace"],
  // Routes that should redirect to dashboard if user is authenticated
  auth: ["/login", "/register", "/forgot-password"],
  // Public routes that don't require authentication
  public: ["/", "/about", "/contact", "/api"],
};

/**
 * Checks if the given path matches any of the configured routes
 * @param {string} path - The path to check
 * @param {string[]} routes - Array of routes to match against
 * @returns {boolean} - Whether the path matches any of the routes
 */
const isPathMatching = (path: string, routes: string[]): boolean => {
  return routes.some((route) => path.startsWith(route));
};

/**
 * Middleware function to handle authentication and route protection
 * @param {NextRequest} request - The incoming request
 * @returns {Promise<NextResponse>} - The response to send
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the token using next-auth/jwt
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Handle API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check if the path is protected
  if (isPathMatching(pathname, routeConfig.protected)) {
    if (!token) {
      // Redirect to login if no token exists
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Check if the path is an auth route (login, register, etc.)
  if (isPathMatching(pathname, routeConfig.auth)) {
    if (token) {
      // Redirect to workspace if user is already authenticated
      return NextResponse.redirect(new URL("/workspace", request.url));
    }
    return NextResponse.next();
  }

  // Allow access to public routes
  if (isPathMatching(pathname, routeConfig.public)) {
    return NextResponse.next();
  }

  // Default: allow the request to proceed
  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 * @constant {Object} config
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
