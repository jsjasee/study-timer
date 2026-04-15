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
    <header className="relative flex min-h-11 items-center justify-between gap-3">
      <div
        aria-hidden="true"
        className="absolute inset-x-[14%] top-[-60%] h-16 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--accent)_22%,transparent),transparent_72%)] blur-2xl"
      />
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/35 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--card)_72%,white_28%),color-mix(in_oklch,var(--card)_56%,transparent))] text-accent shadow-[0_0_0_1px_color-mix(in_oklch,var(--accent)_24%,transparent),0_10px_26px_-14px_color-mix(in_oklch,var(--accent)_55%,transparent)] backdrop-blur-md dark:border-white/10 dark:bg-[linear-gradient(180deg,color-mix(in_oklch,var(--card)_88%,white_12%),color-mix(in_oklch,var(--card)_36%,transparent))]">
          <Coffee className="size-4" />
        </div>
        <h1 className="truncate text-[1.18rem] font-semibold tracking-[-0.05em] text-foreground sm:text-[1.3rem]">
          <span className="bg-[linear-gradient(135deg,color-mix(in_oklch,var(--accent)_90%,white_10%)_0%,color-mix(in_oklch,var(--primary)_74%,white_26%)_65%,color-mix(in_oklch,var(--ring-short)_54%,white_46%)_100%)] bg-clip-text text-transparent drop-shadow-[0_0_20px_color-mix(in_oklch,var(--accent)_32%,transparent)]">
            Study Cafe
          </span>
        </h1>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="rounded-full border border-white/25 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--card)_72%,white_28%),color-mix(in_oklch,var(--card)_58%,transparent))] text-foreground shadow-[0_10px_30px_-18px_color-mix(in_oklch,var(--foreground)_40%,transparent)] backdrop-blur-md hover:bg-white/55 dark:border-white/10 dark:bg-[linear-gradient(180deg,color-mix(in_oklch,var(--card)_82%,white_18%),color-mix(in_oklch,var(--card)_40%,transparent))] dark:hover:bg-white/12"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
          <ThemeIcon className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="rounded-full border border-white/25 bg-[linear-gradient(180deg,color-mix(in_oklch,var(--card)_72%,white_28%),color-mix(in_oklch,var(--card)_58%,transparent))] text-foreground shadow-[0_10px_30px_-18px_color-mix(in_oklch,var(--foreground)_40%,transparent)] backdrop-blur-md hover:bg-white/55 dark:border-white/10 dark:bg-[linear-gradient(180deg,color-mix(in_oklch,var(--card)_82%,white_18%),color-mix(in_oklch,var(--card)_40%,transparent))] dark:hover:bg-white/12"
          onClick={onOpenSettings}
          aria-label="Open settings"
        >
          <Settings2 className="size-4" />
        </Button>
      </div>
    </header>
  )
}
