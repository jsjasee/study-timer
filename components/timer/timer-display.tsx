import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PhaseBadge } from "@/components/timer/phase-badge"
import { formatRemainingTime } from "@/lib/utils/dates"
import type { TimerPhase, TimerStatus } from "@/types/study-timer"

type TimerDisplayProps = {
  phase: TimerPhase
  status: TimerStatus
  remainingSeconds: number
  completedFocusSessions: number
}

export function TimerDisplay({
  phase,
  status,
  remainingSeconds,
  completedFocusSessions,
}: TimerDisplayProps) {
  return (
    <Card className="overflow-hidden border-border/60 bg-card/90">
      <CardHeader className="gap-4 border-b border-border/60">
        <div className="flex items-center justify-between gap-3">
          <PhaseBadge phase={phase} />
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Status: {status}
          </p>
        </div>
        <CardTitle className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Session timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6 sm:p-8">
        <div className="rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_58%),linear-gradient(180deg,rgba(255,255,255,0.82),rgba(255,255,255,0.45))] p-6 text-center shadow-inner dark:bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.2),_transparent_58%),linear-gradient(180deg,rgba(8,15,24,0.88),rgba(8,15,24,0.58))]">
          <div className="text-[4rem] font-semibold tracking-[-0.08em] text-foreground sm:text-[5rem]">
            {formatRemainingTime(remainingSeconds)}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            [Timer guidance placeholder]
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-[24px] border border-dashed border-border/80 px-4 py-3 text-sm text-muted-foreground">
          <span>Completed focus sessions</span>
          <span className="font-semibold text-foreground">{completedFocusSessions}</span>
        </div>
      </CardContent>
    </Card>
  )
}
