import { createMiddleware, createServerFn, json } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { eq } from "drizzle-orm";
import { auth } from "~/lib/auth/auth";
import { db } from "~/lib/db";
import { userTable } from "~/lib/db/schema";
import { UserMetaSchema } from "./auth.schema";

export const getUserSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getWebRequest();

    if (!request?.headers) {
      return null;
    }

    const userSession = await auth.api.getSession({ headers: request.headers });
    console.log("User session: FROM API", userSession);

    return userSession;
  },
);

export const userMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const userSession = await getUserSession();

    return next({ context: { userSession } });
  },
);

export const userRequiredMiddleware = createMiddleware({ type: "function" })
  .middleware([userMiddleware])
  .server(async ({ next, context }) => {
    if (!context.userSession) {
      throw json(
        { message: "You must be logged in to do that!" },
        { status: 401 },
      );
    }

    return next({ context: { userSession: context.userSession } });
  });

export const updateUser = createServerFn()
  .validator(UserMetaSchema)
  .middleware([userRequiredMiddleware])
  .handler(async ({ data, context: { userSession } }) => {
    await db
      .update(userTable)
      .set({ name: data.username })
      .where(eq(userTable.id, userSession.user.id));
  });
