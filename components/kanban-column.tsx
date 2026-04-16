"use client"

import { KanbanCard } from "./kanban-card"
import type { Column, ColumnId } from "@/lib/types"

interface KanbanColumnProps {
  column: Column
  onMoveCard: (cardId: string, fromColumnId: ColumnId, toColumnId: ColumnId) => void
  onDeleteCard: (cardId: string, columnId: ColumnId) => void
}

const columnStyles: Record<ColumnId, { dot: string; bg: string }> = {
  todo: {
    dot: "bg-amber-500",
    bg: "bg-amber-500/10",
  },
  "in-progress": {
    dot: "bg-blue-500",
    bg: "bg-blue-500/10",
  },
  done: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-500/10",
  },
}

export function KanbanColumn({ column, onMoveCard, onDeleteCard }: KanbanColumnProps) {
  const styles = columnStyles[column.id]

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${styles.bg}`}>
          <div className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
        </div>
        <div className="flex items-center gap-2">
          <h2 className="font-medium text-card-foreground">{column.title}</h2>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
            {column.cards.length}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {column.cards.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border py-8">
            <p className="text-sm text-muted-foreground">No tasks yet</p>
          </div>
        ) : (
          column.cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              columnId={column.id}
              onMoveCard={onMoveCard}
              onDeleteCard={onDeleteCard}
            />
          ))
        )}
      </div>
    </div>
  )
}
