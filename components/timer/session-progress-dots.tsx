import { cn } from "@/lib/utils"

type SessionProgressDotsProps = {
  filledCount: number
  totalCount: number
}

export function SessionProgressDots({
  filledCount,
  totalCount,
}: SessionProgressDotsProps) {
  const safeTotalCount = Math.max(0, totalCount)
  const safeFilledCount = Math.min(Math.max(0, filledCount), safeTotalCount)

  if (safeTotalCount === 0) {
    return null
  }

  // what does Array.from() do here ...?
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-2.5"
      aria-label={`Session progress: ${safeFilledCount} of ${safeTotalCount} focus sessions completed`}
    >
      {Array.from({ length: safeTotalCount }, (_, index) => {
        const isFilled = index < safeFilledCount

        return (
          <span
            key={index}
            className={cn(
              "size-3.5 rounded-full border-2 transition-colors sm:size-4",
              isFilled
                ? "border-primary bg-primary"
                : "border-muted-foreground/35 bg-transparent"
            )}
            aria-hidden="true"
          />
        )
      })}
    </div>
  )
}
