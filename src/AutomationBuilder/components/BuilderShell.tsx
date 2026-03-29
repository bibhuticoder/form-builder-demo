import { useAutomationBuilderContext } from "../context/AutomationBuilderContext"
import type { ReactNode } from "react"

import { Button } from "@/components/Button"
import { Input } from "@/components/input"
import { AutomationSettings } from "./AutomationSettings"
import { LastSavedIndicator } from "./LastSavedIndicator"
import SAMPLE_DATA from "../data/sample.json"

export function BuilderShell({ children }: { children: ReactNode }) {
  const { name, setName, status, setStatus, setIsDirty, saveRef, loadRef } = useAutomationBuilderContext()

  const toggleStatus = () => {
    setStatus(status === "active" ? "draft" : "active")
    setIsDirty(true)
  }

  return (
    <div className="border w-full h-full bg-slate-50 dark:bg-slate-950 flex flex-col">

      {/* Header */}
      <div className="relative overflow-visible h-16 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center px-4 justify-between shrink-0 z-40">

        <div className="flex gap-1 items-center">
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setIsDirty(true)
            }}
            className="!text-xs font-semibold text-slate-800 !shadow-sm border dark:text-slate-100 hover:border-slate-200 dark:hover:border-slate-700 focus:border-primary px-2 bg-transparent"
          />

          <AutomationSettings />

          <div className="h-6 w-px mr-4 bg-slate-200 dark:bg-slate-700" />

          <button type="button" onClick={toggleStatus} className={`text-[11px] font-medium px-2 py-1 rounded-full border flex items-center justify-center gap-1.5 transition-colors w-20 ${status === "active" ? "text-primary bg-primary/10 border-primary/20" : "text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"}`} title="Toggle active status">
            <span className={`h-1.5 w-1.5 rounded-full ${status === "active" ? "bg-primary" : "bg-slate-400"}`} />
            {status === "active" ? "Active" : "Inactive"}
          </button>
        </div>

        <div className="flex items-center gap-2">

          <LastSavedIndicator />

          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
            onClick={() => loadRef.current?.(SAMPLE_DATA)}
          >
            Load sample
          </Button>

          <Button
            size="sm"
            className="h-8 px-3 text-xs bg-primary text-white hover:bg-primary/90"
            onClick={() => saveRef.current?.()}
          >
            Save Automation
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
