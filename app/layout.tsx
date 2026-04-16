import type { Metadata } from "next"

import "./globals.css"

import { Inter } from "next/font/google"

import {
  STORAGE_KEY,
  createDefaultPersistedState,
} from "@/lib/config/study-timer"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Study Cafe"
const themeInitScript = `(() => {
  const storageKey = ${JSON.stringify(STORAGE_KEY)};
  const fallbackState = ${JSON.stringify(createDefaultPersistedState()).replace(/</g, "\\u003c")};
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  let nextTheme = prefersDark ? "dark" : "light";

  try {
    const raw = window.localStorage.getItem(storageKey);

    if (raw) {
      const parsed = JSON.parse(raw);
      const storedTheme = parsed?.settings?.theme;

      if (storedTheme === "light" || storedTheme === "dark") {
        nextTheme = storedTheme;
      }
    } else {
      fallbackState.settings.theme = nextTheme;
      window.localStorage.setItem(storageKey, JSON.stringify(fallbackState));
    }
  } catch {}

  root.classList.toggle("dark", nextTheme === "dark");
  root.dataset.theme = nextTheme;
})();`

export const metadata: Metadata = {
  title: `${appName}`,
  description:
    "Study timer designed to maximise deep work, built with Next.js, Tailwind CSS, Zustand, Zod, and shadcn/ui patterns.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`h-full ${inter.className} antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {children}
      </body>
    </html>
  )
}
