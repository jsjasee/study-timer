import { Card, CardContent } from "@/components/ui/card"
import { PhaseBadge } from "@/components/timer/phase-badge"
import { formatRemainingTime } from "@/lib/utils/dates"
import type { TimerPhase } from "@/types/study-timer"

type TimerDisplayProps = {
  phase: TimerPhase
  remainingSeconds: number
}

export function TimerDisplay({
  phase,
  remainingSeconds,
}: TimerDisplayProps) {
  return (
    <Card className="overflow-hidden border-border/60 bg-card/90">
      <CardContent className="space-y-6 p-6 sm:p-8">
        <div className="rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.45))] p-6 text-center shadow-inner dark:bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.2),transparent_58%),linear-gradient(180deg,rgba(8,15,24,0.88),rgba(8,15,24,0.58))]">
          <div className="text-[4rem] font-semibold tracking-[-0.08em] text-foreground sm:text-[5rem]">
            {formatRemainingTime(remainingSeconds)}
          </div>
          <PhaseBadge phase={phase} />
        </div>
      </CardContent>
    </Card>
  )
}
