import { DonutTimer } from "@/components/timer/donut-timer"
import { PhaseBadge } from "@/components/timer/phase-badge"
import { formatRemainingTime } from "@/lib/utils/dates"
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
  // This keeps desktop on the existing donut timer while swapping mobile to a lightweight text-only timer to avoid the animated ring cost on small screens.
  return (
    <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden">
      <div className="flex w-full items-center justify-center sm:hidden">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="timer-digits text-6xl font-semibold tracking-[-0.08em] text-foreground">
            {formatRemainingTime(remainingSeconds)}
          </div>
          <PhaseBadge phase={phase} />
        </div>
      </div>

      <div className="hidden w-full items-center justify-center sm:flex">
        <DonutTimer
          phase={phase}
          remainingSeconds={remainingSeconds}
          totalSeconds={totalSeconds}
          status={status}
        />
      </div>
    </div>
  )
}
