export type Priority = "low" | "medium" | "high"
export type ColumnId = "todo" | "in-progress" | "done"

export interface Card {
  id: string
  title: string
  description: string
  assignee: string
  priority: Priority
}

export interface Column {
  id: ColumnId
  title: string
  cards: Card[]
}

export const COLUMN_DEFS: Omit<Column, "cards">[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
]
