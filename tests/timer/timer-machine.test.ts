import { describe, expect, it } from "vitest"

import { DEFAULT_SETTINGS, DEFAULT_TIMER } from "@/lib/config/study-timer"
import { transitionTimerState } from "@/lib/timer/timer-machine"
import { getPhaseDurationSeconds } from "@/lib/timer/timer-helpers"

describe("getPhaseDurationSeconds", () => {
  it("returns the configured focus duration in seconds", () => {
    expect(getPhaseDurationSeconds("focus", DEFAULT_SETTINGS)).toBe(1500)
  })
})

describe("transitionTimerState", () => {
  it("resets the current phase back to its configured duration", () => {
    const nextTimer = transitionTimerState({
      timer: {
        ...DEFAULT_TIMER,
        status: "paused",
        remainingSeconds: 42,
      },
      settings: DEFAULT_SETTINGS,
      event: { type: "RESET" },
    })

    expect(nextTimer.status).toBe("idle")
    expect(nextTimer.remainingSeconds).toBe(1500)
    expect(nextTimer.expectedEndAt).toBeNull()
  })

  it.todo("starts, pauses, completes, advances, and recovers according to the product state machine")
})
