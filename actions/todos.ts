"use server"

import { db } from "@/db"
import { todos } from "@/db/schema"
import { and, asc, eq } from "drizzle-orm"
import { getUserId } from "@/lib/session"
import { revalidatePath } from "next/cache"
import type { ColumnId, Priority } from "@/lib/types"

export async function addTodo(data: {
  title: string
  description: string
  assignee: string
  priority: Priority
}) {
  const userId = await getUserId()
  if (!userId) throw new Error("Not logged in")

  await db.insert(todos).values({
    userId,
    status: "todo",
    title: data.title,
    description: data.description,
    assignee: data.assignee,
    priority: data.priority,
  })

  revalidatePath("/")
}

export async function moveTodo(todoId: string, toStatus: ColumnId) {
  const userId = await getUserId()
  if (!userId) throw new Error("Not logged in")

  await db
    .update(todos)
    .set({ status: toStatus })
    .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))

  revalidatePath("/")
}

export async function deleteTodo(todoId: string) {
  const userId = await getUserId()
  if (!userId) throw new Error("Not logged in")

  await db
    .delete(todos)
    .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))

  revalidatePath("/")
}

export async function getTodos(userId: string) {
  return db.query.todos.findMany({
    where: eq(todos.userId, userId),
    orderBy: [asc(todos.createdAt)],
  })
}
