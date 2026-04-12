import { getPhaseDurationSeconds } from "@/lib/timer/timer-helpers"
import type { Settings, TimerEvent, TimerState } from "@/types/study-timer"

type TransitionArgs = {
  timer: TimerState
  settings: Settings
  event: TimerEvent
}

// when timer is completed, we run this to get the updated focus session count
function getCompletedFocusSessionCount(timer: TimerState) {
  return timer.phase === "focus"
    ? timer.completedFocusSessions + 1
    : timer.completedFocusSessions
}

// helper for getting the next phase, and also this is to help us calculate if it is short or long break.
function getNextPhase(
  timer: TimerState,
  settings: Settings
): TimerState["phase"] {
  if (timer.phase !== "focus") {
    return "focus"
  }

  return timer.completedFocusSessions % settings.sessionsBeforeLongBreak === 0
    ? "longBreak"
    : "shortBreak"
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
      // if it is NOT idle or paused, means it is completed, the timer could be running or completed, there is nothing to update.
      if (timer.status !== "idle" && timer.status !== "paused") {
        return timer
      }

      const startedAtMs = Date.now()

      return {
        ...timer,
        status: "running",
        expectedEndAt: new Date(
          startedAtMs + timer.remainingSeconds * 1000
        ).toISOString(),
        remainingSeconds: timer.remainingSeconds,
        lastStartedAt: new Date(startedAtMs).toISOString(),
        completedAt: null,
      }
    case "PAUSE":
      if (timer.status !== "running" || !timer.expectedEndAt) {
        return timer
      }

      const endMs = Date.parse(timer.expectedEndAt)
      const remainingSeconds = Number.isNaN(endMs)
        ? timer.remainingSeconds
        : Math.max(0, Math.ceil((endMs - event.now.getTime()) / 1000))

      return {
        ...timer,
        status: "paused",
        expectedEndAt: null,
        remainingSeconds,
        lastStartedAt: null,
        completedAt: null,
      }
    case "COMPLETE":
      if (timer.status !== "running") {
        return timer
      }

      return {
        ...timer,
        status: "completed",
        expectedEndAt: null,
        remainingSeconds: 0,
        lastStartedAt: null,
        completedAt: event.now.toISOString(),
        completedFocusSessions: getCompletedFocusSessionCount(timer),
      }

    // this is the event when moving to next session (focus or break)
    case "ADVANCE_PHASE":
      if (timer.status !== "completed") {
        return timer
      }

      const nextPhase = getNextPhase(timer, settings)

      return {
        ...timer,
        phase: nextPhase,
        status: "idle",
        expectedEndAt: null,
        remainingSeconds: getPhaseDurationSeconds(nextPhase, settings),
        lastStartedAt: null,
        completedAt: null,
      }
    case "HYDRATE_AND_RECOVER":
      // that means timer status could be idle or completed - nothing to update. normal behaviour. if it is running means user could have closed their device or smth.
      // or if expectedEndAt is empty, return timer i guess, timer ended.
      if (timer.status !== "running" || !timer.expectedEndAt) {
        return timer
      }

      const expectedEndAtMs = Date.parse(timer.expectedEndAt)

      if (
        Number.isNaN(expectedEndAtMs) ||
        event.now.getTime() < expectedEndAtMs // have NOT exceeded the actual end time, focus session in progress, so we return the normal timer. or the expectedEndAtMs is a number, then we also return the normal timer and do nothing.
      ) {
        return timer
      }

      return {
        ...timer,
        status: "completed",
        expectedEndAt: null,
        remainingSeconds: 0,
        lastStartedAt: null,
        completedAt: event.now.toISOString(),
        completedFocusSessions: getCompletedFocusSessionCount(timer),
      }
    default: {
      const exhaustiveEvent: never = event

      return exhaustiveEvent
    }
  }
}
