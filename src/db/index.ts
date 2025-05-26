import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// Create a connection pool that's Edge-compatible
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);
