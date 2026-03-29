import type { MouseEvent } from "react"
import { ArrowPathIcon, DocumentDuplicateIcon, EllipsisVerticalIcon, PlusIcon, Squares2X2Icon, TrashIcon } from "@heroicons/react/24/outline"
import { Handle, Position, useReactFlow } from "reactflow"
import { Button } from "@/components/Button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/dropdown-menu"
import { useNodeActions } from "../../context/NodeActionsContext"

const AddStepNode = ({ data }: any) => {
  if (data?.isBranchAdder) return null
  const isDragging = !!data?.isDragging
  return (
    <div className="w-[256px] flex flex-col items-center justify-center relative">
      <div className={`w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 border-2 border-dashed flex items-center justify-center transition-colors cursor-pointer group ${isDragging ? "border-primary text-primary" : "border-slate-300 dark:border-slate-700 hover:border-primary hover:text-primary"}`}>
        <PlusIcon className={`w-5 h-5 ${isDragging ? "text-primary" : "text-slate-400 dark:text-slate-500"} group-hover:text-primary`} />
      </div>
      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-2 text-center w-32">Drag your next Action or Logic</span>
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-slate-300 !border-2 !border-white transition-colors opacity-0 !mt-[1.5px]" />
    </div>
  )
}

const PlaceholderNode = () => (
  <div className="w-[256px] border-b-2 border-l-2 border-r-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-900/60 flex flex-col">
    <div className="h-1.5 w-full rounded-t-sm bg-slate-300 dark:bg-slate-700" />
    <div className="flex items-center p-4">
      <div className="p-2 rounded-md bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 shadow-sm shrink-0 text-slate-400 dark:text-slate-500 mr-3">
        <Squares2X2Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 truncate">Start your automation</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500">Drag a Trigger, Action or Logic Here to Begin...</p>
      </div>
    </div>
  </div>
)

const NodeCard = ({ id, icon: Icon, title, subtitle, colorClass, selected, isRoot, isTargetable, hideSourceHandle }: any) => {
  const { onDuplicate, onDelete } = useNodeActions()

  return (
    <div className="relative w-[256px]">
      <div className={`w-full bg-white dark:bg-slate-900 rounded-lg shadow-sm border-2 transition-all duration-200 group relative z-10 ${selected ? "border-primary ring-2 ring-primary/20" : isTargetable ? "border-green-500 ring-2 ring-green-500/20 cursor-crosshair animate-pulse" : "border-slate-200 hover:border-primary/50 dark:border-slate-700"}`}>
        <div className={`h-1.5 w-full rounded-t-sm ${colorClass}`} />
        <div className="p-3">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 ${String(colorClass).replace("bg-", "text-")}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{subtitle}</p>
            </div>
            {!isTargetable && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild onMouseDown={(e: MouseEvent<HTMLElement>) => e.stopPropagation()} onClick={(e: MouseEvent<HTMLElement>) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-slate-500 dark:text-slate-400 transition-opacity">
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onDuplicate(id)
                    }}
                  >
                    <DocumentDuplicateIcon className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      // For now, toggle move mode or similar
                    }}
                  >
                    <Squares2X2Icon className="mr-2 h-4 w-4" />
                    Move
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(id)
                    }}
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        {!isTargetable && <Handle type="target" position={Position.Top} className={`!w-3 !h-3 !bg-slate-300 !border-2 !border-white transition-colors hover:!bg-primary ${isRoot ? "!opacity-0 !border-0" : ""}`} />}
        {!isTargetable && !hideSourceHandle && <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white transition-colors hover:!bg-primary" />}
        {!isTargetable && (
          <Handle
            type="target"
            position={Position.Left}
            id="loop-target"
            className="!w-3 !h-3 !bg-transparent !border-0 opacity-0 pointer-events-none"
          />
        )}
      </div>

    </div>
  )
}

const TriggerNode = ({ id, data, selected }: any) => {
  const { onDuplicate, onDelete } = useNodeActions()
  return (
    <div className={`w-[256px] bg-white dark:bg-slate-900 rounded-lg shadow-sm border-2 transition-all duration-200 group ${selected ? "border-primary ring-2 ring-primary/20" : data.isTargetable ? "border-green-500 ring-2 ring-green-500/20 cursor-crosshair animate-pulse" : "border-slate-200 hover:border-primary/50 dark:border-slate-700"}`}>
      <div className="h-1.5 w-full rounded-t-sm bg-blue-500" />
      <div className="p-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 text-blue-500">{data.icon ? <data.icon className="w-5 h-5" /> : <Squares2X2Icon className="w-5 h-5" />}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{data.label}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{data.subtitle || "When this happens..."}</p>
          </div>
          {!data.isTargetable && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onMouseDown={(e: MouseEvent<HTMLElement>) => e.stopPropagation()} onClick={(e: MouseEvent<HTMLElement>) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-slate-500 dark:text-slate-400 transition-opacity">
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onDuplicate(id)
                  }}
                >
                  <DocumentDuplicateIcon className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(id)
                  }}
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {!data.isTargetable && <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white transition-colors hover:!bg-primary" />}
    </div>
  )
}

const ActionNode = ({ id, data, selected }: any) => <NodeCard id={id} icon={data.icon || Squares2X2Icon} title={data.label} subtitle={data.subtitle || "Perform action"} colorClass="bg-emerald-500" selected={selected} isLastBranchNode={data.isLastBranchNode} isDragging={data.isDragging} isRoot={data.isRoot} isTargetable={data.isTargetable} hideSourceHandle={["End Automation", "Send To Automation"].includes(data.label)} />

const ConditionNode = ({ id, data, selected }: any) => <NodeCard id={id} icon={data.icon || Squares2X2Icon} title={data.label} subtitle={data.subtitle || "Check if..."} colorClass="bg-amber-500" selected={selected} isLastBranchNode={data.isLastBranchNode} isDragging={data.isDragging} isRoot={data.isRoot} isTargetable={data.isTargetable} />

const DelayNode = ({ id, data, selected }: any) => <NodeCard id={id} icon={data.icon || Squares2X2Icon} title={data.label} subtitle={data.subtitle || "Wait for..."} colorClass="bg-amber-500" selected={selected} isLastBranchNode={data.isLastBranchNode} isDragging={data.isDragging} isRoot={data.isRoot} isTargetable={data.isTargetable} />

const EndNode = ({ data, selected }: any) => (
  <div className="w-[256px] flex flex-col items-center">
    <div className={`w-6 h-6 rounded-full bg-slate-200 border-2 flex items-center justify-center mb-1 ${selected ? "border-slate-400 ring-2 ring-slate-200" : "border-slate-300"}`}>
      <div className="w-2 h-2 rounded-full bg-slate-400" />
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-slate-300 !border-2 !border-white transition-colors opacity-0" />
    </div>
    <span className="text-[10px] font-medium text-slate-500">{data?.label || "End"}</span>
  </div>
)

const LoopBackNode = ({ id, data, selected }: any) => {
  const { getEdges, getNodes } = useReactFlow()
  const edges = getEdges()
  const nodes = getNodes()
  const currentEdge = edges.find((e) => e.source === id && e.data?.isLoopBack)
  const targetNode = currentEdge ? nodes.find((n) => n.id === currentEdge.target) : null
  const targetLabel = targetNode?.data?.label

  return (
    <div className={`w-[256px] bg-white dark:bg-slate-900 rounded-lg shadow-sm border-2 transition-all duration-200 group relative ${selected ? "border-primary ring-2 ring-primary/20" : data.isConnecting ? "border-amber-500 ring-2 ring-amber-500/20" : "border-slate-200 hover:border-primary/50 dark:border-slate-700"}`}>
      <div className="h-1.5 w-full rounded-t-sm bg-amber-500" />
      <div className="p-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0 text-amber-500">
            <ArrowPathIcon className={`w-5 h-5 ${data.isConnecting ? "animate-spin" : ""}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{data.label}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentEdge ? `Loops back to: ${targetLabel || "Unknown Step"}` : "Select a step to loop back to..."}</p>
          </div>
          {currentEdge && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mr-2 text-slate-500 dark:text-slate-400 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation()
                data.onClearConnection?.(id)
              }}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white transition-colors hover:!bg-primary" />
      <Handle
        type="source"
        position={Position.Right}
        id="loop-source"
        className="!w-3 !h-3 !bg-amber-400 !border-2 !border-white transition-colors hover:!bg-amber-500"
      />
    </div>
  )
}

export const flowNodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
  end: EndNode,
  loopBack: LoopBackNode,
  placeholder: PlaceholderNode,
  addStep: AddStepNode,
}
