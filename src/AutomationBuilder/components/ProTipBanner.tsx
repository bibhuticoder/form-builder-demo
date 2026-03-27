import { ChevronLeftIcon, ChevronRightIcon, ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/Button"
import { AutomationCard } from "./AutomationCard"

type ProTipBannerProps = {
  tip: string
  currentIndex: number
  total: number
  onPrev: () => void
  onNext: () => void
  onDismiss: () => void
}

export function ProTipBanner({ tip, currentIndex, total, onPrev, onNext, onDismiss }: ProTipBannerProps) {
  return (
    <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-end pointer-events-none">
      <AutomationCard className="p-3 shadow-lg pointer-events-auto max-w-2xl w-full mr-4 bg-primary/10 border-primary/20 dark:bg-primary/20 dark:border-primary/30">
        <div className="flex gap-3 items-center">
          <ExclamationCircleIcon className="w-5 h-5 text-primary shrink-0" />
          <div className="flex-1 text-xs text-primary dark:text-primary-foreground flex items-center gap-2">
            <span className="font-semibold">Pro Tip:</span>
            <span className="text-primary/90 dark:text-primary-foreground/90">{tip}</span>
          </div>

          <div className="flex items-center gap-1 border-l border-primary/30 dark:border-primary/40 pl-2">
            <Button variant="ghost" size="icon" className="h-6 w-6 border-0 text-primary/80 dark:text-primary-foreground/80 hover:text-primary dark:hover:text-primary-foreground hover:bg-primary/10 dark:hover:bg-primary/20 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:ring-0" onClick={onPrev}>
              <ChevronLeftIcon className="h-3 w-3" />
            </Button>
            <span className="text-[10px] text-primary/80 dark:text-primary-foreground/80 font-medium w-8 text-center">
              {currentIndex + 1} / {total}
            </span>
            <Button variant="ghost" size="icon" className="h-6 w-6 border-0 text-primary/80 dark:text-primary-foreground/80 hover:text-primary dark:hover:text-primary-foreground hover:bg-primary/10 dark:hover:bg-primary/20 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 active:ring-0" onClick={onNext}>
              <ChevronRightIcon className="h-3 w-3" />
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="h-6 w-6 text-primary/80 dark:text-primary-foreground/80 hover:text-primary dark:hover:text-primary-foreground hover:bg-primary/10 dark:hover:bg-primary/20 ml-1" onClick={onDismiss}>
            <span className="sr-only">Dismiss</span>
            <XMarkIcon className="h-4 w-4" />
          </Button>
        </div>
      </AutomationCard>
    </div>
  )
}
