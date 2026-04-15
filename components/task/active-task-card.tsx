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
    <label className="relative flex h-11 items-center gap-3 overflow-hidden rounded-full border border-white/35 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--card)_70%,white_30%),color-mix(in_oklch,var(--card)_54%,transparent))] px-3 shadow-[0_0_0_1px_color-mix(in_oklch,var(--accent)_14%,transparent),0_18px_50px_-28px_color-mix(in_oklch,var(--foreground)_28%,transparent)] backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(180deg,color-mix(in_oklch,var(--card)_84%,white_16%),color-mix(in_oklch,var(--card)_32%,transparent))]">
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-3 w-12 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--accent)_24%,transparent),transparent_72%)] blur-xl"
      />
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="relative z-10 size-4 shrink-0 rounded border-border bg-transparent text-primary shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_14%,transparent)] focus:ring-4 focus:ring-ring/20"
        aria-label="Mark active task as complete"
      />
      <Input
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        placeholder="What are you focusing on?"
        className={cn(
          "relative z-10 h-auto border-0 bg-transparent px-0 text-sm shadow-none placeholder:text-muted-foreground/85 focus-visible:border-0 focus-visible:ring-0",
          checked && "line-through opacity-65"
        )}
        aria-label="Active task"
      />
    </label>
  )
}
