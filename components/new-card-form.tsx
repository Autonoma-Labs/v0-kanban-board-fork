"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Card, Priority } from "@/lib/types"

interface NewCardFormProps {
  onSubmit: (card: Omit<Card, "id">) => void
  onCancel: () => void
}

export function NewCardForm({ onSubmit, onCancel }: NewCardFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [assignee, setAssignee] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !assignee.trim()) return

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      assignee: assignee.trim(),
      priority,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the task..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignee">Assignee</Label>
        <Input
          id="assignee"
          placeholder="Enter assignee name..."
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
          <SelectTrigger id="priority">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-slate-500" />
                Low
              </div>
            </SelectItem>
            <SelectItem value="medium">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                Medium
              </div>
            </SelectItem>
            <SelectItem value="high">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                High
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Create Task
        </Button>
      </div>
    </form>
  )
}
