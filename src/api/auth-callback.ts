import { createServerFn } from "@tanstack/react-start";
import {
  getAuth,
  clerkClient as getClerkClient,
} from "@clerk/tanstack-react-start/server";
import jwt from "jsonwebtoken";
import { db } from "~/db";
import { users, session as hybridSession, organizations } from "~/db/schema";
import { eq } from "drizzle-orm";
import { TimeSpan, createDate } from "oslo";
import { getWebRequest } from "@tanstack/react-start/server";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER || "kantask-app";
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "kantask-client";
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set.");
}
if (!CLERK_SECRET_KEY) {
  throw new Error("CLERK_SECRET_KEY environment variable is not set.");
}

// Initialize Clerk Backend Client
const clerkClient = getClerkClient({ secretKey: CLERK_SECRET_KEY });

interface ClerkEmail {
  id: string;
  emailAddress: string;
  // Add other properties if needed from Clerk's EmailAddress type
}

/**
 * Server function to handle post-authentication steps:
 * - Ensures user exists in the local database.
 * - Creates a hybrid session in the database.
 * - Generates a JWT for client-side use.
 */
export const handleAuthCallback = createServerFn({ method: "POST" }).handler(
  async function () {
    const request = getWebRequest();
    if (!request) {
      throw new Error("Could not access the request object.");
    }

    const { userId, orgId: activeOrganizationIdFromClerk } =
      await getAuth(request);

    if (!userId) {
      // This case should ideally be handled by Clerk redirects or route protection before calling this function
      throw new Error("User not authenticated with Clerk.");
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    if (!clerkUser) {
      throw new Error("Could not fetch user details from Clerk.");
    }

    const userEmailObj = clerkUser.emailAddresses.find(
      (e: ClerkEmail) => e.id === clerkUser.primaryEmailAddressId
    );
    const userEmail = userEmailObj?.emailAddress;

    if (!userEmail) {
      throw new Error("Primary email not found for Clerk user.");
    }

    const [dbUser] = await db
      .insert(users)
      .values({
        id: clerkUser.id,
        name:
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
          userEmail,
        email: userEmail,
        image: clerkUser.imageUrl,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          name:
            `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
            userEmail,
          email: userEmail,
          image: clerkUser.imageUrl,
        },
      })
      .returning();

    const sessionToken = crypto.randomUUID();
    const expiresAt = createDate(new TimeSpan(365, "d"));
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("remoteAddress") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    let activeOrgIdInDb: string | null = null;
    if (activeOrganizationIdFromClerk) {
      const [orgExists] = await db
        .select({ id: organizations.id })
        .from(organizations)
        .where(eq(organizations.id, activeOrganizationIdFromClerk))
        .limit(1);
      if (orgExists) {
        activeOrgIdInDb = orgExists.id;
      } else {
        // Optionally create org or log warning
        // console.warn(`Organization ${activeOrganizationIdFromClerk} from Clerk not found in DB.`);
      }
    }

    const [newSession] = await db
      .insert(hybridSession)
      .values({
        token: sessionToken,
        userId: dbUser.id,
        expiresAt,
        activeOrganizationId: activeOrgIdInDb,
        ipAddress,
        userAgent,
      })
      .returning();

    const jwtPayload = {
      sub: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      image: dbUser.image,
      // role: dbUser.role, // TODO: Add role to user and session
      activeOrganizationId: newSession.activeOrganizationId,
      sessionId: newSession.id,
      jti: sessionToken,
    };

    const token = jwt.sign(jwtPayload, JWT_SECRET, {
      expiresIn: "365d",
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });

    return { jwt: token, user: dbUser };
  }
);
