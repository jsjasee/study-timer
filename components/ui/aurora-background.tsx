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
        "pointer-events-none fixed inset-0 overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--aurora-base),transparent_58%)]" />
      <motion.div
        className="aurora-blob absolute left-[-18%] top-[-10%] h-[42vh] w-[42vh] rounded-full"
        animate={{
          x: ["0%", "8%", "0%"],
          y: ["0%", "6%", "0%"],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="aurora-blob aurora-blob-secondary absolute right-[-14%] top-[4%] h-[36vh] w-[36vh] rounded-full"
        animate={{
          x: ["0%", "-7%", "0%"],
          y: ["0%", "7%", "0%"],
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="aurora-blob aurora-blob-accent absolute left-[24%] top-[14%] h-[24vh] w-[24vh] rounded-full"
        animate={{
          x: ["0%", "-5%", "0%"],
          y: ["0%", "10%", "0%"],
          scale: [1, 1.06, 1],
        }}
        transition={{
          duration: 34,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
