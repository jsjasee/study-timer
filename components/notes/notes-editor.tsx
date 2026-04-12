import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

type NotesEditorProps = {
  value: string
  onChange: (text: string) => void
  onSave: () => void
}

export function NotesEditor({ value, onChange, onSave }: NotesEditorProps) {
  const isSaveDisabled = value.trim().length === 0

  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardHeader className="px-0">
        <CardTitle>Notes</CardTitle>
        <CardDescription>
          Draft text autosaves locally. Saving creates a snapshot entry.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-0">
        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="[Write notes here]"
          aria-label="Notes draft"
        />
        <Button
          type="button"
          size="lg"
          className="h-12 rounded-2xl"
          onClick={onSave}
          disabled={isSaveDisabled}
        >
          <Save className="size-4" />
          Save snapshot
        </Button>
      </CardContent>
    </Card>
  )
}
