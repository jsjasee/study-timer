import type { Settings, TimerPhase, TimerState } from "@/types/study-timer"

// SCAFFOLD: Pure helpers that the store and UI can share.
export function getPhaseDurationSeconds(phase: TimerPhase, settings: Settings) {
  switch (phase) {
    case "focus":
      return settings.focusMinutes * 60
    case "shortBreak":
      return settings.shortBreakMinutes * 60
    case "longBreak":
      return settings.longBreakMinutes * 60
  }
}

export function getPhaseLabel(phase: TimerPhase) {
  switch (phase) {
    case "focus":
      return "Focus"
    case "shortBreak":
      return "Short Break"
    case "longBreak":
      return "Long Break"
  }
}

export function getDisplayRemainingSeconds(timer: TimerState, now: Date) {
  if (timer.status !== "running" || !timer.expectedEndAt) {
    return timer.remainingSeconds
  }

  const expectedEndAtMs = new Date(timer.expectedEndAt).getTime()
  const nowMs = now.getTime()

  if (Number.isNaN(expectedEndAtMs)) {
    return timer.remainingSeconds
  }

  return Math.max(0, Math.ceil((expectedEndAtMs - nowMs) / 1000))
}
