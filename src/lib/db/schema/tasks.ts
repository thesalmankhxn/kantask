import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { projects } from "./projects"; // Import projects for the relation

/**
 * @enum {string} TaskStatusEnum
 * @description Defines the possible statuses for a task.
 */
export const taskStatusEnum = pgEnum("task_status", [
  "todo",
  "in_progress",
  "done",
]);

/**
 * @enum {string} TaskPriorityEnum
 * @description Defines the possible priorities for a task.
 */
export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
]);

/**
 * @table tasks
 * @description Stores task information. Each task belongs to a project.
 */
export const tasks = pgTable("tasks", {
  /**
   * @column id
   * @type {string} UUID
   * @description The unique identifier for the task (Primary Key). Automatically generated.
   */
  id: uuid("id").defaultRandom().primaryKey(),
  /**
   * @column title
   * @type {string} Text
   * @description The title of the task. This field is required.
   */
  title: text("title").notNull(),
  /**
   * @column description
   * @type {string} Text (nullable)
   * @description A detailed description of the task. Optional.
   */
  description: text("description"),
  /**
   * @column status
   * @type {TaskStatusEnum}
   * @description The current status of the task. Defaults to 'todo'.
   * @see {@link taskStatusEnum}
   */
  status: taskStatusEnum("status").default("todo").notNull(),
  /**
   * @column priority
   * @type {TaskPriorityEnum}
   * @description The priority of the task. Defaults to 'medium'.
   * @see {@link taskPriorityEnum}
   */
  priority: taskPriorityEnum("priority").default("medium").notNull(),
  /**
   * @column projectId
   * @type {string} UUID
   * @description The identifier of the project this task belongs to (Foreign Key). This field is required.
   *              If the referenced project is deleted, this task will also be deleted due to 'onDelete: cascade'.
   */
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  /**
   * @column createdAt
   * @type {Date} Timestamp
   * @description The date and time when the task was created. Defaults to the current timestamp.
   */
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  /**
   * @column updatedAt
   * @type {Date} Timestamp
   * @description The date and time when the task was last updated. Defaults to the current timestamp.
   */
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * @relation taskRelations
 * @description Defines the relations for the 'tasks' table.
 *              A task belongs to one project.
 */
export const taskRelations = relations(tasks, ({ one }) => ({
  /**
   * @property project
   * @description The project to which the task belongs.
   *              The link is established via 'tasks.projectId' referencing 'projects.id'.
   */
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}));
