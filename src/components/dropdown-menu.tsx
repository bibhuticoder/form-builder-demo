import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { cn } from '@/lib/utils';


const DropdownMenu = ({ children }: { children: React.ReactNode }) => (
  <Menu as="div" className="relative inline-block text-left">
    {children}
  </Menu>
);

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Menu.Button> & { asChild?: boolean }>(
  ({ className, asChild, ...props }, ref) => {
    return (
      <Menu.Button
        ref={ref}
        as={asChild ? "div" : "button"}
        className={cn("outline-none cursor-pointer focus:outline-none flex items-center", className)}
        {...props}
      />
    );
  }
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent: React.FC<React.ComponentProps<typeof Menu.Items> & { align?: "start" | "center" | "end" }> = ({ className, align = "center", ...props }) => {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items
        className={cn(
          "absolute z-50 mt-2 min-w-[8rem] origin-top-right rounded-md border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-1 text-gray-900 dark:text-gray-200 shadow-md focus:outline-none",
          align === "end" ? "right-0" : align === "start" ? "left-0" : "",
          className
        )}
        {...props}
      />
    </Transition>
  );
};

const DropdownMenuItem = React.forwardRef<HTMLElement, { className?: string, children: React.ReactNode, onClick?: (e: any) => void }>(({ className, children, onClick, ...props }, ref) => {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          ref={ref as any}
          onClick={onClick}
          className={cn(
            "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
            active ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50" : "",
            className
          )}
          {...props as any}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
};
