import { getPhaseDurationSeconds } from "@/lib/timer/timer-helpers"
import type { Settings, TimerEvent, TimerState } from "@/types/study-timer"

type TransitionArgs = {
  timer: TimerState
  settings: Settings
  event: TimerEvent
}

// SCAFFOLD: This file is the dedicated home for timer state transitions.
export function transitionTimerState({
  timer,
  settings,
  event,
}: TransitionArgs): TimerState {
  switch (event.type) {
    case "RESET":
      return {
        ...timer,
        status: "idle",
        expectedEndAt: null,
        remainingSeconds: getPhaseDurationSeconds(timer.phase, settings),
        completedAt: null,
      }
    case "SETTINGS_UPDATED":
      return timer
    case "START":
    case "PAUSE":
    case "COMPLETE":
    case "ADVANCE_PHASE":
    case "HYDRATE_AND_RECOVER":
      // TODO(business-logic): Implement the timer state machine transitions from the spec.
      // Use expectedEndAt as the source of truth while running, freeze remainingSeconds on pause,
      // prevent multi-phase auto-chaining on recovery, and advance phases using sessionsBeforeLongBreak.
      return timer
    default: {
      const exhaustiveEvent: never = event

      return exhaustiveEvent
    }
  }
}
