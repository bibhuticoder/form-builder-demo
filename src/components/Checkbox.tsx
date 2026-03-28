import { cn } from "@/lib/utils"
import { CheckIcon } from "@heroicons/react/24/outline"

export interface CheckboxProps {
  id?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  label?: string
  className?: string
  disabled?: boolean
}

export const Checkbox = ({ id, checked, onCheckedChange, label, className, disabled }: CheckboxProps) => {
  return (
    <div className={cn("flex items-center space-x-2 group cursor-pointer", className, disabled && "opacity-50 cursor-not-allowed")}>
      <div 
        onClick={() => !disabled && onCheckedChange?.(!checked)}
        className={cn(
          "w-4 h-4 rounded border transition-all flex items-center justify-center shrink-0",
          checked 
            ? "bg-primary border-primary shadow-sm" 
            : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 group-hover:border-primary/50"
        )}
      >
        {checked && <CheckIcon className="w-3 h-3 text-white stroke-[3]" />}
      </div>
      {label && (
        <label 
          htmlFor={id} 
          className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none"
          onClick={() => !disabled && onCheckedChange?.(!checked)}
        >
          {label}
        </label>
      )}
    </div>
  )
}
