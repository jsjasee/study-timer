"use client"

import { useEffect, useState } from "react"

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

const MOBILE_MEDIA_QUERY = "(max-width: 639px)"

export function TimerDisplay({
  phase,
  remainingSeconds,
  totalSeconds,
  status,
}: TimerDisplayProps) {
  const [isMobile, setIsMobile] = useState(true)

  // This keeps the donut timer completely unmounted on mobile so its animated DOM and CSS never exist on phones.
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const mobileMediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY)

    const syncViewport = () => {
      setIsMobile(mobileMediaQuery.matches)
    }

    syncViewport()
    mobileMediaQuery.addEventListener("change", syncViewport)

    return () => {
      mobileMediaQuery.removeEventListener("change", syncViewport)
    }
  }, [])

  // This renders a lightweight text timer for mobile while preserving the existing donut timer for tablet and desktop viewports.
  return (
    <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden">
      {isMobile ? (
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="timer-digits text-6xl font-semibold tracking-[-0.08em] text-foreground">
            {formatRemainingTime(remainingSeconds)}
          </div>
          <PhaseBadge phase={phase} />
        </div>
      ) : (
        <DonutTimer
          phase={phase}
          remainingSeconds={remainingSeconds}
          totalSeconds={totalSeconds}
          status={status}
        />
      )}
    </div>
  )
}
