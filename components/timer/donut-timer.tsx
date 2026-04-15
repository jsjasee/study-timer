import { PhaseBadge } from "@/components/timer/phase-badge"
import { cn } from "@/lib/utils"
import { formatRemainingTime } from "@/lib/utils/dates"
import type { TimerPhase, TimerStatus } from "@/types/study-timer"

type DonutTimerProps = {
  phase: TimerPhase
  remainingSeconds: number
  totalSeconds: number
  status: TimerStatus
}

const radius = 84
const circumference = 2 * Math.PI * radius

const ringClassNameByPhase: Record<TimerPhase, string> = {
  focus: "text-[var(--ring-focus)]",
  shortBreak: "text-[var(--ring-short)]",
  longBreak: "text-[var(--ring-long)]",
}

const glowClassNameByPhase: Record<TimerPhase, string> = {
  focus: "donut-glow-focus",
  shortBreak: "donut-glow-short",
  longBreak: "donut-glow-long",
}

export function DonutTimer({
  phase,
  remainingSeconds,
  totalSeconds,
  status,
}: DonutTimerProps) {
  const safeTotalSeconds = totalSeconds > 0 ? totalSeconds : 0
  const clampedRemainingSeconds =
    safeTotalSeconds > 0
      ? Math.min(Math.max(remainingSeconds, 0), safeTotalSeconds)
      : 0
  const progressRatio =
    safeTotalSeconds > 0 ? clampedRemainingSeconds / safeTotalSeconds : 1
  const strokeDashoffset = circumference * (1 - progressRatio)
  const isRunning = status === "running"

  return (
    <div className="relative grid place-items-center">
      <div
        aria-hidden="true"
        className={cn(
          "donut-glow absolute inset-[9%] rounded-full",
          glowClassNameByPhase[phase],
          isRunning && "donut-glow-running"
        )}
      />

      <div
        aria-hidden="true"
        className={cn(
          "donut-orbit pointer-events-none absolute inset-[4%] rounded-full opacity-80",
          glowClassNameByPhase[phase],
          isRunning ? "donut-orbit-running" : "donut-orbit-idle"
        )}
      />

      <svg
        viewBox="0 0 200 200"
        className="relative z-10 size-[min(68vw,41dvh,23rem)] -rotate-90 overflow-visible sm:size-[min(62vw,46dvh,25rem)]"
        role="img"
        aria-label={`${phase} timer showing ${formatRemainingTime(clampedRemainingSeconds)} remaining`}
      >
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="var(--ring-track)"
          strokeWidth="12"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            "transition-[stroke-dashoffset,stroke] duration-1000 ease-linear",
            ringClassNameByPhase[phase]
          )}
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center">
        <div className="timer-digits text-[clamp(2.8rem,10vw,5rem)] font-semibold tracking-[-0.08em] text-foreground">
          {formatRemainingTime(clampedRemainingSeconds)}
        </div>
        <PhaseBadge phase={phase} />
      </div>
    </div>
  )
}
