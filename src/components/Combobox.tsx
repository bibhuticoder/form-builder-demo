import { useState, Fragment, useRef } from "react"
import { Combobox as HeadlessCombobox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { cn } from "@/lib/utils"

export type ComboboxOption = {
  id: string | number
  label: string
}

type ComboboxProps = {
  options: ComboboxOption[]
  value?: string | number
  onValueChange: (val: string | number) => void
  placeholder?: string
  className?: string
}

export const Combobox = ({ options, value, onValueChange, placeholder = "Search...", className }: ComboboxProps) => {
  const [query, setQuery] = useState("")
  const buttonRef = useRef<HTMLButtonElement>(null)

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.label
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        )

  return (
    <div className={cn("w-full", className)}>
      <HeadlessCombobox value={value} onChange={onValueChange}>
        {({ open }) => (
          <div className="relative mt-1">
            <div className="relative w-full cursor-default overflow-hidden rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-left focus:outline-none focus:ring-1 focus:ring-primary h-8">
              <HeadlessCombobox.Input
                className="w-full border-none py-1.5 pl-3 pr-10 text-xs leading-5 text-slate-900 dark:text-slate-100 bg-transparent focus:ring-0 outline-none"
                displayValue={(val: string | number) => options.find((o) => o.id === val)?.label || ""}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => {
                  if (!open) {
                    buttonRef.current?.click();
                  }
                }}
                onClick={() => {
                  if (!open) {
                    buttonRef.current?.click();
                  }
                }}
                placeholder={placeholder}
              />
              <HeadlessCombobox.Button ref={buttonRef} className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
              </HeadlessCombobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <HeadlessCombobox.Options className="absolute z-[9999] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-slate-200 dark:border-slate-800">
                {filteredOptions.length === 0 && query !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-slate-500 text-xs text-center italic">
                    Nothing found.
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <HeadlessCombobox.Option
                      key={option.id}
                      className={({ active }) =>
                        cn(
                          "relative cursor-default select-none py-2 pl-10 pr-4 transition-colors text-xs",
                          active ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "text-slate-900 dark:text-slate-100"
                        )
                      }
                      value={option.id}
                    >
                      {({ selected }) => (
                        <>
                          <span className={cn("block truncate", selected ? "font-semibold text-primary" : "font-normal")}>
                            {option.label}
                          </span>
                          {selected ? (
                            <span
                              className={cn(
                                "absolute inset-y-0 left-0 flex items-center pl-3 text-primary"
                              )}
                            >
                              <CheckIcon className="h-4 w-4" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </HeadlessCombobox.Option>
                  ))
                )}
              </HeadlessCombobox.Options>
            </Transition>
          </div>
        )}
      </HeadlessCombobox>
    </div>
  )
}
