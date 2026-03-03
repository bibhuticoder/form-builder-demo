import { ArrowUturnLeftIcon, ArrowUturnRightIcon, ArrowsPointingOutIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline"
import { Panel, useReactFlow } from "reactflow"
import { Button } from "@/components/Button"

export function FlowBuilderControls({ canUndo, canRedo, onUndo, onRedo }: { canUndo: boolean; canRedo: boolean; onUndo: () => void; onRedo: () => void }) {
  const { zoomIn, zoomOut, fitView } = useReactFlow()
  return (
    <Panel position="bottom-left" className="flex gap-2 items-end">
      <div className="bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => zoomIn()} title="Zoom In">
          <PlusIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => zoomOut()} title="Zoom Out">
          <MinusIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => fitView()} title="Fit View">
          <ArrowsPointingOutIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onUndo} disabled={!canUndo} title="Undo">
          <ArrowUturnLeftIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRedo} disabled={!canRedo} title="Redo">
          <ArrowUturnRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </Panel>
  )
}
