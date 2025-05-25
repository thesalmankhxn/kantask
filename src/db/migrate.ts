import { migrate } from "drizzle-orm/neon-http/migrator";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import { db } from "./index";

// Load environment variables
dotenv.config();

const main = async () => {
  try {
    await migrate(db, { migrationsFolder: "src/db/migrations" });
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

main();
