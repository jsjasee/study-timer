"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

type AuroraBackgroundProps = {
  className?: string
}

const MOBILE_MEDIA_QUERY = "(max-width: 768px)"
const REDUCED_MOTION_MEDIA_QUERY = "(prefers-reduced-motion: reduce)"

export function AuroraBackground({ className }: AuroraBackgroundProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const mobileMediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY)
    const reducedMotionMediaQuery = window.matchMedia(
      REDUCED_MOTION_MEDIA_QUERY
    )

    const syncPreferences = () => {
      setIsMobile(mobileMediaQuery.matches)
      setPrefersReducedMotion(reducedMotionMediaQuery.matches)
    }

    syncPreferences()

    mobileMediaQuery.addEventListener("change", syncPreferences)
    reducedMotionMediaQuery.addEventListener("change", syncPreferences)

    return () => {
      mobileMediaQuery.removeEventListener("change", syncPreferences)
      reducedMotionMediaQuery.removeEventListener("change", syncPreferences)
    }
  }, [])

  if (isMobile) {
    return null
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-10 overflow-hidden print:hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-8%,var(--aurora-base),transparent_48%)]" />
      <div className="aurora-cafe-glow absolute inset-x-0 top-[-8%] h-[34vh]" />
      <div className="aurora-window-haze absolute inset-x-[8%] top-[18%] h-[38vh] rounded-[50%]" />
      {prefersReducedMotion ? (
        <>
          <div className="aurora-blob absolute left-[-8%] top-[-4%] h-[52vh] w-[52vh] rounded-full" />
          <div className="aurora-blob aurora-blob-secondary absolute right-[-10%] top-[2%] h-[46vh] w-[46vh] rounded-full" />
          <div className="aurora-blob aurora-blob-accent absolute left-[16%] top-[10%] h-[32vh] w-[32vh] rounded-full" />
          <div className="aurora-blob aurora-blob-violet absolute right-[14%] top-[30%] h-[28vh] w-[28vh] rounded-full" />
        </>
      ) : (
        <>
          <motion.div
            className="aurora-blob absolute left-[-8%] top-[-4%] h-[52vh] w-[52vh] rounded-full"
            animate={{
              x: ["0%", "10%", "0%"],
              y: ["0%", "7%", "0%"],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="aurora-blob aurora-blob-secondary absolute right-[-10%] top-[2%] h-[46vh] w-[46vh] rounded-full"
            animate={{
              x: ["0%", "-8%", "0%"],
              y: ["0%", "8%", "0%"],
              scale: [1, 1.14, 1],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="aurora-blob aurora-blob-accent absolute left-[16%] top-[10%] h-[32vh] w-[32vh] rounded-full"
            animate={{
              x: ["0%", "-6%", "0%"],
              y: ["0%", "11%", "0%"],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 32,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="aurora-blob aurora-blob-violet absolute right-[14%] top-[30%] h-[28vh] w-[28vh] rounded-full"
            animate={{
              x: ["0%", "-6%", "0%"],
              y: ["0%", "6%", "0%"],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 36,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </>
      )}
    </div>
  )
}
