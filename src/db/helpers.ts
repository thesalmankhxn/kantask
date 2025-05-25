import { timestamp, text } from "drizzle-orm/pg-core";
import {
  user as usersTable,
  organization as organizationsTable,
} from "./auth-schema";

export const timestampColumns = {
  createdAt: timestamp().notNull(),
  updatedAt: timestamp(),
};

export const deletedAtColumn = {
  deletedAt: timestamp(),
};

export const orgColumns = {
  creatorId: text("creator_id").references(() => usersTable.id),
  organizationId: text("organization_id").references(
    () => organizationsTable.id,
    {
      onDelete: "cascade",
    }
  ),
};

export const commonColumns = {
  ...timestampColumns,
  ...deletedAtColumn,
  ...orgColumns,
};
