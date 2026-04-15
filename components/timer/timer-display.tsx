import { DonutTimer } from "@/components/timer/donut-timer"
import type { TimerPhase, TimerStatus } from "@/types/study-timer"

type TimerDisplayProps = {
  phase: TimerPhase
  remainingSeconds: number
  totalSeconds: number
  status: TimerStatus
}

export function TimerDisplay({
  phase,
  remainingSeconds,
  totalSeconds,
  status,
}: TimerDisplayProps) {
  return (
    <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden">
      <DonutTimer
        phase={phase}
        remainingSeconds={remainingSeconds}
        totalSeconds={totalSeconds}
        status={status}
      />
    </div>
  )
}
