"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft, ArrowRight, MoreHorizontal, Trash2, User } from "lucide-react"
import type { Card, ColumnId, Priority } from "./kanban-board"

interface KanbanCardProps {
  card: Card
  columnId: ColumnId
  onMoveCard: (cardId: string, fromColumnId: ColumnId, toColumnId: ColumnId) => void
  onDeleteCard: (cardId: string, columnId: ColumnId) => void
}

const priorityStyles: Record<Priority, { bg: string; text: string; label: string }> = {
  low: {
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-600 dark:text-slate-400",
    label: "Low",
  },
  medium: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
    label: "Medium",
  },
  high: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
    label: "High",
  },
}

const columnOrder: ColumnId[] = ["todo", "in-progress", "done"]

export function KanbanCard({ card, columnId, onMoveCard, onDeleteCard }: KanbanCardProps) {
  const priorityStyle = priorityStyles[card.priority]
  const currentIndex = columnOrder.indexOf(columnId)
  const canMoveLeft = currentIndex > 0
  const canMoveRight = currentIndex < columnOrder.length - 1

  const handleMoveLeft = () => {
    if (canMoveLeft) {
      onMoveCard(card.id, columnId, columnOrder[currentIndex - 1])
    }
  }

  const handleMoveRight = () => {
    if (canMoveRight) {
      onMoveCard(card.id, columnId, columnOrder[currentIndex + 1])
    }
  }

  return (
    <div className="group rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-medium leading-snug text-card-foreground">{card.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {canMoveLeft && (
              <DropdownMenuItem onClick={handleMoveLeft}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Move to {columnOrder[currentIndex - 1] === "todo" ? "To Do" : "In Progress"}
              </DropdownMenuItem>
            )}
            {canMoveRight && (
              <DropdownMenuItem onClick={handleMoveRight}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Move to {columnOrder[currentIndex + 1] === "in-progress" ? "In Progress" : "Done"}
              </DropdownMenuItem>
            )}
            {(canMoveLeft || canMoveRight) && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={() => onDeleteCard(card.id, columnId)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{card.description}</p>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
            <User className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">{card.assignee}</span>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyle.bg} ${priorityStyle.text}`}
        >
          {priorityStyle.label}
        </span>
      </div>

      <div className="mt-3 flex gap-2 border-t border-border pt-3">
        <Button
          variant="outline"
          size="sm"
          className="h-8 flex-1 text-xs"
          onClick={handleMoveLeft}
          disabled={!canMoveLeft}
        >
          <ArrowLeft className="mr-1 h-3 w-3" />
          Move Left
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 flex-1 text-xs"
          onClick={handleMoveRight}
          disabled={!canMoveRight}
        >
          Move Right
          <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
