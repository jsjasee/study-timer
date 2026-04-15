"use client"

import { toast, Toaster } from "react-hot-toast"

import { AppHeader } from "@/components/app/app-header"
import { NotesFab } from "@/components/notes/notes-fab"
import { NotesSheet } from "@/components/notes/notes-sheet"
import { SettingsDrawer } from "@/components/settings/settings-drawer"
import { ActiveTaskCard } from "@/components/task/active-task-card"
import { SessionProgressDots } from "@/components/timer/session-progress-dots"
import { TimerControls } from "@/components/timer/timer-controls"
import { TimerDisplay } from "@/components/timer/timer-display"
import { AuroraBackground } from "@/components/ui/aurora-background"
import { useStudyTimerBootstrap } from "@/hooks/use-study-timer-bootstrap"
import { getDisplayRemainingSeconds } from "@/lib/timer/timer-helpers"
import { useStudyTimerStore } from "@/stores/use-study-timer-store"

export function StudyTimerShell() {
  const { now } = useStudyTimerBootstrap()
  const settings = useStudyTimerStore((state) => state.settings)
  const timer = useStudyTimerStore((state) => state.timer)
  const totalCompletedFocusSessions = useStudyTimerStore(
    (state) => state.totalCompletedFocusSessions
  )
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
  const totalSeconds =
    timer.phase === "focus"
      ? settings.focusMinutes * 60
      : timer.phase === "shortBreak"
        ? settings.shortBreakMinutes * 60
        : settings.longBreakMinutes * 60

  const handleSettingsSaveSuccess = (mode: "applied" | "saved") => {
    closeSettingsDrawer()
    toast.success(
      mode === "applied"
        ? "Settings saved & applied."
        : "Settings saved. Reset to apply."
    )
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <AuroraBackground />

      <main className="relative z-10 mx-auto flex h-dvh w-full max-w-lg flex-col overflow-hidden px-4 py-3 sm:max-w-xl sm:px-6 sm:py-4">
        <AppHeader
          theme={settings.theme}
          onToggleTheme={() =>
            updateSettings({
              theme: settings.theme === "light" ? "dark" : "light",
            })
          }
          onOpenSettings={openSettingsDrawer}
        />

        <div className="mt-2">
          <ActiveTaskCard
            text={activeTask.text}
            checked={activeTask.checked}
            onTextChange={setActiveTaskText}
            onCheckedChange={setActiveTaskChecked}
          />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-2 overflow-hidden py-2 sm:gap-3">
          <TimerDisplay
            phase={timer.phase}
            remainingSeconds={displayRemainingSeconds}
            totalSeconds={totalSeconds}
            status={timer.status}
          />
          <SessionProgressDots
            phase={timer.phase}
            filledCount={timer.completedFocusSessions}
            totalCount={settings.sessionsBeforeLongBreak}
          />
          <TimerControls
            status={timer.status}
            onStart={startTimer}
            onPause={pauseTimer}
            onReset={resetCurrentPhase}
            onAdvance={advanceToNextPhase}
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
        totalCompletedFocusSessions={totalCompletedFocusSessions}
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
            background: "color-mix(in oklch, var(--card) 82%, transparent)",
            color: "var(--card-foreground)",
            border:
              "1px solid color-mix(in oklch, var(--border) 88%, transparent)",
            borderRadius: "1rem",
            boxShadow:
              "0 20px 45px color-mix(in oklch, var(--foreground) 12%, transparent)",
            backdropFilter: "blur(16px)",
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
