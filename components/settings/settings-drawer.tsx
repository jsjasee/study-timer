import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SettingsForm } from "@/components/settings/settings-form"
import type { Settings, TimerStatus } from "@/types/study-timer"

type SettingsDrawerProps = {
  open: boolean
  settings: Settings
  timerStatus: TimerStatus
  onOpenChange: (open: boolean) => void
  onPatchSettings: (patch: Partial<Settings>) => void
  onApplySettings: () => void
  onSaveSuccess: (mode: "applied" | "saved") => void
}

export function SettingsDrawer({
  open,
  settings,
  timerStatus,
  onOpenChange,
  onPatchSettings,
  onApplySettings,
  onSaveSuccess,
}: SettingsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Adjust focus, breaks, theme, and sound without leaving the main timer screen.
          </SheetDescription>
        </SheetHeader>
        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <SettingsForm
            settings={settings}
            timerStatus={timerStatus}
            onPatchSettings={onPatchSettings}
            onApplySettings={onApplySettings}
            onSaveSuccess={onSaveSuccess}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
