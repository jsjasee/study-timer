import {
  CURRENT_PERSISTENCE_VERSION,
  STORAGE_KEY,
  createDefaultPersistedState,
} from "@/lib/config/study-timer"
import { migratePersistedState } from "@/lib/persistence/migrations"
import type { PersistedStudyTimerState } from "@/types/study-timer"

function canUseStorage() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  )
}

function logStorageWarning(error: unknown) {
  if (process.env.NODE_ENV !== "development") {
    return
  }

  console.warn("[study-timer] storage warning", error)
}

// SCAFFOLD: Centralized localStorage access keeps the rest of the app free of storage-specific concerns.
export function loadState(): PersistedStudyTimerState | null {
  if (!canUseStorage()) {
    return null
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)

    if (!rawValue) {
      return null
    }

    const parsedValue = JSON.parse(rawValue) as unknown

    const result = migratePersistedState(parsedValue)

    // BACKUP: if migration fails, save raw data to a backup key
    if (result === null) {
      window.localStorage.setItem(
        "study-timer:backup",
        rawValue // preserve the ORIGINAL raw JSON string, under the 'study-timer:backup' key.
      )
      console.warn(
        "[study-timer] Migration failed. Raw data backed up to 'study-timer:backup'"
      )
    }

    return result // if it goes smoothly and we have a result, then we just return it and it will get saved.
  } catch (error) {
    logStorageWarning(error)
    return null
  }
}

export function saveState(state: PersistedStudyTimerState) {
  if (!canUseStorage()) {
    return
  }

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        version: CURRENT_PERSISTENCE_VERSION,
      })
    )
  } catch (error) {
    logStorageWarning(error)
  }
}

export function clearState() {
  if (!canUseStorage()) {
    return
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    logStorageWarning(error)
  }
}

export function loadStateOrDefault() {
  return loadState() ?? createDefaultPersistedState()
}
