import { Coffee, MoonStar, Settings2, SunMedium } from "lucide-react"

import { Button } from "@/components/ui/button"
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
    <header className="flex min-h-11 items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/40 text-accent shadow-[0_8px_24px_-14px_var(--accent)] backdrop-blur-md dark:border-white/10 dark:bg-white/8">
          <Coffee className="size-4" />
        </div>
        <h1 className="truncate text-lg font-semibold tracking-[-0.04em] text-foreground sm:text-xl">
          <span className="bg-[linear-gradient(135deg,color-mix(in_oklch,var(--accent)_84%,white_16%),color-mix(in_oklch,var(--primary)_72%,white_28%))] bg-clip-text text-transparent drop-shadow-[0_0_16px_color-mix(in_oklch,var(--accent)_24%,transparent)]">
            Study Cafe
          </span>
        </h1>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="rounded-full border border-white/25 bg-white/35 text-foreground shadow-[0_10px_30px_-18px_color-mix(in_oklch,var(--foreground)_40%,transparent)] backdrop-blur-md hover:bg-white/55 dark:border-white/10 dark:bg-white/8 dark:hover:bg-white/12"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
          <ThemeIcon className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="rounded-full border border-white/25 bg-white/35 text-foreground shadow-[0_10px_30px_-18px_color-mix(in_oklch,var(--foreground)_40%,transparent)] backdrop-blur-md hover:bg-white/55 dark:border-white/10 dark:bg-white/8 dark:hover:bg-white/12"
          onClick={onOpenSettings}
          aria-label="Open settings"
        >
          <Settings2 className="size-4" />
        </Button>
      </div>
    </header>
  )
}
