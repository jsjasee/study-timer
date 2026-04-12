import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type CompletedPhaseBannerProps = {
  isVisible: boolean
  onAdvance: () => void
}

export function CompletedPhaseBanner({
  isVisible,
  onAdvance,
}: CompletedPhaseBannerProps) {
  if (!isVisible) {
    return null
  }

  return (
    <Card className="border-emerald-500/20 bg-emerald-500/8">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            Phase completed
          </p>
          <p className="text-sm text-muted-foreground">
            Move to the next phase when you are ready.
          </p>
        </div>
        <Button size="sm" onClick={onAdvance}>
          Next phase
          <ArrowRight className="size-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
