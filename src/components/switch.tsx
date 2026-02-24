import { cn } from "@/lib/utils"

type Props = {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Switch({ checked = false, onCheckedChange, disabled, className }: Props) {
  return (
    <button type="button" role="switch" aria-checked={checked} disabled={disabled} onClick={() => onCheckedChange?.(!checked)} className={cn("inline-flex h-6 w-11 items-center rounded-full border border-gray-200 dark:border-gray-700 transition-colors", checked ? "bg-primary" : "bg-gray-200 dark:bg-gray-700", disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer", className)}>
      <span className={cn("inline-block h-5 w-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-5" : "translate-x-0.5")} />
    </button>
  )
}
