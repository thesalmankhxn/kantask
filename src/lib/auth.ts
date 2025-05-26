import { db } from "@/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { User } from "next-auth";
import authConfig from "./auth.config";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";

export const { auth, signIn, signOut, handlers } = NextAuth({
  adapter: DrizzleAdapter(db),
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user!.id = token.id;
        session.user!.name = token.name;
        session.user!.email = token.email!;
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
          token.id = user?.id!;
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
  ...authConfig,
});

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
