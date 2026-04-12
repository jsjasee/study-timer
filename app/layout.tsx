import type { Metadata } from "next"

import "./globals.css"

const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "Study Timer"

export const metadata: Metadata = {
  title: `${appName} Scaffold`,
  description:
    "Scaffolded study timer shell built with Next.js, Tailwind CSS, Zustand, Zod, and shadcn/ui patterns.",
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
      className="h-full antialiased"
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  )
}
