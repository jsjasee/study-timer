import { StatsTabContent } from "@/components/notes/stats-tab-content"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CompletedTaskList } from "@/components/task/completed-task-list"
import { NotesEditor } from "@/components/notes/notes-editor"
import { SavedNotesList } from "@/components/notes/saved-notes-list"
import type {
  CompletedTaskEntry,
  NotesTab,
  NoteSnapshot,
} from "@/types/study-timer"

type NotesSheetProps = {
  open: boolean
  tab: NotesTab
  draft: string
  completedTasks: CompletedTaskEntry[]
  savedNotes: NoteSnapshot[]
  totalCompletedFocusSessions: number
  onOpenChange: (open: boolean) => void
  onTabChange: (tab: NotesTab) => void
  onDraftChange: (text: string) => void
  onSaveDraft: () => void
  onDeleteCompletedTask: (id: string) => void
  onDeleteSavedNote: (id: string) => void
}

export function NotesSheet({
  open,
  tab,
  draft,
  completedTasks,
  savedNotes,
  totalCompletedFocusSessions,
  onOpenChange,
  onTabChange,
  onDraftChange,
  onSaveDraft,
  onDeleteCompletedTask,
  onDeleteSavedNote,
}: NotesSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Notes panel</SheetTitle>
          <SheetDescription>
            Mobile-first bottom sheet with quick access to notes, task history, and saved snapshots.
          </SheetDescription>
        </SheetHeader>
        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <Tabs value={tab} onValueChange={(value) => onTabChange(value as NotesTab)}>
            <TabsList className="flex-wrap">
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="completedTasks">Completed</TabsTrigger>
              <TabsTrigger value="savedNotes">Saved</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
            <TabsContent value="notes">
              <NotesEditor value={draft} onChange={onDraftChange} onSave={onSaveDraft} />
            </TabsContent>
            <TabsContent value="completedTasks">
              <CompletedTaskList items={completedTasks} onDelete={onDeleteCompletedTask} />
            </TabsContent>
            <TabsContent value="savedNotes">
              <SavedNotesList snapshots={savedNotes} onDelete={onDeleteSavedNote} />
            </TabsContent>
            <TabsContent value="stats">
              <StatsTabContent
                totalCompletedFocusSessions={totalCompletedFocusSessions}
              />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
