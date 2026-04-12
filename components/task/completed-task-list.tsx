import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatHistoryTimestamp } from "@/lib/utils/dates"
import type { CompletedTaskEntry } from "@/types/study-timer"

type CompletedTaskListProps = {
  items: CompletedTaskEntry[]
  onDelete: (id: string) => void
}

export function CompletedTaskList({
  items,
  onDelete,
}: CompletedTaskListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Completed tasks</CardTitle>
        <CardDescription>Delete individual entries without touching the active task.</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-border/80 px-4 py-6 text-sm text-muted-foreground">
            [Completed tasks appear here]
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-[24px] border border-border/80 bg-background/80 p-4"
              >
                <div className="min-w-0 space-y-1">
                  <p className="truncate text-sm font-medium text-foreground">{item.text}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatHistoryTimestamp(item.completedAt)}
                  </p>
                </div>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => onDelete(item.id)}
                  aria-label={`Delete completed task ${item.text}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
