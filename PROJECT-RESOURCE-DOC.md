# Study Timer — Technical Design Spec (v1)

## 1. Decisions confirmed

These decisions are now fixed for v1:

- When a focus session ends, the previous task remains by default.
- Completed-task history and saved-note history both have delete controls in v1.
- v1 is a mobile-first website, not a PWA requirement.
- On phase completion, the app plays a single chime and shows a visual completed state.
- Basic usage metrics are out of scope for v1.

---

## 2. Further clarifying questions

These are the remaining product questions worth deciding before coding. The spec below makes reasonable default assumptions so implementation can still start.

1. When the active task is checked and added to completed-task history, should checking it again later create another duplicate history entry, or should only the first check create a history entry?
   - **Current assumption:** only transition from unchecked -> checked creates a history entry.

2. When a user deletes a completed-task history entry or saved-note snapshot, should there be a confirmation dialog?
   - **Current assumption:** no modal; use a lightweight delete action, possibly with a small undo toast later if needed.

3. In the notes panel on mobile, should the opened panel take over most of the screen like a bottom sheet, or stay as a smaller drawer?
   - **Current assumption:** use a bottom sheet that expands to most of the viewport height on mobile.

4. Should there be a “clear all history” action for completed tasks and saved notes?
   - **Current assumption:** no clear-all in v1. Only per-entry delete.

5. On first load, should the timer be prefilled with default values like 25 / 5 / 15 / 4?
   - **Current assumption:** yes.

---

## 3. Scope summary

Study Timer v1 is a local-first, single-screen Pomodoro-style study timer web app with:

- configurable focus and break durations
- timestamp-based timer recovery across refresh and sleep
- one active task that remains by default between sessions
- completed-task history with delete controls
- floating notes entry point
- notes draft autosave
- saved note snapshots with delete controls
- manual light/dark theme toggle
- sound on/off setting
- mobile-first responsive design

Out of scope:

- accounts
- cloud sync
- backend/database
- analytics/usage metrics
- collaboration
- required notifications
- Spotify integration
- PWA installability as a requirement

---

## 4. Technical goals

The implementation should optimize for:

- correctness of timer behavior
- simple and predictable state transitions
- clean separation of product domains
- minimal rewrite cost for future sync/account expansion
- mobile-first usability
- maintainable client-side state

---

## 5. Recommended stack

## Frontend
- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Lucide React**

## State
- **Zustand** for app state
- **Zod** for validating persisted settings/state payloads

## Persistence
- **localStorage**

## Deployment
- **Vercel**

## Why this stack
- Next.js keeps the expansion path open for future auth and database work.
- TypeScript helps prevent state bugs across timer, task, notes, and persistence layers.
- Zustand is enough for shared state without Redux overhead.
- Zod helps protect against corrupted or outdated localStorage payloads.
- Tailwind + shadcn/ui are fast for building a clean mobile-first interface.

---

## 6. Architecture overview

This app should be implemented as a **client-side application inside a Next.js shell**.

### High-level modules
1. **App Shell**
2. **Timer Engine**
3. **Task Module**
4. **Notes Module**
5. **Settings Module**
6. **Persistence Module**
7. **Audio Module**
8. **Theme Module**

### High-level data flow
1. User interacts with UI.
2. Zustand store updates domain state.
3. Persistence layer serializes selected state into localStorage.
4. Timer engine computes derived display state from timestamps.
5. On app load, persisted state is rehydrated and repaired if necessary.
6. UI renders from store selectors.

---

## 7. Suggested folder structure

```txt
src/
  app/
    layout.tsx
    page.tsx
    globals.css

  components/
    timer/
      timer-display.tsx
      timer-controls.tsx
      phase-badge.tsx
      completed-phase-banner.tsx
    task/
      active-task-card.tsx
      completed-task-list.tsx
    notes/
      notes-fab.tsx
      notes-sheet.tsx
      notes-editor.tsx
      saved-notes-list.tsx
    settings/
      settings-drawer.tsx
      settings-form.tsx
    ui/
      ...shadcn components

  stores/
    use-study-timer-store.ts

  lib/
    timer/
      timer-machine.ts
      timer-helpers.ts
      timer-recovery.ts
    persistence/
      storage.ts
      schema.ts
      migrations.ts
    audio/
      chime.ts
    utils/
      dates.ts
      ids.ts

  types/
    study-timer.ts
```

---

## 8. Domain model

## 8.1 Core enums and types

```ts
export type ThemeMode = "light" | "dark";

export type TimerPhase = "focus" | "shortBreak" | "longBreak";

export type TimerStatus = "idle" | "running" | "paused" | "completed";
```

## 8.2 Settings

```ts
export type Settings = {
  focusMinutes: number;            // 1-180
  shortBreakMinutes: number;       // 1-60
  longBreakMinutes: number;        // 1-180
  sessionsBeforeLongBreak: number; // 1-12
  soundEnabled: boolean;
  theme: ThemeMode;
};
```

## 8.3 Timer state

```ts
export type TimerState = {
  phase: TimerPhase;
  status: TimerStatus;

  // Source-of-truth for countdown recovery
  expectedEndAt: string | null; // ISO string when running
  remainingSeconds: number;     // used for paused/idle/completed display

  completedFocusSessions: number;

  // Optional metadata
  lastStartedAt: string | null;
  completedAt: string | null;
};
```

## 8.4 Task state

```ts
export type ActiveTask = {
  text: string;
  checked: boolean;
};

export type CompletedTaskEntry = {
  id: string;
  text: string;
  completedAt: string; // ISO string
};
```

## 8.5 Notes state

```ts
export type NoteSnapshot = {
  id: string;
  text: string;
  savedAt: string; // ISO string
};

export type NotesState = {
  currentDraft: string;
  snapshots: NoteSnapshot[];
};
```

## 8.6 UI state

```ts
export type UiState = {
  isNotesSheetOpen: boolean;
  notesTab: "notes" | "completedTasks" | "savedNotes";
  isSettingsDrawerOpen: boolean;
};
```

## 8.7 Persisted root state

```ts
export type PersistedStudyTimerState = {
  version: 1;
  settings: Settings;
  timer: TimerState;
  activeTask: ActiveTask;
  completedTasks: CompletedTaskEntry[];
  notes: NotesState;
};
```

---

## 9. LocalStorage schema

Use a **single namespaced key** instead of many scattered keys.

### Storage key
```txt
study-timer:v1
```

### Example payload
```json
{
  "version": 1,
  "settings": {
    "focusMinutes": 25,
    "shortBreakMinutes": 5,
    "longBreakMinutes": 15,
    "sessionsBeforeLongBreak": 4,
    "soundEnabled": true,
    "theme": "light"
  },
  "timer": {
    "phase": "focus",
    "status": "paused",
    "expectedEndAt": null,
    "remainingSeconds": 1320,
    "completedFocusSessions": 1,
    "lastStartedAt": "2026-04-12T10:00:00.000Z",
    "completedAt": null
  },
  "activeTask": {
    "text": "Revise integration techniques",
    "checked": false
  },
  "completedTasks": [
    {
      "id": "task_1",
      "text": "Finish chemistry corrections",
      "completedAt": "2026-04-12T09:15:00.000Z"
    }
  ],
  "notes": {
    "currentDraft": "Need to review substitution edge cases.",
    "snapshots": [
      {
        "id": "note_1",
        "text": "Summary of chapter 3 formulas",
        "savedAt": "2026-04-12T09:20:00.000Z"
      }
    ]
  }
}
```

### Storage rules
- Serialize only durable state.
- Do not persist ephemeral UI state like whether a drawer is open.
- Validate parsed payloads with Zod before use.
- If invalid, fall back to defaults.
- Keep a `version` field for future migrations.

---

## 10. Default values

```ts
export const DEFAULT_SETTINGS: Settings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
  soundEnabled: true,
  theme: "light",
};
```

### Default timer state
```ts
export const DEFAULT_TIMER: TimerState = {
  phase: "focus",
  status: "idle",
  expectedEndAt: null,
  remainingSeconds: 25 * 60,
  completedFocusSessions: 0,
  lastStartedAt: null,
  completedAt: null,
};
```

### Default task state
```ts
export const DEFAULT_ACTIVE_TASK: ActiveTask = {
  text: "",
  checked: false,
};
```

### Default notes state
```ts
export const DEFAULT_NOTES: NotesState = {
  currentDraft: "",
  snapshots: [],
};
```

---

## 11. Timer state machine

This is the most important part of the app.

## 11.1 Core principle
The timer should **not trust continuous intervals** as the source of truth.

The authoritative state while running is:
- `phase`
- `status`
- `expectedEndAt`

Displayed remaining time should be derived from current time against `expectedEndAt`.

---

## 11.2 Timer events

```ts
type TimerEvent =
  | { type: "START" }
  | { type: "PAUSE"; now: Date }
  | { type: "RESET" }
  | { type: "COMPLETE"; now: Date }
  | { type: "ADVANCE_PHASE" }
  | { type: "SETTINGS_UPDATED" }
  | { type: "HYDRATE_AND_RECOVER"; now: Date };
```

---

## 11.3 Phase duration resolver

```ts
function getPhaseDurationSeconds(phase: TimerPhase, settings: Settings): number {
  switch (phase) {
    case "focus":
      return settings.focusMinutes * 60;
    case "shortBreak":
      return settings.shortBreakMinutes * 60;
    case "longBreak":
      return settings.longBreakMinutes * 60;
  }
}
```

---

## 11.4 Next-phase rules

### Rule
When a phase completes:
- mark current phase as `completed`
- do not automatically start the next phase
- user must manually trigger the next phase

### Next phase logic
- if current phase is `focus`
  - increment `completedFocusSessions`
  - if `completedFocusSessions % sessionsBeforeLongBreak === 0`
    - next phase becomes `longBreak`
  - else
    - next phase becomes `shortBreak`
- if current phase is `shortBreak`
  - next phase becomes `focus`
- if current phase is `longBreak`
  - next phase becomes `focus`

---

## 11.5 Transition table

| Current status | Event | Result |
|---|---|---|
| idle | START | running, expectedEndAt set |
| paused | START | running, expectedEndAt recalculated from remainingSeconds |
| running | PAUSE | paused, remainingSeconds frozen |
| running | COMPLETE | completed, remainingSeconds = 0 |
| completed | ADVANCE_PHASE | switch phase, status = idle, remainingSeconds reset to phase default |
| idle/paused/completed | RESET | same phase, remainingSeconds reset to current phase duration, expectedEndAt cleared |
| any | HYDRATE_AND_RECOVER | restore and repair timer state based on now |

---

## 11.6 Recovery behavior on load/resume

### When app loads:
1. Read persisted state.
2. Validate schema.
3. If timer status is not `running`, keep stored state as-is.
4. If timer status is `running`:
   - compare current time with `expectedEndAt`
   - if current time is before `expectedEndAt`
     - keep running
   - if current time is at or after `expectedEndAt`
     - convert to `completed`
     - set `remainingSeconds = 0`
     - clear `expectedEndAt`
     - set `completedAt = now`

### Important constraint
If the user was away for long enough that multiple phases could have elapsed, **do not chain through them**. Only mark the current phase as completed.

This matches the product requirement and keeps behavior predictable.

---

## 12. Task behavior spec

## 12.1 Active task rules
- Only one active task exists at a time.
- The active task remains visible by default when a focus session ends.
- Resetting the timer does not modify the active task.
- Starting a new phase does not auto-clear the task.
- Task text remains editable at all times.

## 12.2 Completion rules
- When checkbox changes from `false -> true`, append a new completed-task history entry.
- The active task remains in place and visually appears completed.
- The user may then:
  - edit the text
  - uncheck it
  - type a new task

## 12.3 Duplicate protection
To avoid accidental duplicate history entries:
- Only append a history entry on unchecked -> checked transition.
- Do not append repeatedly while the checkbox stays checked.

## 12.4 Delete rules
- Each completed-task history entry has a delete button.
- Deleting a history entry removes only that entry from localStorage-backed state.
- Deleting history does not affect the current active task.

---

## 13. Notes behavior spec

## 13.1 Notes draft
- `currentDraft` autosaves locally as the user types.
- Autosave should be debounced.

## 13.2 Note snapshot creation
- A snapshot is created only when the user presses Save.
- A snapshot stores:
  - `id`
  - `text`
  - `savedAt`

## 13.3 Save behavior
- Save does not clear the current draft by default.
- Repeated saves are allowed, even if text is unchanged.

This matches the explicit product note that duplicates can exist if the user intentionally saves repeatedly.

## 13.4 Delete rules
- Each saved-note snapshot has a delete button.
- Deleting a snapshot removes only that snapshot.
- Deleting a snapshot does not affect the current draft.

## 13.5 Notes UI
- Floating circular action button opens the notes panel.
- On mobile, use a bottom sheet style panel.
- Internal tab/segment options:
  - Notes
  - Completed Tasks
  - Saved Notes

---

## 14. UI structure

## 14.1 Primary single-screen layout

### Main screen sections
1. top utility row
   - app title or subtle brand mark
   - theme toggle
   - settings trigger

2. main timer area
   - phase label
   - large countdown
   - completed-state banner when phase ends

3. task section
   - active task input
   - checkbox
   - simple helper text if useful

4. timer controls
   - Start
   - Pause
   - Reset

5. floating notes action button
   - bottom-right

## 14.2 Mobile priorities
- large timer must dominate the layout
- controls must be thumb-friendly
- active task should stay near the timer, not buried
- settings should be reachable but not visually central
- notes access should be fast and obvious

## 14.3 Desktop behavior
- same single-screen structure
- more whitespace
- notes panel can still use a sheet or side panel pattern
- avoid redesigning v1 into a multi-column dashboard

---

## 15. Zustand store design

Use one main store, but organize actions by domain.

```ts
type StudyTimerStore = {
  settings: Settings;
  timer: TimerState;
  activeTask: ActiveTask;
  completedTasks: CompletedTaskEntry[];
  notes: NotesState;
  ui: UiState;

  // Timer actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetCurrentPhase: () => void;
  advanceToNextPhase: () => void;
  hydrateAndRecover: () => void;
  tickVisualOnly: () => void; // optional UI-only heartbeat

  // Settings actions
  updateSettings: (patch: Partial<Settings>) => void;

  // Task actions
  setActiveTaskText: (text: string) => void;
  setActiveTaskChecked: (checked: boolean) => void;
  deleteCompletedTask: (id: string) => void;

  // Notes actions
  setNotesDraft: (text: string) => void;
  saveNoteSnapshot: () => void;
  deleteNoteSnapshot: (id: string) => void;

  // UI actions
  openNotesSheet: () => void;
  closeNotesSheet: () => void;
  setNotesTab: (tab: UiState["notesTab"]) => void;
  openSettingsDrawer: () => void;
  closeSettingsDrawer: () => void;

  // Persistence
  loadPersistedState: () => void;
};
```

### Important design rule
Keep timer transition logic in pure helper functions where possible, not buried inside UI components.

---

## 16. Persistence implementation plan

## 16.1 Storage helper responsibilities
Create a small persistence layer:

```ts
export function loadState(): PersistedStudyTimerState | null {}
export function saveState(state: PersistedStudyTimerState): void {}
export function clearState(): void {}
```

## 16.2 Debounce strategy
Debounce writes for:
- notes draft typing
- task text typing
- possibly settings edits

Do not debounce writes for:
- critical timer transitions
- task completion event
- note snapshot save
- delete actions

## 16.3 Rehydration order
1. Load raw state.
2. Validate with Zod.
3. Merge with defaults if needed.
4. Run timer recovery.
5. Apply theme.
6. Render UI.

---

## 17. Theme implementation

## Theme requirements
- only manual light/dark toggle in v1
- persisted locally
- no system theme mode

### Suggested implementation
- use class-based dark mode with Tailwind
- initialize theme on client load from persisted settings
- apply theme as early as possible to reduce flash

---

## 18. Audio implementation

## Requirements
- one built-in completion chime
- sound toggle in settings
- no looping or repeated alarm

## Constraints
Browsers may block audio before user interaction.

### Implementation note
- preload the audio asset after first user gesture
- when phase completes:
  - if `soundEnabled`, attempt to play once
  - if playback fails, fail silently

Do not block timer completion logic on audio success.

---

## 19. Validation rules

## Settings constraints
- focus duration: 1 to 180 minutes
- short break duration: 1 to 60 minutes
- long break duration: 1 to 180 minutes
- sessions before long break: 1 to 12

## Content rules
- empty task text is allowed unless you want to force text before checking
  - **Current assumption:** empty task can exist, but checking an empty task should probably do nothing
- empty note draft can exist
- saving an empty note draft should probably be blocked
  - **Current assumption:** disable Save when draft is empty or whitespace-only

---

## 20. Error handling

## localStorage failures
Possible failures:
- corrupted JSON
- schema mismatch
- storage unavailable
- quota issues

### Handling approach
- if parse/validation fails, fall back to defaults
- log errors in development only
- do not crash the UI
- for quota issues, fail gracefully and keep runtime state alive

---

## 21. Accessibility baseline

Even for v1, implement the basics:

- proper button labels
- visible focus states
- accessible checkbox/input labels
- sufficient color contrast in both themes
- semantic headings where appropriate
- reduced reliance on color alone for completion state

Not doing this now creates cleanup work later.

---

## 22. Testing checklist

## Timer
- start from idle
- pause mid-session
- resume from paused
- reset while paused
- reset while running
- focus completion switches to completed state
- short break completion switches to completed state
- long break completion switches to completed state
- long break appears after correct number of completed focus sessions
- refresh while running before end time
- refresh after expected end time
- device sleep / tab background recovery
- no auto-chaining through multiple phases

## Task
- edit task text
- check task creates one history entry
- repeated renders do not create duplicate history entry
- uncheck/recheck behavior is correct
- delete history entry works

## Notes
- draft autosaves
- save creates snapshot
- delete snapshot works
- empty draft save is blocked if that rule is adopted

## Settings
- min/max validation
- changing duration affects reset/default phase duration correctly
- sound toggle persists
- theme toggle persists

## UI
- mobile layout on common breakpoints
- bottom sheet usability
- controls remain reachable and readable

---

## 23. Build order

## Phase 1 — Foundations
1. set up Next.js app
2. install Tailwind, shadcn/ui, Zustand, Zod
3. define types
4. define default state
5. build persistence helpers

## Phase 2 — Timer engine
1. implement pure timer helpers
2. implement Zustand timer actions
3. add recovery logic
4. connect timer UI
5. verify transitions manually

## Phase 3 — Task flow
1. active task input
2. checkbox logic
3. completed-task history
4. delete action

## Phase 4 — Notes flow
1. floating notes button
2. bottom sheet
3. notes draft autosave
4. snapshot save
5. delete action

## Phase 5 — Settings and theme
1. settings drawer
2. validation
3. theme toggle
4. sound toggle

## Phase 6 — Polish
1. completed-state visuals
2. chime playback
3. mobile spacing polish
4. accessibility pass
5. deployment

---

## 24. Known open decisions

These should be finalized before or during implementation:

1. Should empty active tasks be allowed to be marked complete?
   - current assumption: no

2. Should deleting history entries be instant or have undo?
   - current assumption: instant delete

3. Should the notes panel remember the last-opened tab?
   - current assumption: yes, during runtime only, not persisted

4. Should changing settings while a timer is paused immediately alter the paused phase’s remaining total on reset only, or live-adjust the current session?
   - current assumption: changes affect future resets and future phases, not the already-paused current remaining time

That last rule is important. Live-mutating the current countdown after settings edits usually confuses people.

---

## 25. Final implementation guidance

The timer engine is the core risk. Treat it as a small state machine, not just a React countdown component.

The cleanest implementation strategy is:

- keep timer transitions pure
- keep persisted state versioned
- keep localStorage access centralized
- keep UI components thin
- avoid adding analytics, task-list complexity, or PWA work in v1

The next useful document after this spec would be:

1. a **component map**
2. a **state transition table in more detail**
3. a **localStorage + Zod schema file**
4. a **step-by-step implementation checklist**
