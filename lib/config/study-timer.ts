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

export const DEFAULT_SETTINGS: Settings = {
  focusMinutes: 25, // 25
  shortBreakMinutes: 5, // 5
  longBreakMinutes: 15, // 15
  sessionsBeforeLongBreak: 4, // 4
  soundEnabled: true, // true
  theme: "light",
}

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

export function createDefaultUiState(): UiState {
  return { ...DEFAULT_UI }
}

export function applyThemeMode(theme: ThemeMode) {
  if (typeof document === "undefined") {
    return
  }

  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  root.dataset.theme = theme
}
