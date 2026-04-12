import { createDefaultPersistedState } from "@/lib/config/study-timer"
import { persistedStudyTimerStateSchema } from "@/lib/persistence/schema"
import type { PersistedStudyTimerState } from "@/types/study-timer"

// SCAFFOLD: Future persistence versions should migrate through this module instead of ad-hoc parsing in the store.
export function migratePersistedState(
  rawState: unknown,
): PersistedStudyTimerState | null {
  const parsedState = persistedStudyTimerStateSchema.safeParse(rawState)

  if (!parsedState.success) {
    return null
  }

  const defaults = createDefaultPersistedState()

  return {
    ...defaults,
    ...parsedState.data,
    settings: {
      ...defaults.settings,
      ...parsedState.data.settings,
    },
    timer: {
      ...defaults.timer,
      ...parsedState.data.timer,
    },
    activeTask: {
      ...defaults.activeTask,
      ...parsedState.data.activeTask,
    },
    completedTasks: [...parsedState.data.completedTasks],
    notes: {
      currentDraft: parsedState.data.notes.currentDraft,
      snapshots: [...parsedState.data.notes.snapshots],
    },
  }
}

// TODO(business-logic): Add version-aware migrations once persisted state evolves past v1.
