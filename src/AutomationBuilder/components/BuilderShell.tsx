import { useAutomationBuilderContext } from "../context/AutomationBuilderContext"
import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { ArrowLeftIcon, CalendarDaysIcon, ClockIcon, Cog6ToothIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/Button"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { Switch } from "@/components/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/tooltip"
import { TimezoneCombobox } from "./TimezoneCombobox"
import SAMPLE_DATA from "../data/sample.json"

function RelativeTime({ date }: { date: string | null }) {
  const [text, setText] = useState<string>("Not saved")

  useEffect(() => {
    if (!date) {
      setText("Not saved")
      return
    }

    const update = () => {
      const diff = Date.now() - new Date(date).getTime()
      const seconds = Math.floor(diff / 1000)
      if (seconds < 10) setText("Just now")
      else if (seconds < 60) setText("Seconds ago")
      else if (seconds < 3600) setText(`${Math.floor(seconds / 60)}m ago`)
      else setText(`${Math.floor(seconds / 3600)}h ago`)
    }

    update()
    const timer = setInterval(update, 10000)
    return () => clearInterval(timer)
  }, [date])

  return <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{text}</div>
}

type BuilderShellProps = {
  children: ReactNode
}


export function BuilderShell({ children }: BuilderShellProps) {
  const { name, setName, status, setStatus, settings, setSettings, savedAt, saveRef, loadRef } = useAutomationBuilderContext()
  const { allowReEntry, stopOnResponse, executionTimezoneEnabled, sendWindowEnabled, timezone, sendWindowStart, sendWindowEnd, activeDays } = settings

  const days = ["M", "T", "W", "T", "F", "S", "S"]
  const timeOptions = Array.from({ length: 24 * 2 }).map((_, i) => {
    const hour = Math.floor(i / 2)
    const minute = i % 2 === 0 ? "00" : "30"
    return `${hour.toString().padStart(2, "0")}:${minute}`
  })


  const updateSetting = <K extends keyof typeof settings>(key: K, value: typeof settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const toggleDay = (index: number) => {
    const next = [...activeDays]
    next[index] = !next[index]
    updateSetting("activeDays", next)
  }

  const toggleStatus = () => {
    setStatus(status === "active" ? "draft" : "active")
  }

  return (
    <div className="h-full w-full overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col border">
      <div className="relative overflow-visible h-16 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center px-4 md:px-6 justify-between shrink-0 z-40">
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <Link to="/automations">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 inline-flex items-center justify-center">
              <ArrowLeftIcon className="w-4 h-4" />
            </Button>
          </Link>

          <Input value={name} onChange={(e) => setName(e.target.value)} className="text-sm font-semibold text-slate-800 shadow border dark:text-slate-100 hover:border-slate-200 dark:hover:border-slate-700 focus:border-primary px-2 h-9 w-[280px] md:w-[340px] bg-transparent shadow-none" />

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

          <button type="button" onClick={toggleStatus} className={`text-[11px] font-medium px-2 py-1 rounded-full border flex items-center justify-center gap-1.5 transition-colors w-20 ${status === "active" ? "text-primary bg-primary/10 border-primary/20" : "text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"}`} title="Toggle active status">
            <span className={`h-1.5 w-1.5 rounded-full ${status === "active" ? "bg-primary" : "bg-slate-400"}`} />
            {status === "active" ? "Active" : "Inactive"}
          </button>

          {/* Settings */}
          <div className="ml-1 border-l pl-3 border-slate-200 dark:border-slate-700">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 h-8 px-3 text-xs text-slate-600 dark:text-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:ring-0">
                  <Cog6ToothIcon className="h-4 w-4" />
                  Settings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="z-[80] w-[340px] p-4 space-y-3" align="start">
                <div className="text-base font-semibold text-slate-900 dark:text-slate-100">Automation Settings</div>

                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Enable Automation</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <QuestionMarkCircleIcon className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px] whitespace-normal">
                          <p className="text-xs">
                            When <strong>Inactive</strong>, this automation is paused. No contacts will enter or be processed by this automation, even if triggers occur.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Switch checked={status === "active"} onCheckedChange={toggleStatus} />
                </div>

                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Allow Re-entry</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <QuestionMarkCircleIcon className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px] whitespace-normal">
                          <p className="text-xs">If enabled, contacts can enter this automation multiple times. If disabled, contacts can only enter this automation once.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Switch checked={allowReEntry} onCheckedChange={(val) => updateSetting("allowReEntry", val)} />
                </div>

                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Stop on Response</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <QuestionMarkCircleIcon className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[300px] whitespace-normal">
                          <p className="text-xs">If enabled, the automation will stop for a contact if they reply to a message.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Switch checked={stopOnResponse} onCheckedChange={(val) => updateSetting("stopOnResponse", val)} />
                </div>

                <div className="h-px bg-slate-200 dark:bg-slate-700" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        <ClockIcon className="h-3.5 w-3.5 text-slate-500" />
                        Execution Timezone
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <QuestionMarkCircleIcon className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[300px] whitespace-normal">
                            <p className="text-xs">If enabled, this automation will only trigger during the set times relative to this timezone. If disabled, it will default to your account timezone set in your settings.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Switch checked={executionTimezoneEnabled} onCheckedChange={(val) => updateSetting("executionTimezoneEnabled", val)} />
                  </div>
                  <div className={executionTimezoneEnabled ? "" : "opacity-30 pointer-events-none transition-opacity"}>
                    <TimezoneCombobox 
                      value={timezone} 
                      onValueChange={(val: string) => updateSetting("timezone", val)} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                        <CalendarDaysIcon className="h-3.5 w-3.5 text-slate-500" />
                        Send Window
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <QuestionMarkCircleIcon className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[300px] whitespace-normal">
                            <p className="text-xs">Automations will only trigger during the set days and hours. Actions will wait until the next available day before triggering.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Switch checked={sendWindowEnabled} onCheckedChange={(val) => updateSetting("sendWindowEnabled", val)} />
                  </div>

                  <div className={sendWindowEnabled ? "space-y-2" : "space-y-2 opacity-50 pointer-events-none"}>
                    <div className="flex gap-1 justify-between">
                      {days.map((day, i) => (
                        <button key={`${day}-${i}`} type="button" onClick={() => toggleDay(i)} className={`w-8 h-8 rounded-md text-xs font-medium transition-colors border ${activeDays[i] ? "bg-primary text-white border-primary" : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                          {day}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-1 flex-1">
                        <span className="text-[10px] font-medium text-slate-500 uppercase">Start</span>
                        <Select value={sendWindowStart} onValueChange={(val) => updateSetting("sendWindowStart", val)}>
                          <SelectTrigger className="h-8 text-xs w-full">
                            <SelectValue placeholder={sendWindowStart} />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((t) => (
                              <SelectItem key={`start-${t}`} value={t} className="text-xs">
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <span className="text-slate-400 text-xs pt-4">to</span>
                      <div className="flex flex-col gap-1 flex-1">
                        <span className="text-[10px] font-medium text-slate-500 uppercase">Stop</span>
                        <Select value={sendWindowEnd} onValueChange={(val) => updateSetting("sendWindowEnd", val)}>
                          <SelectTrigger className="h-8 text-xs w-full">
                            <SelectValue placeholder={sendWindowEnd} />
                          </SelectTrigger>
                          <SelectContent>
                            {timeOptions.map((t) => (
                              <SelectItem key={`end-${t}`} value={t} className="text-xs">
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <RelativeTime date={savedAt} />
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

      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
