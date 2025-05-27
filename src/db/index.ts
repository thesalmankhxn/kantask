import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";

// Ensure the DATABASE_URL environment variable is set
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create a Neon database client
const sql = neon(process.env.DATABASE_URL!);

// Initialize Drizzle with the Neon client and schema
// The schema object will contain all your table definitions
export const db = drizzle(sql, { schema });
