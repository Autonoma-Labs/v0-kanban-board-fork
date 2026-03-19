"use client"

import { useState } from "react"
import { KanbanColumn } from "./kanban-column"
import { NewCardForm } from "./new-card-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    cards: [
      {
        id: "1",
        title: "Research competitors",
        description: "Analyze top 5 competitors and document findings",
        assignee: "Sarah Chen",
        priority: "high",
      },
      {
        id: "2",
        title: "Update documentation",
        description: "Review and update API documentation for v2",
        assignee: "Alex Kim",
        priority: "low",
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    cards: [
      {
        id: "3",
        title: "Design system update",
        description: "Implement new color palette across components",
        assignee: "Jordan Lee",
        priority: "medium",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    cards: [
      {
        id: "4",
        title: "User interviews",
        description: "Completed 10 user interviews for feedback",
        assignee: "Sarah Chen",
        priority: "high",
      },
    ],
  },
]

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
  }

  const addCard = (card: Omit<Card, "id">) => {
    const newCard: Card = {
      ...card,
      id: Date.now().toString(),
    }

    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === "todo" ? { ...col, cards: [...col.cards, newCard] } : col
      )
    )
    setIsDialogOpen(false)
  }

  const deleteCard = (cardId: string, columnId: ColumnId) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((card) => card.id !== cardId) }
          : col
      )
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Project Board
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track and manage your tasks across different stages
            </p>
          </div>
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
