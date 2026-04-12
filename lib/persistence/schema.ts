import { z } from "zod"

// SCAFFOLD: Shared persistence schemas prevent invalid localStorage payloads from crashing the app.
export const themeModeSchema = z.enum(["light", "dark"])
export const timerPhaseSchema = z.enum(["focus", "shortBreak", "longBreak"])
export const timerStatusSchema = z.enum(["idle", "running", "paused", "completed"])

export const settingsSchema = z.object({
  focusMinutes: z.number(),
  shortBreakMinutes: z.number(),
  longBreakMinutes: z.number(),
  sessionsBeforeLongBreak: z.number(),
  soundEnabled: z.boolean(),
  theme: themeModeSchema,
})

export const timerStateSchema = z.object({
  phase: timerPhaseSchema,
  status: timerStatusSchema,
  expectedEndAt: z.string().nullable(),
  remainingSeconds: z.number(),
  completedFocusSessions: z.number(),
  lastStartedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
})

export const activeTaskSchema = z.object({
  text: z.string(),
  checked: z.boolean(),
})

export const completedTaskEntrySchema = z.object({
  id: z.string(),
  text: z.string(),
  completedAt: z.string(),
})

export const noteSnapshotSchema = z.object({
  id: z.string(),
  text: z.string(),
  savedAt: z.string(),
})

export const notesStateSchema = z.object({
  currentDraft: z.string(),
  snapshots: z.array(noteSnapshotSchema),
})

export const persistedStudyTimerStateSchema = z.object({
  version: z.literal(1),
  settings: settingsSchema,
  timer: timerStateSchema,
  activeTask: activeTaskSchema,
  completedTasks: z.array(completedTaskEntrySchema),
  notes: notesStateSchema,
})

// TODO(business-logic): Tighten schema constraints to enforce the product rules from the spec.
// Add numeric min/max bounds, future-proof migration support, and any normalization rules you want at the storage boundary.
