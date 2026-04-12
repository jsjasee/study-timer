// SCAFFOLD: Shared domain types for the Study Timer app.

export type ThemeMode = "light" | "dark"

export type TimerPhase = "focus" | "shortBreak" | "longBreak"

export type TimerStatus = "idle" | "running" | "paused" | "completed"

export type Settings = {
  focusMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  sessionsBeforeLongBreak: number
  soundEnabled: boolean
  theme: ThemeMode
}

export type TimerState = {
  phase: TimerPhase
  status: TimerStatus
  expectedEndAt: string | null
  remainingSeconds: number
  completedFocusSessions: number
  lastStartedAt: string | null
  completedAt: string | null
}

export type ActiveTask = {
  text: string
  checked: boolean
}

export type CompletedTaskEntry = {
  id: string
  text: string
  completedAt: string
}

export type NoteSnapshot = {
  id: string
  text: string
  savedAt: string
}

export type NotesState = {
  currentDraft: string
  snapshots: NoteSnapshot[]
}

export type NotesTab = "notes" | "completedTasks" | "savedNotes"

export type UiState = {
  isNotesSheetOpen: boolean
  notesTab: NotesTab
  isSettingsDrawerOpen: boolean
}

export type PersistedStudyTimerState = {
  version: 1
  settings: Settings
  timer: TimerState
  activeTask: ActiveTask
  completedTasks: CompletedTaskEntry[]
  notes: NotesState
}

export type TimerEvent =
  | { type: "START" }
  | { type: "PAUSE"; now: Date }
  | { type: "RESET" }
  | { type: "COMPLETE"; now: Date }
  | { type: "ADVANCE_PHASE" }
  | { type: "SETTINGS_UPDATED" }
  | { type: "HYDRATE_AND_RECOVER"; now: Date }

export type StudyTimerStore = {
  settings: Settings
  timer: TimerState
  activeTask: ActiveTask
  completedTasks: CompletedTaskEntry[]
  notes: NotesState
  ui: UiState
  startTimer: () => void
  pauseTimer: () => void
  resetCurrentPhase: () => void
  advanceToNextPhase: () => void
  hydrateAndRecover: () => void
  tickVisualOnly: () => void
  updateSettings: (patch: Partial<Settings>) => void
  setActiveTaskText: (text: string) => void
  setActiveTaskChecked: (checked: boolean) => void
  deleteCompletedTask: (id: string) => void
  setNotesDraft: (text: string) => void
  saveNoteSnapshot: () => void
  deleteNoteSnapshot: (id: string) => void
  openNotesSheet: () => void
  closeNotesSheet: () => void
  setNotesTab: (tab: NotesTab) => void
  openSettingsDrawer: () => void
  closeSettingsDrawer: () => void
  loadPersistedState: () => void
}
