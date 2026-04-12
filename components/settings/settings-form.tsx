import { Moon, Settings2, SunMedium, Volume2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import type { Settings, ThemeMode } from "@/types/study-timer"

type SettingsFormProps = {
  settings: Settings
  onPatchSettings: (patch: Partial<Settings>) => void
}

type NumericSettingField = {
  id: keyof Pick<
    Settings,
    "focusMinutes" | "shortBreakMinutes" | "longBreakMinutes" | "sessionsBeforeLongBreak"
  >
  label: string
  description: string
}

const numericFields: NumericSettingField[] = [
  {
    id: "focusMinutes",
    label: "Focus minutes",
    description: "Range target: 1-180",
  },
  {
    id: "shortBreakMinutes",
    label: "Short break minutes",
    description: "Range target: 1-60",
  },
  {
    id: "longBreakMinutes",
    label: "Long break minutes",
    description: "Range target: 1-180",
  },
  {
    id: "sessionsBeforeLongBreak",
    label: "Sessions before long break",
    description: "Range target: 1-12",
  },
]

export function SettingsForm({
  settings,
  onPatchSettings,
}: SettingsFormProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <Settings2 className="size-5" />
            </div>
            <div>
              <CardTitle>Timer settings</CardTitle>
              <CardDescription>
                Scaffolded inputs are wired. Validation rules still live in the TODOs.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {numericFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>{field.label}</Label>
              <Input
                id={field.id}
                type="number"
                min={1}
                value={settings[field.id]}
                onChange={(event) =>
                  onPatchSettings({
                    [field.id]: Number(event.target.value) || 0,
                  })
                }
              />
              <p className="text-xs text-muted-foreground">{field.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Theme and sound toggles are wired to the shared store.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            <Label>Theme</Label>
            <div className="grid grid-cols-2 gap-3">
              {(["light", "dark"] as ThemeMode[]).map((themeOption) => {
                const Icon = themeOption === "light" ? SunMedium : Moon

                return (
                  <Button
                    key={themeOption}
                    type="button"
                    variant={settings.theme === themeOption ? "default" : "outline"}
                    className="h-12 rounded-2xl"
                    onClick={() => onPatchSettings({ theme: themeOption })}
                  >
                    <Icon className="size-4" />
                    {themeOption === "light" ? "Light" : "Dark"}
                  </Button>
                )
              })}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-[24px] border border-border/80 p-4">
            <div className="space-y-1">
              <Label htmlFor="sound-enabled" className="flex items-center gap-2">
                <Volume2 className="size-4" />
                Completion chime
              </Label>
              <p className="text-xs text-muted-foreground">
                Play a single chime when a phase completes.
              </p>
            </div>
            <Switch
              id="sound-enabled"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => onPatchSettings({ soundEnabled: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
