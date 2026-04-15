import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

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
    <label className="flex h-11 items-center gap-3 rounded-full border border-white/35 bg-white/45 px-3 shadow-[0_16px_50px_-28px_color-mix(in_oklch,var(--foreground)_28%,transparent)] backdrop-blur-xl dark:border-white/10 dark:bg-white/7">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="size-4 shrink-0 rounded border-border bg-transparent text-primary focus:ring-4 focus:ring-ring/20"
        aria-label="Mark active task as complete"
      />
      <Input
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        placeholder="What are you focusing on?"
        className={cn(
          "h-auto border-0 bg-transparent px-0 text-sm shadow-none focus-visible:border-0 focus-visible:ring-0",
          checked && "line-through opacity-65"
        )}
        aria-label="Active task"
      />
    </label>
  )
}
