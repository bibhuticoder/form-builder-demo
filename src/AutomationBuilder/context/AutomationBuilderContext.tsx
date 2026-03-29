import { createContext, useContext, useMemo, useState, useRef } from "react"

export type AutomationSettings = {
  allowReEntry: boolean
  stopOnResponse: boolean
  executionTimezoneEnabled: boolean
  sendWindowEnabled: boolean
  timezone: string
  sendWindowStart: string
  sendWindowEnd: string
  activeDays: boolean[]
}

export type AutomationBuilderContextValue = {
  automationId: string
  name: string
  setName: (name: string) => void
  status: 'draft' | 'active' | 'paused'
  setStatus: (status: 'draft' | 'active' | 'paused') => void
  settings: AutomationSettings
  setSettings: (settings: (prev: AutomationSettings) => AutomationSettings) => void
  savedAt: string | null
  setSavedAt: (date: string | null) => void
  saveRef: React.MutableRefObject<(() => void) | null>
  loadRef: React.MutableRefObject<((data: any) => void) | null>
}

const AutomationBuilderContext = createContext<AutomationBuilderContextValue | null>(null)

export function useAutomationBuilderContext() {
  const ctx = useContext(AutomationBuilderContext)
  if (!ctx) throw new Error("useAutomationBuilderContext must be used within AutomationBuilderProvider")
  return ctx
}

export function AutomationBuilderProvider({ automationId, children }: { automationId: string; children: React.ReactNode }) {
  const [name, setName] = useState("Untitled Automation")
  const [status, setStatus] = useState<"draft" | "active" | "paused">("draft")
  const [settings, setSettings] = useState<AutomationSettings>({
    allowReEntry: false,
    stopOnResponse: false,
    executionTimezoneEnabled: true,
    sendWindowEnabled: true,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    sendWindowStart: "09:00",
    sendWindowEnd: "17:00",
    activeDays: [true, true, true, true, true, false, false]
  })
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const saveRef = useRef<(() => void) | null>(null)
  const loadRef = useRef<((data: any) => void) | null>(null)

  const value = useMemo(() => ({ 
    automationId, 
    name,
    setName,
    status,
    setStatus,
    settings,
    setSettings,
    savedAt, 
    setSavedAt,
    saveRef,
    loadRef
  }), [automationId, name, status, settings, savedAt])
  
  return <AutomationBuilderContext.Provider value={value}>{children}</AutomationBuilderContext.Provider>
}
