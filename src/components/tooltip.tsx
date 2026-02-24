import * as React from 'react';
import { cn } from '@/lib/utils';

type TooltipContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <span className="relative inline-flex">{children}</span>
    </TooltipContext.Provider>
  );
}

export function TooltipTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) {
  const ctx = React.useContext(TooltipContext);
  if (!ctx) throw new Error('TooltipTrigger must be used within Tooltip');

  const props = {
    onMouseEnter: (e: any) => {
      ctx.setOpen(true);
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: any) => {
      ctx.setOpen(false);
      children.props.onMouseLeave?.(e);
    },
    onFocus: (e: any) => {
      ctx.setOpen(true);
      children.props.onFocus?.(e);
    },
    onBlur: (e: any) => {
      ctx.setOpen(false);
      children.props.onBlur?.(e);
    },
  };

  if (asChild) return React.cloneElement(children, props);
  return <span {...props}>{children}</span>;
}

export function TooltipContent({ side = 'top', className, children }: { side?: 'top' | 'bottom' | 'left' | 'right'; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(TooltipContext);
  if (!ctx) throw new Error('TooltipContent must be used within Tooltip');
  if (!ctx.open) return null;

  const sideClasses: Record<string, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <span
      className={cn(
        'absolute z-50 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-2 py-1 text-xs text-gray-900 dark:text-gray-100 shadow-md whitespace-nowrap',
        sideClasses[side],
        className
      )}
    >
      {children}
    </span>
  );
}
