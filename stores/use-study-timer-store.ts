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

// i guess this function is returning all the settings of the inputted state.. from local storage since the stuff is stored there? where is this used? for what?
// ANSWER: This does not read localStorage; it picks only the persistable fields from the full Zustand store. It is used right before saving so UI state/functions are excluded. Refer to Notion for more info.
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

// this function accepts a state and then calls a function to SAVE the STATE, the input is just the state (aka all the stuff, the timer, task, notes etc) that it wants to save?? its just a wrapper function.
// ANSWER: Yes, this is a thin wrapper. It takes the full store state, filters it through selectPersistedState, then saves only the persistable data. Refer to Notion for more info.
function persistImmediately(state: StudyTimerStore) {
  saveState(selectPersistedState(state))
}

// if window is somehow undefined... do nothing (when will this happen? i suppose one device is closed or its hacked or something..?) if there a timeout ID, we want to clear it first (because we have reached the time), then we set another 250ms before we save the state. why not use persistImmediately? since it's literally doing the same thing, can replace 'saveState(selectPersistedState(state))'
// ANSWER: window is undefined during server-side rendering, not because of hacking/device issues. This debounces rapid saves into one delayed save; using persistImmediately inside the timeout would also work, but this inlines the same logic. Refer to Notion for more info.
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

// so here i am creating the default options to save into local storage i suppose?
// ANSWER: Yes, this creates the default persisted data model used to seed the store and to fall back when localStorage is empty or invalid. Refer to Notion for more info.
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
  //
  startTimer: () => {
    const currentState = get()
    const nextTimer = transitionTimerState({
      timer: currentState.timer,
      settings: currentState.settings,
      event: { type: "START" },
    })

    set({ timer: nextTimer }) // im changing the timer to the next timer, so the whole store is changed.
    persistImmediately(get()) // ok here when i start the timer, i am saving the state (aka all the timers, notes, tasks etc.) RIGHT NOW. (in a sense state is like a mini store w/o all the ui settings and functions? its the object to save into local storage..?)
    // ANSWER: get() returns the full Zustand store, not a mini store. persistImmediately then filters that full store down to the persistable fields before saving. Refer to Notion for more info.
  },
  pauseTimer: () => {
    const currentState = get()
    const nextTimer = transitionTimerState({
      timer: currentState.timer,
      settings: currentState.settings,
      event: { type: "PAUSE", now: new Date() },
    }) //

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
    // TODO(business-logic): Add a UI-only heartbeat if you want selectors or derived countdown state to update inside the store. (what is this UI-only heartbeat?)
    // ANSWER: A UI-only heartbeat is a 1s visual tick used to keep countdown displays fresh without persisting every second. In this app, the hook-level now state already plays that role outside the store. Refer to Notion for more info.
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

    if (trimmedTask === "") {
      return
      // if user ticks nothing, return
    }

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
