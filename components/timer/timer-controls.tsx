import { Pause, Play, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { TimerStatus } from "@/types/study-timer"

type TimerControlsProps = {
  status: TimerStatus
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

export function TimerControls({
  status,
  onStart,
  onPause,
  onReset,
}: TimerControlsProps) {
  const isRunning = status === "running"

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Button size="lg" className="h-12 rounded-2xl" onClick={onStart} disabled={isRunning}>
        <Play className="size-4" />
        Start
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="h-12 rounded-2xl"
        onClick={onPause}
        disabled={!isRunning}
      >
        <Pause className="size-4" />
        Pause
      </Button>
      <Button size="lg" variant="secondary" className="h-12 rounded-2xl" onClick={onReset}>
        <RotateCcw className="size-4" />
        Reset
      </Button>
    </div>
  )
}
