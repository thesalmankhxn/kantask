import { db } from "@/db";
import { users } from "@/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { NextAuthOptions, User } from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import config from "./config";

export const authConfig: NextAuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: config.GOOGLE_ID,
      clientSecret: config.GOOGLE_SECRET,
    }),
    Github({
      clientId: config.GITHUB_ID,
      clientSecret: config.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user!.id = token.id;
        session.user!.name = token.name;
        session.user!.email = token.email;
        session.user!.image = token.picture;
      }

      return session;
    },
    async jwt({ token, user }) {
      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, token.email || ""))
        .limit(1);

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
  },
};

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: string;
    };
  }
}
