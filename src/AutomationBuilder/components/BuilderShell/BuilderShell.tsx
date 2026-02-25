import type { ReactNode } from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/Button"
import { Input } from "@/components/input"

type BuilderShellProps = {
  automationId: string
  children: ReactNode
}

export function BuilderShell({ automationId, children }: BuilderShellProps) {
  const [automationName, setAutomationName] = useState(automationId === "new" ? "New Automation" : automationId)
  const [status, setStatus] = useState<"active" | "inactive">("active")

  return (
    <div className="h-full w-full overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col">
      <div className="h-16 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center px-4 md:px-6 justify-between shrink-0 z-20">
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <Link to="/automations">
            <Button variant="ghost" size="sm" className="inline-flex items-center gap-2">
              <ArrowLeftIcon className="w-4 h-4" />
            </Button>
          </Link>

          <Input value={automationName} onChange={(e) => setAutomationName(e.target.value)} className="text-lg font-semibold text-slate-800 dark:text-slate-100 border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-primary px-2 h-9 w-[280px] md:w-[340px] bg-transparent shadow-none" />

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

          <button type="button" onClick={() => setStatus((prev) => (prev === "active" ? "inactive" : "active"))} className={`text-sm font-medium px-2 py-1 rounded-full border flex items-center justify-center gap-1.5 transition-colors w-24 ${status === "active" ? "text-primary bg-primary/10 border-primary/20" : "text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"}`} title="Toggle active status">
            <span className={`h-1.5 w-1.5 rounded-full ${status === "active" ? "bg-primary" : "bg-slate-400"}`} />
            {status === "active" ? "Active" : "Inactive"}
          </button>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <div className="text-sm text-slate-500 dark:text-slate-400">Not saved</div>
          <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
            Save Automation
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
