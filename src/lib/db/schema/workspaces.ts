import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projects } from "./projects";
// import { workspaceMembers } from "./workspace-members"; // Removed as this table is deleted
import { userTable } from "./user"; // For owner relation

/**
 * @table workspaces
 * @description Stores workspace information. Each workspace has an owner and can have multiple projects.
 *              Invited member information is now stored directly in the userTable.
 */
export const workspaces = pgTable("workspaces", {
  /**
   * @column id
   * @type {string} UUID
   * @description The unique identifier for the workspace (Primary Key). Automatically generated.
   */
  id: uuid("id").defaultRandom().primaryKey(),
  /**
   * @column name
   * @type {string} Text
   * @description The name of the workspace. This field is required.
   */
  name: text("name").notNull(),
  /**
   * @column description
   * @type {string} Text (nullable)
   * @description A detailed description of the workspace. Optional.
   */
  description: text("description"),
  /**
   * @column ownerId
   * @type {string} Text (references userTable.id)
   * @description The ID of the user who owns and is the primary admin of this workspace.
   */
  ownerId: text("owner_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "restrict" }), // Restrict deletion of user if they own workspaces
  /**
   * @column createdAt
   * @type {Date} Timestamp
   * @description The date and time when the workspace was created. Defaults to the current timestamp.
   */
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  /**
   * @column updatedAt
   * @type {Date} Timestamp
   * @description The date and time when the workspace was last updated. Defaults to the current timestamp.
   */
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * @relation workspaceRelations
 * @description Defines the relations for the 'workspaces' table.
 */
export const workspaceRelations = relations(workspaces, ({ many, one }) => ({
  /**
   * @property owner
   * @description The user who owns this workspace.
   */
  owner: one(userTable, {
    fields: [workspaces.ownerId],
    references: [userTable.id],
  }),
  /**
   * @property projects
   * @description A list of projects associated with the workspace.
   */
  projects: many(projects),
  // workspaceMembers: many(workspaceMembers), // Removed relation
}));
