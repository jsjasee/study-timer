import { cn } from "@/lib/utils"
import type { TimerPhase } from "@/types/study-timer"

type SessionProgressDotsProps = {
  phase: TimerPhase
  filledCount: number
  totalCount: number
}

const filledClassNameByPhase: Record<TimerPhase, string> = {
  focus: "border-[var(--ring-focus)] bg-[var(--ring-focus)] shadow-[0_0_14px_color-mix(in_oklch,var(--ring-glow-focus)_36%,transparent)]",
  shortBreak:
    "border-[var(--ring-short)] bg-[var(--ring-short)] shadow-[0_0_14px_color-mix(in_oklch,var(--ring-glow-short)_36%,transparent)]",
  longBreak:
    "border-[var(--ring-long)] bg-[var(--ring-long)] shadow-[0_0_14px_color-mix(in_oklch,var(--ring-glow-long)_36%,transparent)]",
}

export function SessionProgressDots({
  phase,
  filledCount,
  totalCount,
}: SessionProgressDotsProps) {
  const safeTotalCount = Math.max(0, totalCount)
  const safeFilledCount = Math.min(Math.max(0, filledCount), safeTotalCount)

  if (safeTotalCount === 0) {
    return null
  }

  // what does Array.from() do here ...?
  return (
    <div
      className="flex min-h-4 flex-wrap items-center justify-center gap-2"
      aria-label={`Session progress: ${safeFilledCount} of ${safeTotalCount} focus sessions completed`}
    >
      {Array.from({ length: safeTotalCount }, (_, index) => {
        const isFilled = index < safeFilledCount

        return (
          <span
            key={index}
            className={cn(
              "size-2.5 rounded-full border transition-all sm:size-3",
              isFilled
                ? filledClassNameByPhase[phase]
                : "border-border/70 bg-transparent"
            )}
            aria-hidden="true"
          />
        )
      })}
    </div>
  )
}
