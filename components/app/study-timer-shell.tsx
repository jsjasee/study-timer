"use client"

import { toast, Toaster } from "react-hot-toast"

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
  const resetCurrentPhase = useStudyTimerStore(
    (state) => state.resetCurrentPhase
  )
  const advanceToNextPhase = useStudyTimerStore(
    (state) => state.advanceToNextPhase
  )
  const updateSettings = useStudyTimerStore((state) => state.updateSettings)
  const setActiveTaskText = useStudyTimerStore(
    (state) => state.setActiveTaskText
  )
  const setActiveTaskChecked = useStudyTimerStore(
    (state) => state.setActiveTaskChecked
  )
  const deleteCompletedTask = useStudyTimerStore(
    (state) => state.deleteCompletedTask
  )
  const setNotesDraft = useStudyTimerStore((state) => state.setNotesDraft)
  const saveNoteSnapshot = useStudyTimerStore((state) => state.saveNoteSnapshot)
  const deleteNoteSnapshot = useStudyTimerStore(
    (state) => state.deleteNoteSnapshot
  )
  const openNotesSheet = useStudyTimerStore((state) => state.openNotesSheet)
  const closeNotesSheet = useStudyTimerStore((state) => state.closeNotesSheet)
  const setNotesTab = useStudyTimerStore((state) => state.setNotesTab)
  const openSettingsDrawer = useStudyTimerStore(
    (state) => state.openSettingsDrawer
  )
  const closeSettingsDrawer = useStudyTimerStore(
    (state) => state.closeSettingsDrawer
  )

  const displayRemainingSeconds = getDisplayRemainingSeconds(timer, now)

  const handleSettingsSaveSuccess = (mode: "applied" | "saved") => {
    closeSettingsDrawer()
    toast.success(
      mode === "applied"
        ? "Settings saved & applied."
        : "Settings saved. Reset to apply."
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18),transparent_34%),linear-gradient(180deg,var(--background),color-mix(in_oklch,var(--background)_88%,white_12%))]">
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
          <TimerControls
            status={timer.status}
            onStart={startTimer}
            onPause={pauseTimer}
            onReset={resetCurrentPhase}
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
        timerStatus={timer.status}
        onOpenChange={(open) => {
          if (open) {
            openSettingsDrawer()
            return
          }

          closeSettingsDrawer()
        }}
        onPatchSettings={updateSettings}
        onApplySettings={resetCurrentPhase}
        onSaveSuccess={handleSettingsSaveSuccess}
      />

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--card)",
            color: "var(--card-foreground)",
            border:
              "1px solid color-mix(in oklch, var(--border) 88%, transparent)",
            borderRadius: "1rem",
            boxShadow:
              "0 20px 45px color-mix(in oklch, var(--foreground) 10%, transparent)",
            padding: "0.875rem 1rem",
          },
        }}
        containerStyle={{
          top: 16,
          left: 16,
          right: 16,
        }}
      />
    </div>
  )
}
