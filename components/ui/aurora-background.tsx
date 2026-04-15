"use client"

import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

type AuroraBackgroundProps = {
  className?: string
}

export function AuroraBackground({ className }: AuroraBackgroundProps) {
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
    </div>
  )
}
