import * as React from "react"
import { type VariantProps } from "class-variance-authority"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ShimmerButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    shimmerClassName?: string
  }

export function ShimmerButton({
  className,
  variant = "default",
  size = "default",
  shimmerClassName,
  children,
  ...props
}: ShimmerButtonProps) {
  return (
    <Button
      className={cn(
        "shimmer-button relative isolate overflow-hidden",
        className
      )}
      variant={variant}
      size={size}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn("shimmer-sweep absolute inset-0", shimmerClassName)}
      />
      <span className="relative z-10 inline-flex items-center gap-inherit">
        {children}
      </span>
    </Button>
  )
}
