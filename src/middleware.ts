import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const protectedPaths = ["/workspace", "/settings"];
    const path = req.nextUrl.pathname;
    const isProtectedPath = protectedPaths.includes(path);
    const token = await getToken({ req });

    const isAuth = !!token;

    if (isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(new URL(`/login`, req.url));
    }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

/**
 * Configure which paths the middleware should run on
 */
export const config = {
  matcher: ["/", "/workspace/:path*", "/settings/:path*"],
};
