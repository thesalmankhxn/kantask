import config from "@/lib/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let sslmode = "";

if (config.APP_ENV === "production") {
  sslmode = "?sslmode=require";
}

export const queryClient = postgres(process.env.DATABASE_URL + sslmode);

export const db = drizzle(queryClient, { logger: true });
