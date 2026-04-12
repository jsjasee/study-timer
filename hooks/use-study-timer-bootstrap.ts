"use client"

import { useEffect, useEffectEvent, useState } from "react"

import { primeChime } from "@/lib/audio/chime"
import { useStudyTimerStore } from "@/stores/use-study-timer-store"

// SCAFFOLD: Centralizes app bootstrapping so the page shell stays focused on layout and composition.
export function useStudyTimerBootstrap() {
  const loadPersistedState = useStudyTimerStore((state) => state.loadPersistedState)
  const hydrateAndRecover = useStudyTimerStore((state) => state.hydrateAndRecover)
  const timerStatus = useStudyTimerStore((state) => state.timer.status)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    loadPersistedState()
  }, [loadPersistedState])

  const handleIntervalTick = useEffectEvent(() => {
    setNow(new Date())

    if (timerStatus === "running") {
      hydrateAndRecover()
    }
  })

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      handleIntervalTick()
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  const handleFirstInteraction = useEffectEvent(() => {
    primeChime()
  })

  useEffect(() => {
    window.addEventListener("pointerdown", handleFirstInteraction, {
      once: true,
    })

    return () => {
      window.removeEventListener("pointerdown", handleFirstInteraction)
    }
  }, [])

  return { now }
}
