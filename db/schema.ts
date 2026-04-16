import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const priorityEnum = pgEnum("priority", ["low", "medium", "high"])
export const statusEnum = pgEnum("status", ["todo", "in-progress", "done"])

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const todos = pgTable("todos", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  status: statusEnum("status").notNull().default("todo"),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  assignee: text("assignee").notNull(),
  priority: priorityEnum("priority").notNull().default("medium"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})
