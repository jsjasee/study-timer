import { MoonStar, Settings2, SunMedium } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ThemeMode } from "@/types/study-timer"

type AppHeaderProps = {
  theme: ThemeMode
  onToggleTheme: () => void
  onOpenSettings: () => void
}

export function AppHeader({
  theme,
  onToggleTheme,
  onOpenSettings,
}: AppHeaderProps) {
  const ThemeIcon = theme === "light" ? MoonStar : SunMedium

  return (
    <header className="flex items-start justify-between gap-4">
      <div className="space-y-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.05em] text-balance sm:text-4xl">
            Study Cafe
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
          <ThemeIcon className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={onOpenSettings}
          aria-label="Open settings"
        >
          <Settings2 className="size-4" />
        </Button>
      </div>
    </header>
  )
}
