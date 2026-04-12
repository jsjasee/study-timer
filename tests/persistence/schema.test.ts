import { describe, expect, it } from "vitest"

import { createDefaultPersistedState } from "@/lib/config/study-timer"
import { persistedStudyTimerStateSchema } from "@/lib/persistence/schema"

describe("persistedStudyTimerStateSchema", () => {
  it("accepts the scaffolded default persisted state", () => {
    const result = persistedStudyTimerStateSchema.safeParse(
      createDefaultPersistedState(),
    )

    expect(result.success).toBe(true)
  })

  it.todo("rejects out-of-range settings once the storage constraints are finalized")
})
