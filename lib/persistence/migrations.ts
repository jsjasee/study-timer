import { createDefaultPersistedState } from "@/lib/config/study-timer"
import {
  persistedStudyTimerStateSchema,
  persistedStudyTimerStateV1Schema,
} from "@/lib/persistence/schema"
import type { PersistedStudyTimerState } from "@/types/study-timer"

function normalizeCycleCompletedSessions(
  completedFocusSessions: number,
  sessionsBeforeLongBreak: number,
  phase: PersistedStudyTimerState["timer"]["phase"]
) {
  if (completedFocusSessions <= 0) {
    return 0
  }

  const normalizedRemainder = completedFocusSessions % sessionsBeforeLongBreak

  if (phase === "longBreak") {
    return normalizedRemainder === 0
      ? sessionsBeforeLongBreak
      : normalizedRemainder
  }

  return normalizedRemainder
}

// SCAFFOLD: Future persistence versions should migrate through this module instead of ad-hoc parsing in the store.
// why are we migrating to version 2..? what is this migrate persisted state doing and why is it key to the dots feature? if it is success...?
export function migratePersistedState(
  rawState: unknown
): PersistedStudyTimerState | null {
  const parsedV2State = persistedStudyTimerStateSchema.safeParse(rawState)

  if (parsedV2State.success) {
    const defaults = createDefaultPersistedState()

    return {
      ...defaults,
      ...parsedV2State.data,
      settings: {
        ...defaults.settings,
        ...parsedV2State.data.settings,
      },
      timer: {
        ...defaults.timer,
        ...parsedV2State.data.timer,
      },
      totalCompletedFocusSessions:
        parsedV2State.data.totalCompletedFocusSessions,
      activeTask: {
        ...defaults.activeTask,
        ...parsedV2State.data.activeTask,
      },
      completedTasks: [...parsedV2State.data.completedTasks],
      notes: {
        currentDraft: parsedV2State.data.notes.currentDraft,
        snapshots: [...parsedV2State.data.notes.snapshots],
      },
    }
  }

  const parsedV1State = persistedStudyTimerStateV1Schema.safeParse(rawState)

  if (!parsedV1State.success) {
    return null
  }

  const defaults = createDefaultPersistedState()

  return {
    ...defaults,
    settings: {
      ...defaults.settings,
      ...parsedV1State.data.settings,
    },
    timer: {
      ...defaults.timer,
      ...parsedV1State.data.timer,
      completedFocusSessions: normalizeCycleCompletedSessions(
        parsedV1State.data.timer.completedFocusSessions,
        parsedV1State.data.settings.sessionsBeforeLongBreak,
        parsedV1State.data.timer.phase
      ),
    },
    totalCompletedFocusSessions:
      parsedV1State.data.timer.completedFocusSessions,
    activeTask: {
      ...defaults.activeTask,
      ...parsedV1State.data.activeTask,
    },
    completedTasks: [...parsedV1State.data.completedTasks],
    notes: {
      currentDraft: parsedV1State.data.notes.currentDraft,
      snapshots: [...parsedV1State.data.notes.snapshots],
    },
  }
}

// TODO(business-logic): Add version-aware migrations once persisted state evolves past v2.
