import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { SettingsForm } from "@/components/settings/settings-form"
import type { Settings } from "@/types/study-timer"

type SettingsDrawerProps = {
  open: boolean
  settings: Settings
  onOpenChange: (open: boolean) => void
  onPatchSettings: (patch: Partial<Settings>) => void
}

export function SettingsDrawer({
  open,
  settings,
  onOpenChange,
  onPatchSettings,
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
            onPatchSettings={onPatchSettings}
            onSaveSuccess={() => onOpenChange(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
