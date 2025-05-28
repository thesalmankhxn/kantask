import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { tasks } from "./tasks";

/**
 * @table projects
 * @description Stores project information. Each project can have multiple tasks.
 */
export const projects = pgTable("projects", {
  /**
   * @column id
   * @type {string} UUID
   * @description The unique identifier for the project (Primary Key). Automatically generated.
   */
  id: uuid("id").defaultRandom().primaryKey(),
  /**
   * @column name
   * @type {string} Text
   * @description The name of the project. This field is required.
   */
  name: text("name").notNull(),
  /**
   * @column description
   * @type {string} Text (nullable)
   * @description A detailed description of the project. Optional.
   */
  description: text("description"),
  /**
   * @column createdAt
   * @type {Date} Timestamp
   * @description The date and time when the project was created. Defaults to the current timestamp.
   */
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  /**
   * @column updatedAt
   * @type {Date} Timestamp
   * @description The date and time when the project was last updated. Defaults to the current timestamp and updates on modification (though Drizzle doesn't auto-update this on its own, needs trigger or application logic).
   */
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * @relation projectRelations
 * @description Defines the relations for the 'projects' table.
 *              A project can have many tasks.
 */
export const projectRelations = relations(projects, ({ many }) => ({
  /**
   * @property tasks
   * @description A list of tasks associated with the project.
   */
  tasks: many(tasks),
}));
