import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-white hover:bg-primary/80",
        secondary:
          "border-secondary bg-secondary text-white hover:bg-secondary/80",
        destructive:
          "border-destructive bg-destructive text-white hover:bg-destructive/80",
        success:
          "border-transparent bg-emerald-100 border border-emerald-200 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
        muted:
          "border-transparent bg-slate-100 border border-slate-200 text-slate-600 dark:bg-gray-800 dark:text-gray-400",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
