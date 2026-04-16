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
      className="kuromi-fab fixed right-5 bottom-16 z-40 size-12 overflow-visible rounded-full border-0 bg-transparent p-0 transition-all duration-300 ease-in-out hover:scale-[1.08] active:scale-95 sm:right-7 sm:bottom-5"
      onClick={onClick}
      aria-label="Open notes panel"
    >
      <span className="relative block size-full">
        <Image
          src="/kuromi.webp"
          alt="Notes"
          fill
          sizes="48px"
          className="object-contain scale-[2]"
        />
      </span>
    </Button>
  )
}
