"use client"

import { create } from "zustand"

import {
  applyThemeMode,
  createDefaultPersistedState,
  createDefaultUiState,
} from "@/lib/config/study-timer"
import { playCompletionChime } from "@/lib/audio/chime"
import { loadStateOrDefault, saveState } from "@/lib/persistence/storage"
import { recoverTimerState } from "@/lib/timer/timer-recovery"
import { transitionTimerState } from "@/lib/timer/timer-machine"
import { createClientId } from "@/lib/utils/ids"
import type {
  PersistedStudyTimerState,
  StudyTimerStore,
} from "@/types/study-timer"

let persistTimeout: number | null = null // this is the timeoutID

// i guess persist is to store the user time when the device is closed and the settings etc.
function selectPersistedState(
  state: StudyTimerStore
): PersistedStudyTimerState {
  return {
    version: 1,
    settings: state.settings,
    timer: state.timer,
    activeTask: state.activeTask,
    completedTasks: state.completedTasks,
    notes: state.notes,
  }
}

// this wrapper function is to save the state.
function persistImmediately(state: StudyTimerStore) {
  saveState(selectPersistedState(state))
}

// persist every 2.5s?
function schedulePersist(state: StudyTimerStore) {
  if (typeof window === "undefined") {
    return
  }

  if (persistTimeout) {
    window.clearTimeout(persistTimeout)
  }

  persistTimeout = window.setTimeout(() => {
    saveState(selectPersistedState(state))
  }, 250)
}

const defaultPersistedState = createDefaultPersistedState()

// zustand state here
export const useStudyTimerStore = create<StudyTimerStore>((set, get) => ({
  settings: defaultPersistedState.settings,
  timer: defaultPersistedState.timer,
  activeTask: defaultPersistedState.activeTask,
  completedTasks: defaultPersistedState.completedTasks,
  notes: defaultPersistedState.notes,
  ui: createDefaultUiState(),

  // zustand store also stores FUNCTIONS that can log to the state and then save it.
  startTimer: () => {
    const currentState = get()
    const nextTimer = transitionTimerState({
      timer: currentState.timer,
      settings: currentState.settings,
      event: { type: "START" },
    })

    set({ timer: nextTimer })
    persistImmediately(get())
  },
  pauseTimer: () => {
    const currentState = get()
    const nextTimer = transitionTimerState({
      timer: currentState.timer,
      settings: currentState.settings,
      event: { type: "PAUSE", now: new Date() },
    })

    set({ timer: nextTimer })
    persistImmediately(get())
  },
  resetCurrentPhase: () => {
    const currentState = get()
    const nextTimer = transitionTimerState({
      timer: currentState.timer,
      settings: currentState.settings,
      event: { type: "RESET" },
    })

    set({ timer: nextTimer })
    persistImmediately(get())
  },
  advanceToNextPhase: () => {
    const currentState = get()
    const nextTimer = transitionTimerState({
      timer: currentState.timer,
      settings: currentState.settings,
      event: { type: "ADVANCE_PHASE" },
    })

    set({ timer: nextTimer })
    persistImmediately(get())
  },
  hydrateAndRecover: () => {
    const currentState = get()
    const recoveredTimer = recoverTimerState({
      timer: currentState.timer,
      settings: currentState.settings,
      now: new Date(),
    })

    const shouldPlayCompletionChime =
      currentState.timer.status !== "completed" &&
      recoveredTimer.status === "completed"

    set({ timer: recoveredTimer })
    persistImmediately(get())

    if (shouldPlayCompletionChime) {
      void playCompletionChime(currentState.settings.soundEnabled)
    }
  },
  tickVisualOnly: () => {
    // TODO(business-logic): Add a UI-only heartbeat if you want selectors or derived countdown state to update inside the store.
  },
  updateSettings: (patch) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...patch,
      },
    }))

    applyThemeMode(get().settings.theme)

    // TODO(business-logic): Enforce the settings min/max rules from the spec and decide how active sessions react to settings edits.
    schedulePersist(get())
  },
  setActiveTaskText: (text) => {
    set((state) => ({
      activeTask: {
        ...state.activeTask,
        text,
      },
    }))

    schedulePersist(get())
  },
  setActiveTaskChecked: (checked) => {
    const currentState = get()
    const trimmedTask = currentState.activeTask.text.trim()
    const shouldAppendHistoryEntry =
      !currentState.activeTask.checked && checked && trimmedTask.length > 0

    set((state) => ({
      activeTask: {
        ...state.activeTask,
        checked,
      },
      completedTasks: shouldAppendHistoryEntry
        ? [
            {
              id: createClientId("task"),
              text: trimmedTask,
              completedAt: new Date().toISOString(),
            },
            ...state.completedTasks,
          ]
        : state.completedTasks,
    }))

    // TODO(business-logic): Decide whether checking an empty task should surface inline feedback instead of silently doing nothing.
    persistImmediately(get())
  },
  deleteCompletedTask: (id) => {
    set((state) => ({
      completedTasks: state.completedTasks.filter((entry) => entry.id !== id),
    }))

    persistImmediately(get())
  },
  setNotesDraft: (text) => {
    set((state) => ({
      notes: {
        ...state.notes,
        currentDraft: text,
      },
    }))

    schedulePersist(get())
  },
  saveNoteSnapshot: () => {
    const currentState = get()
    const draft = currentState.notes.currentDraft.trim()

    if (!draft) {
      return
    }

    set((state) => ({
      notes: {
        ...state.notes,
        snapshots: [
          {
            id: createClientId("note"),
            text: draft,
            savedAt: new Date().toISOString(),
          },
          ...state.notes.snapshots,
        ],
      },
    }))

    persistImmediately(get())
  },
  deleteNoteSnapshot: (id) => {
    set((state) => ({
      notes: {
        ...state.notes,
        snapshots: state.notes.snapshots.filter(
          (snapshot) => snapshot.id !== id
        ),
      },
    }))

    persistImmediately(get())
  },
  openNotesSheet: () => {
    set((state) => ({
      ui: {
        ...state.ui,
        isNotesSheetOpen: true,
      },
    }))
  },
  closeNotesSheet: () => {
    set((state) => ({
      ui: {
        ...state.ui,
        isNotesSheetOpen: false,
      },
    }))
  },
  setNotesTab: (tab) => {
    set((state) => ({
      ui: {
        ...state.ui,
        notesTab: tab,
      },
    }))
  },
  openSettingsDrawer: () => {
    set((state) => ({
      ui: {
        ...state.ui,
        isSettingsDrawerOpen: true,
      },
    }))
  },
  closeSettingsDrawer: () => {
    set((state) => ({
      ui: {
        ...state.ui,
        isSettingsDrawerOpen: false,
      },
    }))
  },
  loadPersistedState: () => {
    const persistedState = loadStateOrDefault()
    const recoveredTimer = recoverTimerState({
      timer: persistedState.timer,
      settings: persistedState.settings,
      now: new Date(),
    })

    set((state) => ({
      ...state,
      settings: persistedState.settings,
      timer: recoveredTimer,
      activeTask: persistedState.activeTask,
      completedTasks: persistedState.completedTasks,
      notes: persistedState.notes,
    }))

    applyThemeMode(persistedState.settings.theme)
    persistImmediately(get())
  },
}))
