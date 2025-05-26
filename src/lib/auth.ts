import { db } from "@/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import config from "./config";

export const { auth, signIn, signOut, handlers } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: config.NEXTAUTH_SECRET!,
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session }) {
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      console.log("HOLAAAAAA!!!", user);
    },
  },
  ...authConfig,
});
