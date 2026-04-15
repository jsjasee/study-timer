import { Badge } from "@/components/ui/badge"
import type { TimerPhase } from "@/types/study-timer"

type PhaseBadgeProps = {
  phase: TimerPhase
}

const variantByPhase: Record<TimerPhase, "default" | "secondary" | "success"> = {
  focus: "default",
  shortBreak: "secondary",
  longBreak: "success",
}

const labelByPhase: Record<TimerPhase, string> = {
  focus: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
}

export function PhaseBadge({ phase }: PhaseBadgeProps) {
  return (
    <Badge
      variant={variantByPhase[phase]}
      className="mt-1.5 border-white/20 bg-white/55 px-2.5 py-0.5 text-[0.65rem] tracking-[0.18em] text-foreground shadow-[0_10px_30px_-22px_color-mix(in_oklch,var(--foreground)_40%,transparent)] backdrop-blur-md sm:mt-2 sm:px-3 sm:py-1 sm:text-xs dark:border-white/10 dark:bg-white/10"
    >
      {labelByPhase[phase]}
    </Badge>
  )
}
