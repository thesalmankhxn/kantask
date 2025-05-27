import jwt from "jsonwebtoken";
import { db } from "~/db";
import {
  session as hybridSessionTable,
  users as usersTable,
} from "~/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { getWebRequest, setResponseStatus } from "@tanstack/react-start/server";
import { createMiddleware } from "@tanstack/react-start";
import { redirect, isRedirect, isNotFound } from "@tanstack/react-router";

// Infer types from Drizzle schema
export type User = typeof usersTable.$inferSelect;
export type SessionHybrid = typeof hybridSessionTable.$inferSelect;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER || "kantask-app";
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "kantask-client";
const SIGN_IN_URL = process.env.VITE_CLERK_SIGN_IN_URL || "/sign-in";

export interface AuthContext {
  user?: User;
  dbSession?: SessionHybrid;
  isAuthenticated: boolean;
}

/**
 * Custom error class for non-redirect authentication failures.
 */
class AuthProcessingError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = "AuthProcessingError";
  }
}

/**
 * Middleware to verify JWT and database session.
 * Populates `context.auth` which has the AuthContext shape.
 * If authentication fails and should redirect, it throws a redirect() error.
 * For other processing errors, it throws AuthProcessingError.
 */
export const verifySessionMiddleware = createMiddleware().server(
  async ({ next, context: incomingContext }) => {
    const safeIncomingContext =
      typeof incomingContext === "object" && incomingContext !== null
        ? incomingContext
        : {};

    const request = getWebRequest();
    if (!request) {
      console.error("Auth Middleware: Web Request not available");
      throw new Error("Internal Server Error: Request context unavailable");
    }

    const url = new URL(request.url);
    const path = url.pathname;

    const publicPathPrefixes = [
      "/api/auth-callback",
      "/api/webhooks",
      "/assets",
    ];
    const publicExactPaths = [
      SIGN_IN_URL,
      process.env.VITE_CLERK_SIGN_UP_URL || "/sign-up",
      "/",
      "/favicon.ico",
    ];

    let isPublic =
      publicExactPaths.includes(path) ||
      publicPathPrefixes.some((prefix) => path.startsWith(prefix));

    if (isPublic) {
      return next({
        context: {
          ...safeIncomingContext,
          auth: {
            isAuthenticated: false,
            user: undefined,
            dbSession: undefined,
          } satisfies AuthContext,
        },
      });
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw redirect({
        to: SIGN_IN_URL,
        search: { redirectUrl: path },
        throw: true,
      });
    }

    const token = authHeader.substring(7);

    try {
      if (!JWT_SECRET) {
        console.error("JWT_SECRET is not configured on the server.");
        throw new AuthProcessingError("Server configuration error", 500);
      }

      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      }) as jwt.JwtPayload;

      if (!decoded.jti || typeof decoded.jti !== "string") {
        throw new AuthProcessingError("Malformed JWT: Missing or invalid jti");
      }
      const sessionToken = decoded.jti;

      const dbSessionResult = await db
        .select()
        .from(hybridSessionTable)
        .where(
          and(
            eq(hybridSessionTable.token, sessionToken),
            gt(hybridSessionTable.expiresAt, new Date())
          )
        )
        .limit(1);

      const currentDbSession = dbSessionResult[0];

      if (!currentDbSession) {
        throw redirect({
          to: SIGN_IN_URL,
          search: { redirectUrl: path, error: "session_expired" },
          throw: true,
        });
      }

      const userResult = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, currentDbSession.userId))
        .limit(1);
      const currentUser = userResult[0];

      if (!currentUser) {
        console.error(
          `User ${currentDbSession.userId} for session ${currentDbSession.id} not found in DB.`
        );
        throw redirect({
          to: SIGN_IN_URL,
          search: { redirectUrl: path, error: "user_not_found" },
          throw: true,
        });
      }

      return next({
        context: {
          ...safeIncomingContext,
          auth: {
            user: currentUser,
            dbSession: currentDbSession,
            isAuthenticated: true,
          } satisfies AuthContext,
        },
      });
    } catch (error: any) {
      if (isRedirect(error) || isNotFound(error)) {
        throw error;
      }

      console.error(
        "Authentication processing error:",
        error.message,
        error.stack
      );

      if (error instanceof AuthProcessingError) {
        setResponseStatus(error.statusCode);
        throw error;
      } else if (
        error.name === "TokenExpiredError" ||
        error.name === "JsonWebTokenError"
      ) {
        throw redirect({
          to: SIGN_IN_URL,
          search: { redirectUrl: path, error: "token_invalid" },
          throw: true,
        });
      }

      throw redirect({
        to: SIGN_IN_URL,
        search: { redirectUrl: path, error: "auth_failed" },
        throw: true,
      });
    }
  }
);
