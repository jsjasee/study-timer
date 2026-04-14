import { getPhaseDurationSeconds } from "@/lib/timer/timer-helpers"
import type { Settings, TimerEvent, TimerState } from "@/types/study-timer"

type TransitionArgs = {
  timer: TimerState
  settings: Settings
  event: TimerEvent
}

// when timer is completed, we run this to get the updated focus session count
// REVIEW: More precisely, this only increments the count when the completed phase was "focus".
// REVIEW: Break completion should not increase completedFocusSessions.
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
// transition timer state is used heavily in use-study-timer-store.ts, this function is just accepting a timer, settings and an event, the settings is used to calculate remaining seconds for that phase? timer contains the phase. WHO WILL PASS THE EVENT? I SUPPOSE THE EVENT IS PASSED WHEN TIMER IS UP aka 0s? with this event then this function will figure out what remaining seconds to set?
// ANSWER: This is a reducer: current timer state + event -> next timer state. The store actions pass events like START/PAUSE/RESET/ADVANCE_PHASE/HYDRATE_AND_RECOVER, and settings help calculate durations and long-break cadence. Refer to Notion for more info.
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
      // REVIEW: Not quite. "not idle and not paused" means the timer is either "running" or "completed".
      // REVIEW: This guard prevents restarting while already running and also prevents starting directly from the completed state.
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
        : Math.max(0, Math.floor((endMs - event.now.getTime()) / 1000))

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
      // REVIEW: The first sentence is mostly right: recovery only repairs timers that were persisted as "running".
      // REVIEW: The second sentence is not right. If status is "running" but expectedEndAt is missing, that is not "timer ended" - it is an invalid/incomplete running state, so the reducer safely returns the timer unchanged. (expectedEndAt might be missing if someone tampered with local storage.)
      if (timer.status !== "running" || !timer.expectedEndAt) {
        return timer
      }

      const expectedEndAtMs = Date.parse(timer.expectedEndAt)

      if (
        // Number.isNaN check is just a safety net against corrupt time data for some weird reason, maybe code corrupted etc. (this condition can be removed.)
        Number.isNaN(expectedEndAtMs) ||
        event.now.getTime() < expectedEndAtMs // have NOT exceeded the actual end time, focus session in progress, so we return the normal timer. or the expectedEndAtMs is a number, then we also return the normal timer and do nothing.
        // REVIEW: The important part here is simpler: return unchanged if the timestamp is invalid OR if "now" is still before the scheduled end time.
        // REVIEW: In other words, only overdue running timers should be converted into "completed".
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
