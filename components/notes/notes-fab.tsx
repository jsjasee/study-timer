import Image from "next/image"

import { Button } from "@/components/ui/button"

type NotesFabProps = {
  onClick: () => void
}

export function NotesFab({ onClick }: NotesFabProps) {
  return (
    <Button
      type="button"
      size="icon-lg"
      className="fixed right-5 bottom-16 z-40 size-12 rounded-full border-0 bg-transparent p-0 transition-all duration-300 ease-in-out hover:scale-[1.08] active:scale-95 sm:right-7 sm:bottom-5"
      onClick={onClick}
      aria-label="Open notes panel"
    >
      <span className="relative block size-full">
        <Image
          src="/kuromi.webp"
          alt="Notes"
          fill
          sizes="48px"
          className="object-contain scale-[2] drop-shadow-[0_0_8px_color-mix(in_oklch,var(--accent)_28%,transparent)] transition-all duration-300 ease-in-out group-hover/button:drop-shadow-[0_0_18px_color-mix(in_oklch,var(--accent)_58%,transparent)] group-active/button:drop-shadow-[0_0_24px_color-mix(in_oklch,var(--accent)_72%,transparent)] dark:drop-shadow-[0_0_10px_color-mix(in_oklch,var(--accent)_38%,transparent)] dark:group-hover/button:drop-shadow-[0_0_22px_color-mix(in_oklch,var(--accent)_70%,transparent)] dark:group-active/button:drop-shadow-[0_0_28px_color-mix(in_oklch,var(--accent)_82%,transparent)]"
        />
      </span>
    </Button>
  )
}
