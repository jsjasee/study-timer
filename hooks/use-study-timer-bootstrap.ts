"use client"

import { useEffect, useEffectEvent, useState } from "react"

import { primeChime } from "@/lib/audio/chime"
import {
  flushPersistedStudyTimerState,
  useStudyTimerStore,
} from "@/stores/use-study-timer-store"

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

  // This flushes the latest Zustand snapshot when the tab becomes hidden so deferred writes are not lost on app backgrounding or phone lock.
  const handleVisibilityChange = useEffectEvent(() => {
    if (document.hidden) {
      flushPersistedStudyTimerState()
    }
  })

  // This flushes one last time during page teardown and complements visibilitychange on browsers like mobile Safari.
  const handlePageHide = useEffectEvent(() => {
    flushPersistedStudyTimerState()
  })

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("pagehide", handlePageHide)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("pagehide", handlePageHide)
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
