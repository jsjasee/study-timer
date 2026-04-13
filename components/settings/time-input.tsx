"use client"

import * as React from "react"

import { Label } from "@/components/ui/label"
import { LIMITS } from "@/lib/config/study-timer"
import { cn } from "@/lib/utils"

export type TimeInputHandle = {
  validate: () => string | null
  getTotalSeconds: () => number
}

type TimeInputProps = {
  label: string
  defaultHours: number
  defaultMinutes: number
  maxTotalMinutes: number
  minTotalMinutes?: number
  onChange: (totalSeconds: number) => void
  error?: string | null
}

const HOURS_MIN_LENGTH = 2
const MINUTES_MIN_LENGTH = 2
const CONFIGURED_TIME_INPUT_MAX_MINUTES = Math.max(
  LIMITS.maxFocusMinutes,
  LIMITS.maxShortBreakMinutes,
  LIMITS.maxLongBreakMinutes
)

function sanitizeDigits(value: string, maxLength: number) {
  return value.replace(/\D/g, "").slice(-maxLength)
}

function normalizeNumericString(value: string) {
  return value === "" ? 0 : Number(value)
}

function formatDisplayValue(value: string, minLength: number) {
  if (value === "") {
    return "0".repeat(minLength)
  }

  if (value.length >= minLength) {
    return value
  }

  return value.padStart(minLength, "0")
}

function getHelperText(maxTotalMinutes: number) {
  if (maxTotalMinutes === 60) {
    return "Up to 60min max"
  }

  if (maxTotalMinutes % 60 === 0) {
    return `Up to ${Math.floor(maxTotalMinutes / 60)}h max`
  }

  const maxHours = Math.floor(maxTotalMinutes / 60)
  const remainingMinutes = maxTotalMinutes % 60

  if (maxHours === 0) {
    return `Up to ${maxTotalMinutes}min max`
  }

  return `Up to ${maxHours}h ${remainingMinutes}min max`
}

function getValidationError({
  hours,
  minutes,
  maxTotalMinutes,
  minTotalMinutes,
}: {
  hours: string
  minutes: string
  maxTotalMinutes: number
  minTotalMinutes: number
}) {
  const normalizedHours = normalizeNumericString(hours)
  const normalizedMinutes = normalizeNumericString(minutes)
  const maxHours = Math.floor(maxTotalMinutes / 60)
  const maxMinutesRaw = maxTotalMinutes

  if (
    !Number.isInteger(normalizedHours) ||
    normalizedHours < 0 ||
    normalizedHours > maxHours
  ) {
    return `Hours must be between 0 and ${maxHours}`
  }

  if (
    !Number.isInteger(normalizedMinutes) ||
    normalizedMinutes < 0 ||
    normalizedMinutes > maxMinutesRaw
  ) {
    return `Minutes must be between 0 and ${maxMinutesRaw}`
  }

  // TODO(business-logic): Jia — review this combined validation.
  // Verify edge cases: e.g. hours=1, minutes=61 when maxTotalMinutes=120
  // means total=121 > 120 → should reject. Confirm error message is clear.
  // Also verify the hours input clamp works for limits like 60 (maxHours=1).
  const totalMinutes = normalizedHours * 60 + normalizedMinutes

  if (totalMinutes < minTotalMinutes) {
    return "Duration cannot be zero"
  }

  if (totalMinutes > maxTotalMinutes) {
    return `Total exceeds ${maxTotalMinutes}-minute limit`
  }

  return null
}

export const TimeInput = React.forwardRef<TimeInputHandle, TimeInputProps>(
  function TimeInput(
    {
      label,
      defaultHours,
      defaultMinutes,
      maxTotalMinutes,
      minTotalMinutes = 1,
      onChange,
      error,
    },
    ref
  ) {
    const maxHours = Math.floor(maxTotalMinutes / 60)
    const maxMinutesRaw = maxTotalMinutes
    const hoursMaxLength = Math.max(1, String(maxHours).length)
    const minutesMaxLength = Math.max(
      String(maxMinutesRaw).length,
      String(CONFIGURED_TIME_INPUT_MAX_MINUTES).length
    )

    const [hours, setHours] = React.useState(() =>
      String(Math.max(0, Math.min(maxHours, defaultHours)))
    )
    const [minutes, setMinutes] = React.useState(() =>
      String(Math.max(0, Math.min(maxMinutesRaw, defaultMinutes)))
    )

    React.useEffect(() => {
      setHours(String(Math.max(0, Math.min(maxHours, defaultHours))))
      setMinutes(String(Math.max(0, Math.min(maxMinutesRaw, defaultMinutes))))
    }, [defaultHours, defaultMinutes, maxHours, maxMinutesRaw])

    const emitChange = React.useCallback(
      (nextHours: string, nextMinutes: string) => {
        const totalMinutes =
          normalizeNumericString(nextHours) * 60 +
          normalizeNumericString(nextMinutes)

        onChange(totalMinutes * 60)
      },
      [onChange]
    )

    React.useImperativeHandle(
      ref,
      () => ({
        validate: () =>
          getValidationError({
            hours,
            minutes,
            maxTotalMinutes,
            minTotalMinutes,
          }),
        getTotalSeconds: () =>
          (normalizeNumericString(hours) * 60 +
            normalizeNumericString(minutes)) *
          60,
      }),
      [hours, maxTotalMinutes, minTotalMinutes, minutes]
    )

    const hasError = Boolean(error)

    return (
      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-sm font-medium">{label}</Label>
          <p className="text-xs text-muted-foreground">
            {getHelperText(maxTotalMinutes)}
          </p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="grid flex-1 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-3">
            <input
              value={hours}
              inputMode="numeric"
              pattern="[0-9]*"
              aria-label={`${label} hours`}
              aria-invalid={hasError}
              onFocus={(event) => event.currentTarget.select()}
              onChange={(event) => {
                const nextHours = sanitizeDigits(
                  event.target.value,
                  hoursMaxLength
                )
                setHours(nextHours)
                emitChange(nextHours, minutes)
              }}
              onBlur={() => {
                setHours((currentValue) =>
                  formatDisplayValue(currentValue, HOURS_MIN_LENGTH)
                )
              }}
              className={cn(
                "flex h-14 w-full min-w-0 rounded-2xl border bg-muted/70 px-3 text-center font-mono text-2xl font-semibold tracking-tight text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20 sm:h-16 sm:text-3xl",
                hasError
                  ? "border-destructive/70 ring-4 ring-destructive/10"
                  : "border-border/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
              )}
            />
            <span className="text-2xl font-semibold text-muted-foreground sm:text-3xl">
              :
            </span>
            <input
              value={minutes}
              inputMode="numeric"
              pattern="[0-9]*"
              aria-label={`${label} minutes`}
              aria-invalid={hasError}
              onFocus={(event) => event.currentTarget.select()}
              onChange={(event) => {
                const nextMinutes = sanitizeDigits(
                  event.target.value,
                  minutesMaxLength
                )
                setMinutes(nextMinutes)
                emitChange(hours, nextMinutes)
              }}
              onBlur={() => {
                setMinutes((currentValue) =>
                  formatDisplayValue(currentValue, MINUTES_MIN_LENGTH)
                )
              }}
              className={cn(
                "flex h-14 w-full min-w-0 rounded-2xl border bg-muted/70 px-3 text-center font-mono text-2xl font-semibold tracking-tight text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20 sm:h-16 sm:text-3xl",
                hasError
                  ? "border-destructive/70 ring-4 ring-destructive/10"
                  : "border-border/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
              )}
            />
          </div>
        </div>

        <div className="flex justify-between px-1 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-muted-foreground/80">
          <span>HH</span>
          <span>MM</span>
        </div>

        <div className="min-h-5">
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
      </div>
    )
  }
)
