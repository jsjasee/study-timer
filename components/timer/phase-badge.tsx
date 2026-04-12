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
  return <Badge variant={variantByPhase[phase]}>{labelByPhase[phase]}</Badge>
}
