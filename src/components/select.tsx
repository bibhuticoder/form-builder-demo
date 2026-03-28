import React, { Fragment, createContext, useContext, useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon as ChevronDown, CheckIcon as Check } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

type SelectContextType = {
  value?: string;
  selectedLabel?: React.ReactNode;
  setSelectedLabel: (label: React.ReactNode) => void;
};

const SelectContext = createContext<SelectContextType | undefined>(undefined);

export const Select = ({ value, onValueChange, children }: { value?: string, onValueChange?: (v: string) => void, children: React.ReactNode }) => {
  const [selectedLabel, setSelectedLabel] = useState<React.ReactNode>(null);

  return (
    <SelectContext.Provider value={{ value, selectedLabel, setSelectedLabel }}>
      <Listbox value={value} onChange={onValueChange}>
        <div className="relative block w-full">{children}</div>
      </Listbox>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = React.forwardRef<HTMLButtonElement, { className?: string, children: React.ReactNode }>(({ className, children, ...props }, ref) => (
  <Listbox.Button
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow-sm ring-offset-white dark:ring-offset-gray-900 focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-40 ml-1 shrink-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
  </Listbox.Button>
));
SelectTrigger.displayName = "SelectTrigger";

export const SelectValue = ({ placeholder, children }: { placeholder?: React.ReactNode, children?: React.ReactNode }) => {
  const context = useContext(SelectContext);
  
  // If children are provided, we use them (manual mode)
  // Otherwise we use context.selectedLabel (automatic mode)
  // If neither, use placeholder
  const displayValue = children || context?.selectedLabel || placeholder;

  return (
    <span className="block truncate pointer-events-none text-left flex-1 overflow-hidden">
      {displayValue}
    </span>
  );
};

export const SelectContent = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <Transition
    as={Fragment}
    leave="transition ease-in duration-100"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <Listbox.Options
      className={cn(
        "absolute z-[9999] mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-900 py-1 text-base shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 duration-200",
        className
      )}
    >
      {children}
    </Listbox.Options>
  </Transition>
);

export const SelectItem = React.forwardRef<HTMLLIElement, { className?: string, value: string, children: React.ReactNode }>(({ className, value, children, ...props }, ref) => {
  const context = useContext(SelectContext);
  const isSelected = context?.value === value;

  // Report label up to the Select component when selected
  useEffect(() => {
    if (isSelected && context?.setSelectedLabel) {
      context.setSelectedLabel(children);
    }
  }, [isSelected, children]);

  return (
    <Listbox.Option
      ref={ref}
      value={value}
      className={({ active }) =>
        cn(
          "relative cursor-pointer select-none py-2.5 pl-3 pr-10 transition-colors",
          active ? "bg-primary/5 text-primary" : "text-gray-900 dark:text-gray-100 font-medium",
          isSelected && !active && "bg-slate-50 dark:bg-slate-800/50",
          className
        )
      }
      {...props}
    >
      {({ selected }) => (
        <>
          <span className={cn("block truncate", selected ? "font-bold text-primary" : "font-medium")}>
            {children}
          </span>
          {selected && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary animate-in zoom-in-50 duration-200">
              <Check className="h-4 w-4 stroke-[3]" aria-hidden="true" />
            </span>
          )}
        </>
      )}
    </Listbox.Option>
  );
});
SelectItem.displayName = "SelectItem";
