"use client"

import { Button } from "@/components/ui/button"
import { Trash2, User } from "lucide-react"
import type { Card, ColumnId, Priority } from "@/lib/types"

interface KanbanCardProps {
  card: Card
  columnId: ColumnId
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

export function KanbanCard({ card, columnId, onDeleteCard }: KanbanCardProps) {
  const priorityStyle = priorityStyles[card.priority]

  return (
    <div className="group rounded-lg border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="font-medium leading-snug text-card-foreground">{card.title}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 text-destructive opacity-0 transition-opacity hover:bg-destructive/10 group-hover:opacity-100"
          onClick={() => onDeleteCard(card.id, columnId)}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete card</span>
        </Button>
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
    </div>
  )
}
