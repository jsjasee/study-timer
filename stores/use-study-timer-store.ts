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
let deferPersistTimeout: number | null = null

// i guess this function is returning all the settings of the inputted state.. from local storage since the stuff is stored there? where is this used? for what?
// ANSWER: This does not read localStorage; it picks only the persistable fields from the full Zustand store. It is used right before saving so UI state/functions are excluded. Refer to Notion for more info.
function selectPersistedState(
  state: StudyTimerStore
): PersistedStudyTimerState {
  return {
    version: 2,
    settings: state.settings,
    timer: state.timer,
    totalCompletedFocusSessions: state.totalCompletedFocusSessions,
    activeTask: state.activeTask,
    completedTasks: state.completedTasks,
    notes: state.notes,
  }
}

// so this function is increasing the number of dots by 1 i assume? why return 1 or 0?
// ANSWER: This helper does not render dots directly; it detects the exact moment a focus phase transitions into completed and returns 1 only for that one completion edge, otherwise 0. The store uses that 1-or-0 result to increment totalCompletedFocusSessions once per fully completed focus session, including recovery after reloads.
function getCompletedFocusIncrement(
  previousState: StudyTimerStore,
  nextTimer: StudyTimerStore["timer"]
) {
  const completedFocusJustNow =
    previousState.timer.phase === "focus" &&
    previousState.timer.status !== "completed" &&
    nextTimer.status === "completed"

  return completedFocusJustNow ? 1 : 0
}

// this is getting the number completed sessions by looking at the timer and comparing what is the previous state..?? how is previousState.timer and nextTimer.phase diff if both are from the same store..? who is using this function?
// ANSWER: previousState is the store state before transitionTimerState() handles an event, while nextTimer is the reducer result after that same event, so they can differ even inside one function call. This helper is used by advanceToNextPhase() and hydrateAndRecover() to reset dots to 0 after a completed long break restarts the cycle, and otherwise cap the filled dots to sessionsBeforeLongBreak with Math.min so settings changes cannot show more filled dots than total dots.
function getNextCycleCompletedSessions(
  previousState: StudyTimerStore,
  nextTimer: StudyTimerStore["timer"]
) {
  const isRestartingAfterLongBreak =
    previousState.timer.phase === "longBreak" &&
    previousState.timer.status === "completed" &&
    nextTimer.phase === "focus" &&
    nextTimer.status === "idle"

  if (isRestartingAfterLongBreak) {
    return 0
  }

  return Math.min(
    nextTimer.completedFocusSessions,
    previousState.settings.sessionsBeforeLongBreak
  )
}

// This writes the latest persistable slice synchronously and cancels any queued deferred save so an older snapshot cannot overwrite a newer immediate save.
function persistImmediately(state: StudyTimerStore) {
  if (typeof window !== "undefined" && deferPersistTimeout !== null) {
    window.clearTimeout(deferPersistTimeout)
    deferPersistTimeout = null
  }

  saveState(selectPersistedState(state))
}

// This defers non-critical persistence off the interaction path and debounces rapid taps down to the latest store snapshot only.
function deferPersist(state: StudyTimerStore) {
  if (typeof window === "undefined") {
    return
  }

  if (deferPersistTimeout !== null) {
    window.clearTimeout(deferPersistTimeout)
  }

  deferPersistTimeout = window.setTimeout(() => {
    saveState(selectPersistedState(state))
    deferPersistTimeout = null
  }, 250)
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

// This gives non-React code a safe way to flush the current Zustand state to storage during page lifecycle events.
export function flushPersistedStudyTimerState() {
  persistImmediately(useStudyTimerStore.getState())
}

// so here i am creating the default options to save into local storage i suppose?
// ANSWER: Yes, this creates the default persisted data model used to seed the store and to fall back when localStorage is empty or invalid. Refer to Notion for more info.
const defaultPersistedState = createDefaultPersistedState()

// zustand state here
export const useStudyTimerStore = create<StudyTimerStore>((set, get) => ({
  settings: defaultPersistedState.settings,
  timer: defaultPersistedState.timer,
  totalCompletedFocusSessions:
    defaultPersistedState.totalCompletedFocusSessions,
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
    // This pauses the timer in memory first so the UI responds immediately, then queues persistence after the interaction finishes.
    const currentState = get()
    const nextTimer = transitionTimerState({
      timer: currentState.timer,
      settings: currentState.settings,
      event: { type: "PAUSE", now: new Date() },
    }) //

    set({ timer: nextTimer })
    deferPersist(get())
  },
  resetCurrentPhase: () => {
    // This resets the active phase instantly in Zustand and defers the storage write so Reset does not block the tap response.
    const currentState = get()
    const nextTimer = transitionTimerState({
      timer: currentState.timer,
      settings: currentState.settings,
      event: { type: "RESET" },
    })

    set({ timer: nextTimer })
    deferPersist(get())
  },
  advanceToNextPhase: () => {
    // This advances to the next phase immediately in memory and defers persistence because the transition is user-visible but not crash-critical.
    const currentState = get()
    const nextTimer = transitionTimerState({
      timer: currentState.timer,
      settings: currentState.settings,
      event: { type: "ADVANCE_PHASE" },
    })

    set({
      timer: {
        ...nextTimer,
        completedFocusSessions: getNextCycleCompletedSessions(
          currentState,
          nextTimer
        ),
      },
    })
    deferPersist(get())
  },
  hydrateAndRecover: () => {
    // This recomputes timer progress from in-memory state on each tick and only persists on the completion edge that must survive tab closure.
    const currentState = get()
    const recoveredTimer = recoverTimerState({
      timer: currentState.timer,
      settings: currentState.settings,
      now: new Date(),
    })
    const completedFocusIncrement = getCompletedFocusIncrement(
      currentState,
      recoveredTimer
    )

    const shouldPlayCompletionChime =
      currentState.timer.status !== "completed" &&
      recoveredTimer.status === "completed"

    set({
      timer: {
        ...recoveredTimer,
        completedFocusSessions: getNextCycleCompletedSessions(
          currentState,
          recoveredTimer
        ),
      },
      totalCompletedFocusSessions:
        currentState.totalCompletedFocusSessions + completedFocusIncrement,
    })

    if (shouldPlayCompletionChime) {
      persistImmediately(get())
    }

    if (shouldPlayCompletionChime) {
      void playCompletionChime(currentState.settings.soundEnabled)
    }
  },
  tickVisualOnly: () => {
    // TODO(business-logic): Add a UI-only heartbeat if you want selectors or derived countdown state to update inside the store. (what is this UI-only heartbeat?)
    // ANSWER: A UI-only heartbeat is a 1s visual tick used to keep countdown displays fresh without persisting every second. In this app, the hook-level now state already plays that role outside the store. Refer to Notion for more info.
  },
  updateSettings: (patch) => {
    set((state) => {
      const nextSettings = {
        ...state.settings,
        ...patch,
      }

      return {
        settings: nextSettings,
        timer: {
          ...state.timer,
          completedFocusSessions: Math.min(
            state.timer.completedFocusSessions,
            nextSettings.sessionsBeforeLongBreak
          ),
        },
      }
    })

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
    // This updates task completion state right away and defers persistence so checkbox feedback stays instant on mobile.
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
    deferPersist(get())
  },
  deleteCompletedTask: (id) => {
    // This removes a completed task from Zustand first and defers the storage write to keep deletion interactions responsive.
    set((state) => ({
      completedTasks: state.completedTasks.filter((entry) => entry.id !== id),
    }))

    deferPersist(get())
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
    // This saves the note snapshot into the live store immediately and defers persistence so Save feels instant.
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

    deferPersist(get())
  },
  deleteNoteSnapshot: (id) => {
    // This deletes a note snapshot from memory first and defers persistence because the UI change matters more than the storage timing.
    set((state) => ({
      notes: {
        ...state.notes,
        snapshots: state.notes.snapshots.filter(
          (snapshot) => snapshot.id !== id
        ),
      },
    }))

    deferPersist(get())
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
    const completedFocusIncrement = getCompletedFocusIncrement(
      {
        ...get(),
        settings: persistedState.settings,
        timer: persistedState.timer,
        totalCompletedFocusSessions: persistedState.totalCompletedFocusSessions,
        activeTask: persistedState.activeTask,
        completedTasks: persistedState.completedTasks,
        notes: persistedState.notes,
      },
      recoveredTimer
    )

    set((state) => ({
      ...state,
      settings: persistedState.settings,
      timer: {
        ...recoveredTimer,
        completedFocusSessions: Math.min(
          recoveredTimer.completedFocusSessions,
          persistedState.settings.sessionsBeforeLongBreak
        ),
      },
      totalCompletedFocusSessions:
        persistedState.totalCompletedFocusSessions + completedFocusIncrement,
      activeTask: persistedState.activeTask,
      completedTasks: persistedState.completedTasks,
      notes: persistedState.notes,
    }))

    applyThemeMode(persistedState.settings.theme)
    persistImmediately(get())
  },
}))
