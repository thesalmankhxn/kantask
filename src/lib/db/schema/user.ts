import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { usersInCommunityTable } from "./community";
import { workspaces } from "./workspaces"; // For ownedWorkspaces relation

/**
 * @enum {string} UserWorkspaceRoleEnum
 * @description Defines the possible roles a user can have within a workspace they are a member of (not an owner).
 *              This enum is for typing the 'role' field within the 'workspace_memberships' JSONB column.
 */
export const userWorkspaceRoleEnum = pgEnum("user_workspace_role", [
  "admin", // Invited user with admin privileges in the workspace
  "member", // Invited user with member privileges in the workspace
]);

/**
 * @typedef {object} WorkspaceMembership
 * @property {string} workspaceId - The UUID of the workspace.
 * @property {UserWorkspaceRoleEnum} role - The user's role in that workspace.
 */

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  /**
   * @column workspace_memberships
   * @type {WorkspaceMembership[]} JSONB
   * @description Stores an array of objects, each representing a workspace the user is an invited member of,
   *              along with their role in that workspace. E.g., [{ workspaceId: 'uuid', role: 'admin' }].
   *              Workspace ownership is handled by the 'ownerId' in the 'workspaces' table.
   */
  workspaceMemberships: jsonb("workspace_memberships")
    .$type<Array<{ workspaceId: string; role: "admin" | "member" }>>()
    .default([]),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const userRelations = relations(userTable, ({ many }) => ({
  usersInCommunityTable: many(usersInCommunityTable),
  /**
   * @property ownedWorkspaces
   * @description A list of workspaces owned by this user (derived from workspaces.ownerId).
   */
  ownedWorkspaces: many(workspaces), // This relation still works based on workspaces.ownerId
}));

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
});

export const accountTable = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verificationTable = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});
