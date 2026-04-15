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
      className="fixed bottom-5 right-5 z-40 size-12 rounded-full border border-white/20 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--primary)_82%,white_18%),color-mix(in_oklch,var(--accent)_72%,white_28%))] text-primary-foreground shadow-[0_24px_48px_-24px_color-mix(in_oklch,var(--foreground)_60%,transparent)] hover:brightness-105 dark:border-white/10"
      onClick={onClick}
      aria-label="Open notes panel"
    >
      <NotebookPen className="size-5" />
    </Button>
  )
}
