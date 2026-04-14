import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type StatsTabContentProps = {
  totalCompletedFocusSessions: number
}

export function StatsTabContent({
  totalCompletedFocusSessions,
}: StatsTabContentProps) {
  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardHeader className="px-0 text-center">
        <CardTitle>Total Completed Focus Sessions</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="rounded-[28px] border border-border/80 bg-background/80 px-6 py-10 text-center">
          <p className="text-5xl font-semibold tracking-[-0.08em] text-foreground sm:text-6xl">
            {totalCompletedFocusSessions}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Fully completed focus sessions across all cycles
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
