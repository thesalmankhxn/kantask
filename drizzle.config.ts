import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// TODO: Centralize env reading
const connectionString =
  process.env.NODE_ENV === "development"
    ? "postgresql://postgres:postgres@localhost:5432/kantask"
    : process.env.DATABASE_URL!;

export default defineConfig({
  schema: "./src/lib/db/schema",
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_GxOU5QtwZe0S@ep-summer-poetry-a1clzdff-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
    // url: connectionString,
  },
});
