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
      return {
        ...timer,
        status: "running",
        expectedEndAt: new Date(
          Date.now() + timer.remainingSeconds * 1000
        ).toISOString(),
        remainingSeconds: timer.remainingSeconds,
        lastStartedAt: new Date().toISOString(),
        completedAt: null,
      }
    case "PAUSE":
      if (timer.status !== "running") {
        return timer
      }

      let endMs = Date.parse(timer.expectedEndAt!)
      let remaining = Math.ceil((endMs - Date.now()) / 1000)

      return {
        ...timer,
        status: "paused",
        expectedEndAt: null,
        remainingSeconds: Math.max(0, remaining),
        lastStartedAt: null,
        completedAt: null,
      }
    case "COMPLETE":
      return {
        ...timer,
        status: "completed",
        expectedEndAt: null,
        remainingSeconds: 0,
        lastStartedAt: null,
        completedAt: new Date().toISOString(),
        completedFocusSessions:
          timer.phase === "focus"
            ? timer.completedFocusSessions + 1
            : timer.completedFocusSessions,
      }

    // this is the event when moving to next session (focus or break)
    case "ADVANCE_PHASE":
      return {
        ...timer,
        phase:
          timer.phase === "focus" &&
          (timer.completedFocusSessions % settings.sessionsBeforeLongBreak !==
            0 ||
            timer.completedFocusSessions === 0)
            ? "shortBreak"
            : timer.phase === "focus" &&
                timer.completedFocusSessions %
                  settings.sessionsBeforeLongBreak ===
                  0
              ? "longBreak"
              : "focus",
        status: "idle",
        expectedEndAt: null,
        remainingSeconds: getPhaseDurationSeconds(timer.phase, settings),
        lastStartedAt: null,
        completedAt: null,
      }
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
