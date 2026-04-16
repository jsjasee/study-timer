/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils"

type BackgroundSceneProps = {
  className?: string
}

export function BackgroundScene({ className }: BackgroundSceneProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-0 overflow-hidden print:hidden",
        className
      )}
    >
      <img
        alt=""
        src="/night-mode.webp"
        className="bg-scene-image absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
        decoding="async"
        fetchPriority="high"
        draggable={false}
      />
      <img
        alt=""
        src="/day-mode.webp"
        className="bg-scene-image bg-scene-theme-image absolute inset-0 h-full w-full object-cover object-center opacity-100 transition-opacity duration-1000 ease-in-out dark:opacity-0"
        loading="eager"
        decoding="async"
        fetchPriority="high"
        draggable={false}
      />
    </div>
  )
}
