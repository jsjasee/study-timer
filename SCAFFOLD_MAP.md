# SCAFFOLD_MAP

## Scope summary

This scaffold sets up the Study Timer v1 front-end shell, shared types, Zustand store, localStorage persistence layer, timer helper modules, responsive UI shells, and test/config plumbing.

No API routes, database schema, or migrations for a backend database were created because the resource doc explicitly defines v1 as local-first with no backend/database.

## Files created and updated

### Root and config

- `/.env.example` — documents the minimal public env placeholder for the app name.
- `/.prettierrc.json` — formatting defaults for future edits.
- `/.prettierignore` — ignores generated directories from formatting.
- `/package.json` — adds `typecheck`, `test`, `test:watch`, and switches `build` to webpack for reliable local verification.
- `/vitest.config.ts` — Vitest config with `@/` alias support and jsdom.

### App shell

- `/app/layout.tsx` — root layout metadata and hydration-safe shell setup.
- `/app/page.tsx` — single-screen route entry that renders the client app shell.
- `/app/globals.css` — Tailwind 4 + shadcn-compatible theme tokens and global styling.

### Domain, state, and utilities

- `/types/study-timer.ts` — all shared domain types, enums, and store contracts.
- `/lib/config/study-timer.ts` — default state, persistence constants, and theme application helper.
- `/lib/utils/dates.ts` — display formatting helpers for countdowns and timestamps.
- `/lib/utils/ids.ts` — local client id generation for task and note history entries.
- `/lib/timer/timer-helpers.ts` — pure timer display and duration helpers.
- `/lib/timer/timer-machine.ts` — dedicated timer transition module with scaffolded event reducer.
- `/lib/timer/timer-recovery.ts` — recovery wrapper for hydrate/resume flows.
- `/lib/persistence/schema.ts` — Zod schemas for persisted localStorage payloads.
- `/lib/persistence/migrations.ts` — version-aware persistence migration entry point.
- `/lib/persistence/storage.ts` — centralized localStorage load/save/clear helpers.
- `/lib/audio/chime.ts` — one-shot completion chime helper using Web Audio.
- `/stores/use-study-timer-store.ts` — main Zustand store with timer/task/notes/settings/ui actions.
- `/hooks/use-study-timer-bootstrap.ts` — client bootstrap hook for hydration, ticking, and chime priming.

### UI scaffolding

- `/components/app/app-header.tsx` — top utility row with theme toggle and settings trigger.
- `/components/app/study-timer-shell.tsx` — main responsive single-screen shell composition.
- `/components/timer/phase-badge.tsx` — reusable phase badge UI.
- `/components/timer/timer-display.tsx` — large timer card with status and session count.
- `/components/timer/timer-controls.tsx` — start/pause/reset control row.
- `/components/timer/completed-phase-banner.tsx` — completed-state banner and next-phase CTA.
- `/components/task/active-task-card.tsx` — active task checkbox and input card.
- `/components/task/completed-task-list.tsx` — completed-task history list with delete actions.
- `/components/notes/notes-fab.tsx` — floating notes entry button.
- `/components/notes/notes-sheet.tsx` — bottom-sheet notes panel with tabs.
- `/components/notes/notes-editor.tsx` — draft editor and snapshot save button.
- `/components/notes/saved-notes-list.tsx` — saved note snapshot history with deletes.
- `/components/settings/settings-drawer.tsx` — settings drawer shell.
- `/components/settings/settings-form.tsx` — settings inputs for durations, theme, and sound.
- `/components/ui/badge.tsx` — badge primitive.
- `/components/ui/card.tsx` — card primitive.
- `/components/ui/input.tsx` — input primitive.
- `/components/ui/label.tsx` — label primitive.
- `/components/ui/sheet.tsx` — Radix-based sheet/drawer primitive.
- `/components/ui/switch.tsx` — Radix-based switch primitive.
- `/components/ui/tabs.tsx` — Radix-based tabs primitive.
- `/components/ui/textarea.tsx` — textarea primitive.

### Tests

- `/tests/setup.ts` — shared test environment setup.
- `/tests/timer/timer-machine.test.ts` — starter timer helper tests plus TODO coverage placeholder.
- `/tests/persistence/schema.test.ts` — starter persistence schema tests plus TODO placeholder.

### Existing files intentionally reused

- `/components/ui/button.tsx` — existing shadcn button kept as-is and reused.
- `/lib/utils.ts` — existing `cn` utility kept as-is and reused.

## TODO(business-logic) locations

### Timer engine

- `/lib/timer/timer-machine.ts:32` — implement the full timer state machine for `START`, `PAUSE`, `COMPLETE`, `ADVANCE_PHASE`, and `HYDRATE_AND_RECOVER`.
- `/stores/use-study-timer-store.ts:124` — decide whether the store should own a visual heartbeat or keep countdown updates fully derived in the UI.

### Persistence and validation

- `/lib/persistence/schema.ts:58` — add strict numeric bounds and any normalization rules for persisted settings/state.
- `/lib/persistence/migrations.ts:40` — implement version-aware migrations beyond v1.
- `/stores/use-study-timer-store.ts:136` — enforce settings constraints and finalize how live/paused sessions react to settings edits.

### Task behavior

- `/stores/use-study-timer-store.ts:172` — decide how the UI should react when a user tries to check an empty active task.

## Suggested implementation order

1. Implement the timer state machine in `/lib/timer/timer-machine.ts`, then wire timer recovery expectations through `/lib/timer/timer-recovery.ts`.
2. Finalize settings validation and session-edit behavior in `/lib/persistence/schema.ts` and `/stores/use-study-timer-store.ts`.
3. Decide the empty-task completion rule and surface that behavior in the active task UI.
4. Add persistence version migrations only after the v1 shape changes.
5. Expand the timer and persistence test suites once the business logic is in place.

## Decisions made

- Kept the project on the existing root `app/` layout instead of migrating to `src/` to preserve the current Next.js and shadcn setup already present in the repo.
- Reused the existing shadcn-generated button and utility helpers rather than creating duplicate primitives.
- Kept the scaffold strictly front-end/localStorage based because the resource doc marks backend/database work as out of scope for v1.
- Switched the `build` script to `next build --webpack` because Turbopack hit an environment-specific sandbox issue during verification, while webpack built successfully.
