import { transitionTimerState } from "@/lib/timer/timer-machine"
import type { Settings, TimerState } from "@/types/study-timer"

type RecoveryArgs = {
  timer: TimerState
  settings: Settings
  now: Date
}

// SCAFFOLD: Recovery is isolated so it can be tested independently of the UI layer.
export function recoverTimerState({ timer, settings, now }: RecoveryArgs) {
  return transitionTimerState({
    timer,
    settings,
    event: { type: "HYDRATE_AND_RECOVER", now },
  })
}
