import { redirect } from "next/navigation"
import { asc, eq } from "drizzle-orm"
import { db } from "@/db"
import { todos, users } from "@/db/schema"
import { getUserId } from "@/lib/session"
import { KanbanBoard } from "@/components/kanban-board"
import { COLUMN_DEFS } from "@/lib/types"
import type { Card, Column } from "@/lib/types"

export default async function Home() {
  const userId = await getUserId()
  if (!userId) redirect("/login")

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })
  if (!user) redirect("/login")

  const dbTodos = await db.query.todos.findMany({
    where: eq(todos.userId, userId),
    orderBy: [asc(todos.createdAt)],
  })

  const columns: Column[] = COLUMN_DEFS.map((col) => ({
    ...col,
    cards: dbTodos
      .filter((t) => t.status === col.id)
      .map((t): Card => ({
        id: t.id,
        title: t.title,
        description: t.description,
        assignee: t.assignee,
        priority: t.priority,
      })),
  }))

  return <KanbanBoard initialColumns={columns} username={user.username} />
}
