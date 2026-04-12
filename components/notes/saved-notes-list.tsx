import { FileText, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatHistoryTimestamp } from "@/lib/utils/dates"
import type { NoteSnapshot } from "@/types/study-timer"

type SavedNotesListProps = {
  snapshots: NoteSnapshot[]
  onDelete: (id: string) => void
}

export function SavedNotesList({
  snapshots,
  onDelete,
}: SavedNotesListProps) {
  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Saved notes</CardTitle>
        <CardDescription>Delete snapshots individually without clearing the draft.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        {snapshots.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-border/80 px-4 py-6 text-sm text-muted-foreground">
            [Saved note snapshots appear here]
          </div>
        ) : (
          <ul className="space-y-3">
            {snapshots.map((snapshot) => (
              <li
                key={snapshot.id}
                className="rounded-[24px] border border-border/80 bg-background/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-3">
                    <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <FileText className="size-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="line-clamp-3 text-sm text-foreground">{snapshot.text}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatHistoryTimestamp(snapshot.savedAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => onDelete(snapshot.id)}
                    aria-label="Delete saved note snapshot"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
