import type {
  ActiveTask,
  NotesState,
  PersistedStudyTimerState,
  Settings,
  TimerState,
  ThemeMode,
  UiState,
} from "@/types/study-timer"

// SCAFFOLD: Centralized constants keep the app shell and persistence layer aligned.
export const STORAGE_KEY = "study-timer:v1"
export const CURRENT_PERSISTENCE_VERSION = 1 as const

export const LIMITS = {
  // the lower limit is always 1, below denotes the upper limit.
  maxFocusMinutes: 180,
  maxShortBreakMinutes: 60, // 5
  maxLongBreakMinutes: 120, // 15
  maxSessionsBeforeLongBreak: 12, // 4
}

// defaults for the project (on first load and user has no data in local storage, will use these settings.)
export const DEFAULT_SETTINGS: Settings = {
  focusMinutes: 25, // 25
  shortBreakMinutes: 5, // 5
  longBreakMinutes: 15, // 15
  sessionsBeforeLongBreak: 4, // 4
  soundEnabled: true, // true
  theme: "light",
}

// the default phase on first load, and we will use this timer object.
export const DEFAULT_TIMER: TimerState = {
  phase: "focus",
  status: "idle",
  expectedEndAt: null,
  remainingSeconds: DEFAULT_SETTINGS.focusMinutes * 60,
  completedFocusSessions: 0,
  lastStartedAt: null,
  completedAt: null,
}

export const DEFAULT_ACTIVE_TASK: ActiveTask = {
  text: "",
  checked: false,
}

export const DEFAULT_NOTES: NotesState = {
  currentDraft: "",
  snapshots: [],
}

export const DEFAULT_UI: UiState = {
  isNotesSheetOpen: false,
  notesTab: "notes",
  isSettingsDrawerOpen: false,
}

// not sure what this does, is it to create that initial state to save into zustand? what is persistance in simple terms? saving into local storage?
export function createDefaultPersistedState(): PersistedStudyTimerState {
  return {
    version: CURRENT_PERSISTENCE_VERSION,
    settings: { ...DEFAULT_SETTINGS },
    timer: { ...DEFAULT_TIMER },
    activeTask: { ...DEFAULT_ACTIVE_TASK },
    completedTasks: [],
    notes: {
      currentDraft: DEFAULT_NOTES.currentDraft,
      snapshots: [...DEFAULT_NOTES.snapshots],
    },
  }
}

// this one is to save the initial ui into zustand i suppose? but which properties are needed in zustand for the ui, and when? is it the timer? the seconds? im guessing - is to build the ui, but the store has a ui object, not sure where this ui property is used.
export function createDefaultUiState(): UiState {
  return { ...DEFAULT_UI }
}

// applying light or dark theme universally.
export function applyThemeMode(theme: ThemeMode) {
  if (typeof document === "undefined") {
    return
  }

  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  root.dataset.theme = theme
}
