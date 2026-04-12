import { CheckSquare } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type ActiveTaskCardProps = {
  text: string
  checked: boolean
  onTextChange: (text: string) => void
  onCheckedChange: (checked: boolean) => void
}

export function ActiveTaskCard({
  text,
  checked,
  onTextChange,
  onCheckedChange,
}: ActiveTaskCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
            <CheckSquare className="size-5" />
          </div>
          <div>
            <CardTitle>Active task</CardTitle>
            <CardDescription>Your current task stays in place between sessions.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="flex items-start gap-3 rounded-[24px] border border-border/80 bg-background/80 p-4">
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => onCheckedChange(event.target.checked)}
            className="mt-1 size-5 rounded border-border text-primary focus:ring-4 focus:ring-ring/20"
            aria-label="Mark active task as complete"
          />
          <div className="flex-1 space-y-2">
            <Input
              value={text}
              onChange={(event) => onTextChange(event.target.value)}
              placeholder="[Active task text placeholder]"
              className={checked ? "line-through opacity-70" : ""}
              aria-label="Active task"
            />
            <p className="text-xs text-muted-foreground">
              Checking the box creates one completed-task history entry.
            </p>
          </div>
        </label>
      </CardContent>
    </Card>
  )
}
