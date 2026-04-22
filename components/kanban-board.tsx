"use client"

import { useTransition, useState } from "react"
import { KanbanColumn } from "./kanban-column"
import { NewCardForm } from "./new-card-form"
import { Button } from "@/components/ui/button"
import { LogOut, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { addTodo, moveTodo, deleteTodo } from "@/actions/todos"
import { logout } from "@/actions/auth"
import type { Card, Column, ColumnId, Priority } from "@/lib/types"

export type { Priority, ColumnId, Card, Column }

interface KanbanBoardProps {
  initialColumns: Column[]
  username: string
}

export function KanbanBoard({ initialColumns, username }: KanbanBoardProps) {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [, startTransition] = useTransition()

  const moveCard = (cardId: string, fromColumnId: ColumnId, toColumnId: ColumnId) => {
    if (fromColumnId === toColumnId) return

    setColumns((prevColumns) => {
      const newColumns = prevColumns.map((col) => ({
        ...col,
        cards: [...col.cards],
      }))

      const fromColumn = newColumns.find((col) => col.id === fromColumnId)
      const toColumn = newColumns.find((col) => col.id === toColumnId)

      if (!fromColumn || !toColumn) return prevColumns

      const cardIndex = fromColumn.cards.findIndex((card) => card.id === cardId)
      if (cardIndex === -1) return prevColumns

      const [card] = fromColumn.cards.splice(cardIndex, 1)
      toColumn.cards.push(card)

      return newColumns
    })

    startTransition(() => moveTodo(cardId, toColumnId))
  }

  const addCard = (card: Omit<Card, "id">) => {
    const optimisticId = `optimistic-${Date.now()}`
    const newCard: Card = { ...card, id: optimisticId }

    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === "todo" ? { ...col, cards: [...col.cards, newCard] } : col
      )
    )
    setIsDialogOpen(false)

    startTransition(() =>
      addTodo({
        title: card.title,
        description: card.description,
        assignee: card.assignee,
        priority: card.priority as Priority,
      })
    )
  }

  const deleteCard = (cardId: string, columnId: ColumnId) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((card) => card.id !== cardId) }
          : col
      )
    )

    startTransition(() => deleteTodo(cardId))
  }

  const totalTasks = columns.reduce((sum, col) => sum + col.cards.length, 0)

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Project Board
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Signed in as <span className="font-medium">{username}</span>
              <span className="mx-2">&middot;</span>
              <span data-testid="total-task-count">{totalTasks} {totalTasks === 1 ? "task" : "tasks"}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <NewCardForm onSubmit={addCard} onCancel={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
            <form action={logout}>
              <Button type="submit" variant="outline" size="icon">
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Log out</span>
              </Button>
            </form>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onMoveCard={moveCard}
              onDeleteCard={deleteCard}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
