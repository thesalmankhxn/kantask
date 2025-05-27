import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", // 'mysql' | 'sqlite' | 'postgresql'
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations", // Directory to output migrations
  dbCredentials: {
    // You must provide a connection string for drizzle-kit to connect to your database
    // This is typically your Neon connection string from .env.local or similar
    // IMPORTANT: Ensure this is kept secure and not committed to version control if it contains sensitive info.
    // It's recommended to use an environment variable here.
    url: process.env.DATABASE_URL!,
  },
  // Optionally, you can pass a an verbose: true to see more logs
  verbose: true,
  // Optionally, you can pass a strict: true to abort the process if there are any errors
  strict: true,
});
