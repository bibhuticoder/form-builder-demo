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
  const parts = tz.split('/')
  const city = parts[parts.length - 1].replace(/_/g, ' ')
  const area = parts.length > 1 ? parts[0] : ''

  const timeStr = now.toLocaleTimeString('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  // Format GMT Offset
  const offsetStr = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    timeZoneName: 'shortOffset'
  }).formatToParts(now).find(p => p.type === 'timeZoneName')?.value || ''

  // Full Timezone Name (e.g. Eastern Standard Time)
  const tzLongName = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    timeZoneName: 'long'
  }).formatToParts(now).find(p => p.type === 'timeZoneName')?.value || ''

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
    const list = normalizedQuery === "" 
      ? allTimezones 
      : allTimezones.filter((tz: string) => tz.toLowerCase().includes(normalizedQuery))
    
    // Only calculate info for the filtered/displayed list to remain performant
    return list.slice(0, 50).map((tz: string) => getTimezoneInfo(tz))
  }, [allTimezones, query])

  const selectedTzInfo = useMemo(() => value ? getTimezoneInfo(value) : null, [value])

  return (
    <div className={cn("relative w-full", className)}>
      <HeadlessCombobox value={value} onChange={onValueChange}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-left focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
              <MagnifyingGlassIcon className="h-4 w-4" aria-hidden="true" />
            </div>
            <HeadlessCombobox.Input
              className="w-full border-none py-2.5 pl-10 pr-10 text-sm leading-5 text-slate-900 dark:text-slate-100 bg-transparent focus:ring-0 outline-none placeholder:text-slate-400"
              placeholder="Search city or timezone..."
              displayValue={() => selectedTzInfo?.city || value}
              onChange={(e) => setQuery(e.target.value)}
            />
            <HeadlessCombobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400 hover:text-slate-600">
              <ChevronUpDownIcon className="h-4 w-4" aria-hidden="true" />
            </HeadlessCombobox.Button>
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <HeadlessCombobox.Options className="absolute z-[100] mt-2 max-h-80 w-full overflow-auto rounded-xl bg-white dark:bg-slate-900 py-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
              {filteredTimezones.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-10 px-4 text-slate-500 text-center italic space-y-2">
                   <p className="text-sm">No timezones found for "{query}"</p>
                   <p className="text-[10px] text-slate-400">Try searching for a major city or continent.</p>
                </div>
              ) : (
                filteredTimezones.map((tz: TimezoneInfo) => (
                  <HeadlessCombobox.Option
                    key={tz.id}
                    className={({ active }) =>
                      cn(
                        "relative cursor-default select-none py-3 pl-4 pr-10 border-b border-slate-50 dark:border-slate-800/50 last:border-0 transition-colors",
                        active ? "bg-primary/5 dark:bg-primary/10" : "transparent"
                      )
                    }
                    value={tz.id}
                  >
                    {({ selected }) => (
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col min-w-0 pr-4">
                          <div className={cn(
                            "text-sm font-semibold truncate",
                            selected ? "text-primary" : "text-slate-900 dark:text-slate-100"
                          )}>
                            {tz.city}, <span className="text-slate-400 font-normal">{tz.area}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                             <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{tz.offset}</span>
                             <span className="text-slate-300 dark:text-slate-600">•</span>
                             <span className="text-xs font-bold text-slate-600 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded uppercase tracking-tighter">{tz.time}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 italic line-clamp-1">
                            {tz.tzLongName}
                          </div>
                        </div>
                        {selected && (
                          <div className="flex items-center text-primary">
                            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                               <CheckIcon className="h-4 w-4" aria-hidden="true" />
                            </div>
                          </div>
                        )}
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
