import * as React from "react"

import { cn } from "@/lib/utils"

export type AutomationCardProps = React.HTMLAttributes<HTMLDivElement>

export const AutomationCard = React.forwardRef<HTMLDivElement, AutomationCardProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border border-slate-200 bg-white text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100", className)} {...props} />
))

AutomationCard.displayName = "AutomationCard"
