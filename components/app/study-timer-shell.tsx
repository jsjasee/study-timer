"use client"

import { AppHeader } from "@/components/app/app-header"
import { NotesFab } from "@/components/notes/notes-fab"
import { NotesSheet } from "@/components/notes/notes-sheet"
import { SettingsDrawer } from "@/components/settings/settings-drawer"
import { ActiveTaskCard } from "@/components/task/active-task-card"
import { CompletedPhaseBanner } from "@/components/timer/completed-phase-banner"
import { TimerControls } from "@/components/timer/timer-controls"
import { TimerDisplay } from "@/components/timer/timer-display"
import { Card, CardContent } from "@/components/ui/card"
import { useStudyTimerBootstrap } from "@/hooks/use-study-timer-bootstrap"
import { getDisplayRemainingSeconds } from "@/lib/timer/timer-helpers"
import { useStudyTimerStore } from "@/stores/use-study-timer-store"

export function StudyTimerShell() {
  const { now } = useStudyTimerBootstrap()
  const settings = useStudyTimerStore((state) => state.settings)
  const timer = useStudyTimerStore((state) => state.timer)
  const activeTask = useStudyTimerStore((state) => state.activeTask)
  const completedTasks = useStudyTimerStore((state) => state.completedTasks)
  const notes = useStudyTimerStore((state) => state.notes)
  const ui = useStudyTimerStore((state) => state.ui)

  const startTimer = useStudyTimerStore((state) => state.startTimer)
  const pauseTimer = useStudyTimerStore((state) => state.pauseTimer)
  const resetCurrentPhase = useStudyTimerStore((state) => state.resetCurrentPhase)
  const advanceToNextPhase = useStudyTimerStore((state) => state.advanceToNextPhase)
  const updateSettings = useStudyTimerStore((state) => state.updateSettings)
  const setActiveTaskText = useStudyTimerStore((state) => state.setActiveTaskText)
  const setActiveTaskChecked = useStudyTimerStore((state) => state.setActiveTaskChecked)
  const deleteCompletedTask = useStudyTimerStore((state) => state.deleteCompletedTask)
  const setNotesDraft = useStudyTimerStore((state) => state.setNotesDraft)
  const saveNoteSnapshot = useStudyTimerStore((state) => state.saveNoteSnapshot)
  const deleteNoteSnapshot = useStudyTimerStore((state) => state.deleteNoteSnapshot)
  const openNotesSheet = useStudyTimerStore((state) => state.openNotesSheet)
  const closeNotesSheet = useStudyTimerStore((state) => state.closeNotesSheet)
  const setNotesTab = useStudyTimerStore((state) => state.setNotesTab)
  const openSettingsDrawer = useStudyTimerStore((state) => state.openSettingsDrawer)
  const closeSettingsDrawer = useStudyTimerStore((state) => state.closeSettingsDrawer)

  const displayRemainingSeconds = getDisplayRemainingSeconds(timer, now)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_34%),linear-gradient(180deg,var(--background),color-mix(in_oklch,var(--background)_88%,white_12%))]">
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        <AppHeader
          theme={settings.theme}
          onToggleTheme={() =>
            updateSettings({
              theme: settings.theme === "light" ? "dark" : "light",
            })
          }
          onOpenSettings={openSettingsDrawer}
        />

        <div className="grid gap-6">
          <TimerDisplay
            phase={timer.phase}
            status={timer.status}
            remainingSeconds={displayRemainingSeconds}
            completedFocusSessions={timer.completedFocusSessions}
          />

          <CompletedPhaseBanner
            isVisible={timer.status === "completed"}
            onAdvance={advanceToNextPhase}
          />

          <ActiveTaskCard
            text={activeTask.text}
            checked={activeTask.checked}
            onTextChange={setActiveTaskText}
            onCheckedChange={setActiveTaskChecked}
          />

          <Card>
            <CardContent className="space-y-4 p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Controls</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Timer controls are wired to the store. The full state machine lives in the timer TODOs.
                </p>
              </div>
              <TimerControls
                status={timer.status}
                onStart={startTimer}
                onPause={pauseTimer}
                onReset={resetCurrentPhase}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <NotesFab onClick={openNotesSheet} />

      <NotesSheet
        open={ui.isNotesSheetOpen}
        tab={ui.notesTab}
        draft={notes.currentDraft}
        completedTasks={completedTasks}
        savedNotes={notes.snapshots}
        onOpenChange={(open) => {
          if (open) {
            openNotesSheet()
            return
          }

          closeNotesSheet()
        }}
        onTabChange={setNotesTab}
        onDraftChange={setNotesDraft}
        onSaveDraft={saveNoteSnapshot}
        onDeleteCompletedTask={deleteCompletedTask}
        onDeleteSavedNote={deleteNoteSnapshot}
      />

      <SettingsDrawer
        open={ui.isSettingsDrawerOpen}
        settings={settings}
        onOpenChange={(open) => {
          if (open) {
            openSettingsDrawer()
            return
          }

          closeSettingsDrawer()
        }}
        onPatchSettings={updateSettings}
      />
    </div>
  )
}
