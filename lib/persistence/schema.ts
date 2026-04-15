import { z } from "zod"

// SCAFFOLD: Shared persistence schemas prevent invalid localStorage payloads from crashing the app.
export const themeModeSchema = z.enum(["light", "dark"])
export const timerPhaseSchema = z.enum(["focus", "shortBreak", "longBreak"])
export const timerStatusSchema = z.enum([
  "idle",
  "running",
  "paused",
  "completed",
])

// this is only validation on the local storage side, when we try to save the data into local storage, UI is validating in ANOTHER METHOD, THE settings-form.tsx and time-input.tsx area!
export const settingsSchema = z.object({
  focusMinutes: z.coerce.number().min(1).max(180),
  shortBreakMinutes: z.coerce.number().min(1).max(60),
  longBreakMinutes: z.coerce.number().min(1).max(180),
  sessionsBeforeLongBreak: z.coerce.number().min(1).max(12),
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

export const persistedStudyTimerStateV1Schema = z.object({
  version: z.literal(1),
  settings: settingsSchema,
  timer: timerStateSchema,
  activeTask: activeTaskSchema,
  completedTasks: z.array(completedTaskEntrySchema),
  notes: notesStateSchema,
})

// why is there a new schema? is this for v2? why is there v2? so i can migrate back to v1 if needed?
// ANSWER: Yes, this new schema is for v2 because the persisted data shape changed to include totalCompletedFocusSessions. The v1 schema is kept only so old saved data can be recognized and upgraded forward to v2; it is not for migrating backward to v1.
export const persistedStudyTimerStateSchema = z.object({
  version: z.literal(2),
  settings: settingsSchema,
  timer: timerStateSchema,
  totalCompletedFocusSessions: z.number(),
  activeTask: activeTaskSchema,
  completedTasks: z.array(completedTaskEntrySchema),
  notes: notesStateSchema,
})

// TODO(business-logic): Tighten schema constraints to enforce the product rules from the spec.
// Add numeric min/max bounds, future-proof migration support, and any normalization rules you want at the storage boundary.
