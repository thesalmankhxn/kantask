import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Determine the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script to apply database migrations.
 *
 * This script connects to the Neon database using the DATABASE_URL environment variable
 * and applies any pending migrations located in the '../../drizzle/migrations' directory
 * relative to this script's location.
 *
 * It uses drizzle-orm's built-in migrator for neon-http.
 */
async function main() {
  console.log("Starting migration process...");

  if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL environment variable is not set.");
    process.exit(1);
  }

  try {
    // Create a Neon database client specifically for migrations
    const migrationClient = neon(process.env.DATABASE_URL);

    // Initialize Drizzle with the migration client
    // Note: The schema is not strictly needed for migrate function but can be passed.
    // We are omitting it here as migrate focuses on the SQL files.
    const db = drizzle(migrationClient);

    console.log("Connected to the database.");

    // Define the path to the migrations folder
    // It's crucial that this path correctly points to your 'drizzle/migrations' folder
    const migrationsFolder = path.join(
      __dirname,
      "..",
      "..",
      "drizzle",
      "migrations"
    );
    console.log(`Looking for migrations in: ${migrationsFolder}`);

    // Apply migrations
    await migrate(db, { migrationsFolder });

    console.log("Migrations applied successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

main();
