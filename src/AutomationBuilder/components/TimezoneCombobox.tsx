import { useState, Fragment, useMemo } from "react"
import { Combobox as HeadlessCombobox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import { cn } from "@/lib/utils"

export type TimezoneInfo = {
  id: string
  city: string
  area: string
  time: string
  offset: string
  tzLongName: string
}

const getTimezoneInfo = (tz: string): TimezoneInfo => {
  const now = new Date()
  const parts = tz.split("/")
  const city = parts[parts.length - 1].replace(/_/g, " ")
  const area = parts.length > 1 ? parts[0] : ""

  const timeStr = now.toLocaleTimeString("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  // Format GMT Offset
  const offsetStr =
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value || ""

  // Full Timezone Name (e.g. Eastern Standard Time)
  const tzLongName =
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "long",
    })
      .formatToParts(now)
      .find((p) => p.type === "timeZoneName")?.value || ""

  return { id: tz, city, area, time: timeStr, offset: offsetStr, tzLongName }
}

interface TimezoneComboboxProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export const TimezoneCombobox = ({ value, onValueChange, className }: TimezoneComboboxProps) => {
  const [query, setQuery] = useState("")

  const allTimezones = useMemo(() => {
    try {
      return (Intl as any).supportedValuesOf("timeZone")
    } catch {
      return ["UTC", "America/New_York", "Europe/London", "Asia/Kathmandu"]
    }
  }, [])

  const filteredTimezones = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim()
    const list = normalizedQuery === "" ? allTimezones : allTimezones.filter((tz: string) => tz.toLowerCase().includes(normalizedQuery))

    // Only calculate info for the filtered/displayed list to remain performant
    return list.slice(0, 50).map((tz: string) => getTimezoneInfo(tz))
  }, [allTimezones, query])

  const selectedTzInfo = useMemo(() => (value ? getTimezoneInfo(value) : null), [value])

  return (
    <div className={cn("relative w-full", className)}>
      <HeadlessCombobox value={value} onChange={onValueChange}>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-left focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200 h-8 flex items-center">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-slate-400">
              <MagnifyingGlassIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
            <HeadlessCombobox.Input className="w-full border-none py-0 pl-8 pr-8 text-xs leading-none text-slate-900 dark:text-slate-100 bg-transparent focus:ring-0 outline-none placeholder:text-slate-400" placeholder="Search city or timezone..." displayValue={() => selectedTzInfo?.city || value} onChange={(e) => setQuery(e.target.value)} />
            <HeadlessCombobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 hover:text-slate-600">
              <ChevronUpDownIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </HeadlessCombobox.Button>
          </div>

          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" afterLeave={() => setQuery("")}>
            <HeadlessCombobox.Options className="absolute z-[100] mt-1.5 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-slate-900 py-1 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none text-xs border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
              {filteredTimezones.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-6 px-4 text-slate-500 text-center italic space-y-1">
                  <p className="text-xs">No timezones found for "{query}"</p>
                  <p className="text-[10px] text-slate-400">Try searching for a major city or continent.</p>
                </div>
              ) : (
                filteredTimezones.map((tz: TimezoneInfo) => (
                  <HeadlessCombobox.Option key={tz.id} className={({ active }) => cn("relative cursor-default select-none py-2.5 pl-3 pr-3 border-b border-slate-50 dark:border-slate-800/50 last:border-0 transition-colors", active ? "bg-primary/5 dark:bg-primary/10" : "transparent")} value={tz.id}>
                    {({ selected }) => (
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col min-w-0 flex-1 space-y-1.5">
                          <div className={cn("text-sm font-semibold flex items-center gap-2 leading-tight", selected ? "text-primary" : "text-slate-900 dark:text-slate-100")}>
                            {selected && (
                              <div className="flex items-center text-primary flex-shrink-0">
                                <div className="h-4 w-4 rounded-full bg-primary/10 flex items-center justify-center">
                                  <CheckIcon className="h-2.5 w-2.5" aria-hidden="true" />
                                </div>
                              </div>
                            )}
                            <div className="truncate">
                              {tz.city}
                              {tz.area && <span className="text-slate-500 dark:text-slate-400 font-normal ml-1">({tz.area})</span>}
                            </div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded flex-shrink-0 ml-auto">{tz.time}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded">{tz.offset}</span>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug text-right flex-shrink-0">{tz.tzLongName}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </HeadlessCombobox.Option>
                ))
              )}
            </HeadlessCombobox.Options>
          </Transition>
        </div>
      </HeadlessCombobox>
    </div>
  )
}
