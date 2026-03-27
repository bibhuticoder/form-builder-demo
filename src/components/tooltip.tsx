import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

type TooltipContextValue = {
  open: boolean
  setOpen: (v: boolean) => void
  anchorEl: HTMLElement | null
  setAnchorEl: (el: HTMLElement | null) => void
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null)

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  return (
    <TooltipContext.Provider value={{ open, setOpen, anchorEl, setAnchorEl }}>
      <span className="relative inline-flex">{children}</span>
    </TooltipContext.Provider>
  )
}

export function TooltipTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) {
  const ctx = React.useContext(TooltipContext)
  if (!ctx) throw new Error("TooltipTrigger must be used within Tooltip")

  const props = {
    onMouseEnter: (e: any) => {
      ctx.setAnchorEl(e.currentTarget as HTMLElement)
      ctx.setOpen(true)
      children.props.onMouseEnter?.(e)
    },
    onMouseLeave: (e: any) => {
      ctx.setOpen(false)
      children.props.onMouseLeave?.(e)
    },
    onFocus: (e: any) => {
      ctx.setAnchorEl(e.currentTarget as HTMLElement)
      ctx.setOpen(true)
      children.props.onFocus?.(e)
    },
    onBlur: (e: any) => {
      ctx.setOpen(false)
      children.props.onBlur?.(e)
    },
  }

  if (asChild) return React.cloneElement(children, props)
  return <span {...props}>{children}</span>
}

export function TooltipContent({ side = "top", className, children }: { side?: "top" | "bottom" | "left" | "right"; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(TooltipContext)
  if (!ctx) throw new Error("TooltipContent must be used within Tooltip")
  if (!ctx.open || !ctx.anchorEl) return null

  const rect = ctx.anchorEl.getBoundingClientRect()
  const sideStyles: Record<"top" | "bottom" | "left" | "right", { top: number; left: number; transform: string }> = {
    top: {
      top: rect.top - 8,
      left: rect.left + rect.width / 2,
      transform: "translate(-50%, -100%)",
    },
    bottom: {
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
      transform: "translate(-50%, 0)",
    },
    left: {
      top: rect.top + rect.height / 2,
      left: rect.left - 8,
      transform: "translate(-100%, -50%)",
    },
    right: {
      top: rect.top + rect.height / 2,
      left: rect.right + 8,
      transform: "translate(0, -50%)",
    },
  }

  const s = sideStyles[side]

  return createPortal(
    <span className={cn("fixed z-[9999] rounded-md border border-primary/30 dark:border-primary/40 bg-primary dark:bg-primary/90 px-2 py-1 text-xs text-white shadow-md whitespace-nowrap pointer-events-none", className)} style={{ top: s.top, left: s.left, transform: s.transform }}>
      {children}
    </span>,
    document.body,
  )
}
