"use client"

import * as React from "react"
import { Coffee, Moon, Settings2, SunMedium, Volume2 } from "lucide-react"

import {
  TimeInput,
  type TimeInputHandle,
} from "@/components/settings/time-input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { LIMITS } from "@/lib/config/study-timer"
import type { Settings, ThemeMode, TimerStatus } from "@/types/study-timer"

type SettingsFormProps = {
  settings: Settings
  timerStatus: TimerStatus
  onPatchSettings: (patch: Partial<Settings>) => void
  onApplySettings: () => void
  onSaveSuccess: (mode: "applied" | "saved") => void
}

type NumericSettingField = {
  id: keyof Pick<
    Settings,
    | "focusMinutes"
    | "shortBreakMinutes"
    | "longBreakMinutes"
    | "sessionsBeforeLongBreak"
  >
  label: string
  description: string
}

const numericFields: NumericSettingField[] = [
  {
    id: "sessionsBeforeLongBreak",
    label: "",
    description: `Range target: 1-${LIMITS.maxSessionsBeforeLongBreak}`,
  },
]

export function SettingsForm({
  settings,
  timerStatus,
  onPatchSettings,
  onApplySettings,
  onSaveSuccess,
}: SettingsFormProps) {
  const [draftSettings, setDraftSettings] = React.useState(settings)
  const [errors, setErrors] = React.useState<Partial<Record<string, string>>>(
    {}
  )
  const [isSaving, setIsSaving] = React.useState(false)

  const focusInputRef = React.useRef<TimeInputHandle>(null)
  const shortBreakInputRef = React.useRef<TimeInputHandle>(null)
  const longBreakInputRef = React.useRef<TimeInputHandle>(null)

  React.useEffect(() => {
    setDraftSettings(settings)
    setErrors({})
  }, [settings])

  const updateDraftSetting = React.useCallback(
    (key: keyof Settings, value: Settings[keyof Settings]) => {
      setDraftSettings((currentSettings) => ({
        ...currentSettings,
        [key]: value,
      }))

      setErrors((currentErrors) => {
        if (!currentErrors[key]) {
          return currentErrors
        }

        const nextErrors = { ...currentErrors }
        delete nextErrors[key]
        return nextErrors
      })
    },
    []
  )

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSaving) {
      return
    }

    const focusError = focusInputRef.current?.validate() ?? null
    const shortBreakError = shortBreakInputRef.current?.validate() ?? null
    const longBreakError = longBreakInputRef.current?.validate() ?? null

    const nextErrors: Partial<Record<string, string>> = {}

    if (focusError) {
      nextErrors.focusMinutes = focusError
    }

    if (shortBreakError) {
      nextErrors.shortBreakMinutes = shortBreakError
    }

    if (longBreakError) {
      nextErrors.longBreakMinutes = longBreakError
    }

    if (
      !Number.isInteger(draftSettings.sessionsBeforeLongBreak) ||
      draftSettings.sessionsBeforeLongBreak < 1 ||
      draftSettings.sessionsBeforeLongBreak > LIMITS.maxSessionsBeforeLongBreak
    ) {
      nextErrors.sessionsBeforeLongBreak = `Enter a value from 1 to ${LIMITS.maxSessionsBeforeLongBreak}`
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSaving(true)

    onPatchSettings({
      focusMinutes: Math.floor(
        (focusInputRef.current?.getTotalSeconds() ?? 0) / 60
      ),
      shortBreakMinutes: Math.floor(
        (shortBreakInputRef.current?.getTotalSeconds() ?? 0) / 60
      ),
      longBreakMinutes: Math.floor(
        (longBreakInputRef.current?.getTotalSeconds() ?? 0) / 60
      ),
      sessionsBeforeLongBreak: draftSettings.sessionsBeforeLongBreak,
      soundEnabled: draftSettings.soundEnabled,
      theme: draftSettings.theme,
    })

    if (timerStatus === "idle") {
      onApplySettings()
      onSaveSuccess("applied")
      return
    }

    onSaveSuccess("saved")
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <Settings2 className="size-5" />
            </div>
            <div>
              <CardTitle>Timer settings</CardTitle>
              <CardDescription>
                Set your focus and break durations, then save when everything
                looks right.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <TimeInput
            ref={focusInputRef}
            label="Focus Time"
            defaultHours={0}
            defaultMinutes={settings.focusMinutes}
            maxTotalMinutes={LIMITS.maxFocusMinutes}
            onChange={(totalSeconds) => {
              updateDraftSetting("focusMinutes", Math.floor(totalSeconds / 60))
            }}
            error={errors.focusMinutes ?? null}
          />

          <TimeInput
            ref={shortBreakInputRef}
            label="Short Break"
            defaultHours={0}
            defaultMinutes={settings.shortBreakMinutes}
            maxTotalMinutes={LIMITS.maxShortBreakMinutes}
            onChange={(totalSeconds) => {
              updateDraftSetting(
                "shortBreakMinutes",
                Math.floor(totalSeconds / 60)
              )
            }}
            error={errors.shortBreakMinutes ?? null}
          />

          <TimeInput
            ref={longBreakInputRef}
            label="Long Break"
            defaultHours={0}
            defaultMinutes={settings.longBreakMinutes}
            maxTotalMinutes={LIMITS.maxLongBreakMinutes}
            onChange={(totalSeconds) => {
              updateDraftSetting(
                "longBreakMinutes",
                Math.floor(totalSeconds / 60)
              )
            }}
            error={errors.longBreakMinutes ?? null}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
              <Coffee className="size-5" />
            </div>
            <div>
              <CardTitle>Sessions</CardTitle>
              <CardDescription>
                Configure the number of focus sessions before a long break.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {numericFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input
                  id={field.id}
                  type="number"
                  min={1}
                  max={LIMITS.maxSessionsBeforeLongBreak}
                  aria-invalid={Boolean(errors[field.id])}
                  value={draftSettings[field.id]}
                  onChange={(event) =>
                    updateDraftSetting(
                      field.id,
                      Number(event.target.value) || 0
                    )
                  }
                  className={
                    errors[field.id]
                      ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20"
                      : undefined
                  }
                />
                {errors[field.id] ? (
                  <p className="text-xs text-destructive">{errors[field.id]}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {field.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Theme and sound toggles are wired to the shared store.
          </CardDescription>
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
                    variant={
                      draftSettings.theme === themeOption
                        ? "default"
                        : "outline"
                    }
                    className="h-12 rounded-2xl"
                    onClick={() => updateDraftSetting("theme", themeOption)}
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
              <Label
                htmlFor="sound-enabled"
                className="flex items-center gap-2"
              >
                <Volume2 className="size-4" />
                Completion chime
              </Label>
              <p className="text-xs text-muted-foreground">
                Play a single chime when a phase completes.
              </p>
            </div>
            <Switch
              id="sound-enabled"
              checked={draftSettings.soundEnabled}
              onCheckedChange={(checked) =>
                updateDraftSetting("soundEnabled", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        size="lg"
        className="h-12 w-full rounded-2xl"
        disabled={isSaving}
      >
        Save
      </Button>
    </form>
  )
}
