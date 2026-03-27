import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon as ChevronDown, CheckIcon as Check } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export const Select = ({ value, onValueChange, children }: { value?: string, onValueChange?: (v: string) => void, children: React.ReactNode }) => {
  return (
    <Listbox value={value} onChange={onValueChange}>
      <div className="relative block w-full">{children}</div>
    </Listbox>
  );
};

export const SelectTrigger = React.forwardRef<HTMLButtonElement, { className?: string, children: React.ReactNode }>(({ className, children, ...props }, ref) => (
  <Listbox.Button
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow-sm ring-offset-white dark:ring-offset-gray-900 focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50 ml-1" aria-hidden="true" />
  </Listbox.Button>
));
SelectTrigger.displayName = "SelectTrigger";

export const SelectValue = ({ placeholder }: { placeholder?: React.ReactNode }) => {
  return (
    <span className="block truncate pointer-events-none">
      {placeholder}
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
        "absolute z-[9999] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border border-gray-200 dark:border-gray-800",
        className
      )}
    >
      {children}
    </Listbox.Options>
  </Transition>
);

export const SelectItem = React.forwardRef<HTMLLIElement, { className?: string, value: string, children: React.ReactNode }>(({ className, value, children, ...props }, ref) => (
  <Listbox.Option
    ref={ref}
    value={value}
    className={({ active }) =>
      cn(
        "relative cursor-pointer select-none py-2 pl-3 pr-9 transition-colors",
        active ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100" : "text-gray-900 dark:text-gray-100",
        className
      )
    }
    {...props}
  >
    {({ selected }) => (
      <>
        <span className={cn("block truncate", selected ? "font-semibold text-primary" : "font-normal")}>
          {children}
        </span>
        {selected && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary">
            <Check className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </>
    )}
  </Listbox.Option>
));
SelectItem.displayName = "SelectItem";
