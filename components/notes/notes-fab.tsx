import { NotebookPen } from "lucide-react"

import { Button } from "@/components/ui/button"

type NotesFabProps = {
  onClick: () => void
}

export function NotesFab({ onClick }: NotesFabProps) {
  return (
    <Button
      type="button"
      size="icon-lg"
      className="fixed bottom-6 right-6 z-40 size-14 rounded-full shadow-[0_20px_50px_-22px_rgba(15,23,42,0.8)]"
      onClick={onClick}
      aria-label="Open notes panel"
    >
      <NotebookPen className="size-5" />
    </Button>
  )
}
