import { ArrowRight, Pause, Play, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ShimmerButton } from "@/components/ui/shimmer-button"
import type { TimerStatus } from "@/types/study-timer"

type TimerControlsProps = {
  status: TimerStatus
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onAdvance: () => void
}

export function TimerControls({
  status,
  onStart,
  onPause,
  onReset,
  onAdvance,
}: TimerControlsProps) {
  const isRunning = status === "running"
  const isCompleted = status === "completed"

  return (
    <div className="grid w-full max-w-md grid-cols-3 gap-2">
      {isCompleted ? (
        <ShimmerButton
          size="lg"
          className="h-10 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[0_0_0_1px_color-mix(in_oklch,var(--accent)_45%,transparent),0_12px_30px_-16px_var(--ring-glow-focus)] hover:bg-[color-mix(in_oklch,var(--accent)_88%,white_12%)]"
          shimmerClassName="opacity-100"
          onClick={onAdvance}
        >
          Next Phase
          <ArrowRight className="size-4" />
        </ShimmerButton>
      ) : (
        <ShimmerButton
          size="lg"
          className="h-10 rounded-full shadow-[0_16px_32px_-20px_color-mix(in_oklch,var(--primary)_75%,transparent)]"
          onClick={onStart}
          disabled={isRunning}
        >
          <Play className="size-4" />
          Start
        </ShimmerButton>
      )}
      <Button
        size="lg"
        variant="ghost"
        className="h-10 rounded-full border border-primary/35 bg-white/35 text-foreground backdrop-blur-md hover:bg-white/50 dark:bg-white/8 dark:hover:bg-white/12"
        onClick={onPause}
        disabled={!isRunning || isCompleted}
      >
        <Pause className="size-4" />
        Pause
      </Button>
      <Button
        size="lg"
        variant="ghost"
        className="h-10 rounded-full border border-border/70 bg-transparent text-muted-foreground hover:bg-white/35 hover:text-foreground dark:hover:bg-white/8"
        onClick={onReset}
        disabled={isCompleted}
      >
        <RotateCcw className="size-4" />
        Reset
      </Button>
    </div>
  )
}
