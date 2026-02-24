import { memo, useCallback, useEffect, useMemo, useState } from "react"
import ReactFlow, { Background, BaseEdge, EdgeLabelRenderer, MarkerType, Panel, Position, ReactFlowInstance, applyEdgeChanges, applyNodeChanges, addEdge, getSmoothStepPath, Handle, useReactFlow } from "reactflow"
import type { Edge, EdgeChange, EdgeProps, Node, NodeChange } from "reactflow"
import "reactflow/dist/style.css"
import { ArrowUturnLeftIcon, ArrowUturnRightIcon, ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon, DocumentDuplicateIcon, EllipsisVerticalIcon, MagnifyingGlassIcon, PlusIcon, Squares2X2Icon, TrashIcon } from "@heroicons/react/24/outline"
import { ExclamationCircleIcon } from "@heroicons/react/24/solid"
import { Card } from "@/components/Card"
import { Input } from "@/components/input"
import { Button } from "@/components/Button"
import { ScrollArea } from "@/components/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/tooltip"
import { AutomationConfigModal } from "../AutomationConfigModal/AutomationConfigModal"
import { JsonViewerPanel } from "../JsonViewerPanel"
import { PRO_TIPS, TOOLBOX_ITEMS, initialEdges, initialNodes } from "../../data/toolbox"
import { useFlowHistory } from "../../hooks/useFlowHistory"
import { performAutoLayout, restoreNodeIcons, ensureBranchAdders } from "../../utils/layout"
import { deleteNodeAndDescendants } from "../../utils/nodeActions"

// Small icon adapters (so we can keep existing `size` usage patterns)
const IconMinus = ({ className }: { className?: string }) => <div className={className ? `${className} bg-current` : "h-0.5 w-4 bg-current"} />

const AddStepNode = ({ data }: any) => {
  if (data?.isBranchAdder) return null
  const isDragging = !!data?.isDragging
  return (
    <div className="w-[280px] flex flex-col items-center justify-center relative">
      <div className={`w-10 h-10 rounded-full bg-slate-50 border-2 border-dashed flex items-center justify-center transition-colors cursor-pointer group ${isDragging ? "border-primary text-primary" : "border-slate-300 hover:border-primary hover:text-primary"}`}>
        <PlusIcon className={`w-5 h-5 ${isDragging ? "text-primary" : "text-slate-400"} group-hover:text-primary`} />
      </div>
      <span className="text-[10px] font-medium text-slate-400 mt-2 text-center w-32">Drag your next Action or Logic</span>
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-slate-300 !border-2 !border-white transition-colors opacity-0 !mt-[1.5px]" />
    </div>
  )
}

const PlaceholderNode = () => (
  <div className="w-[280px] border-b-2 border-l-2 border-r-2 border-dashed border-slate-300 rounded-lg bg-slate-50/50 flex flex-col">
    <div className="h-1.5 w-full rounded-t-sm bg-slate-300" />
    <div className="flex items-center p-4">
      <div className="p-2 rounded-md bg-white border border-dashed border-slate-300 shadow-sm shrink-0 text-slate-400 mr-3">
        <Squares2X2Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-slate-400 truncate">Start your automation</h3>
        <p className="text-xs text-slate-400">Drag a Trigger, Action or Logic Here to Begin...</p>
      </div>
    </div>
  </div>
)

const NodeCard = ({ id, icon: Icon, title, subtitle, colorClass, selected, isLastBranchNode, isDragging, isRoot, isTargetable, hideSourceHandle }: any) => {
  const { deleteElements, getEdges } = useReactFlow()

  return (
    <div className="relative w-[280px]">
      <div className={`w-full bg-white rounded-lg shadow-sm border-2 transition-all duration-200 group relative z-10 ${selected ? "border-primary ring-2 ring-primary/20" : isTargetable ? "border-green-500 ring-2 ring-green-500/20 cursor-crosshair animate-pulse" : "border-slate-200 hover:border-primary/50 dark:border-slate-700"}`}>
        <div className={`h-1.5 w-full rounded-t-sm ${colorClass}`} />
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-md bg-white border shadow-sm shrink-0 ${String(colorClass).replace("bg-", "text-")}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{subtitle}</p>
            </div>
            {!isTargetable && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-slate-500 dark:text-slate-400 transition-opacity">
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    <DocumentDuplicateIcon className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                    <Squares2X2Icon className="mr-2 h-4 w-4" />
                    Move
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNodeAndDescendants(id, deleteElements, getEdges)
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
      </div>

      {isLastBranchNode && !isTargetable && !hideSourceHandle && (
        <>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-slate-300 border-2 border-white rounded-full z-20" />
          <div className="absolute left-[280px] top-1/2 -translate-y-1/2 w-[50px] h-[2px] bg-slate-300 pointer-events-none flex items-center z-0">
            <div className="absolute right-0 top-1/2 -translate-y-[calc(50%+0.5px)] translate-x-[1px] w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-slate-300" />
          </div>
          <Handle type="source" position={Position.Right} id="right-source" className={`!w-auto !h-auto !bg-transparent !border-none !rounded-none !left-[330px] !right-auto !top-1/2 !-translate-y-1/2 !transform-none !mt-3 !flex !flex-col !items-center !justify-center !gap-2 group/adder !opacity-100 !pointer-events-auto`}>
            <div className={`w-10 h-10 rounded-full bg-white border-2 border-dashed flex items-center justify-center transition-colors shadow-sm ${isDragging ? "border-primary text-primary" : "border-slate-300 text-slate-400 group-hover/adder:border-primary group-hover/adder:text-primary"}`}>
              <PlusIcon className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-medium whitespace-nowrap transition-colors ${isDragging ? "text-primary" : "text-slate-400 group-hover/adder:text-primary"}`}>Add Branch</span>
          </Handle>
        </>
      )}

      {!isLastBranchNode && !isTargetable && <Handle type="source" position={Position.Right} id="right-source" className="!opacity-0 !pointer-events-none" />}
    </div>
  )
}

const TriggerNode = ({ id, data, selected }: any) => {
  const { deleteElements } = useReactFlow()
  return (
    <div className={`w-[280px] bg-white rounded-lg shadow-sm border-2 transition-all duration-200 group ${selected ? "border-primary ring-2 ring-primary/20" : data.isTargetable ? "border-green-500 ring-2 ring-green-500/20 cursor-crosshair animate-pulse" : "border-slate-200 hover:border-primary/50 dark:border-slate-700"}`}>
      <div className="h-1.5 w-full rounded-t-sm bg-blue-500" />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-md bg-white border shadow-sm shrink-0 text-blue-500">{data.icon ? <data.icon className="w-5 h-5" /> : <Squares2X2Icon className="w-5 h-5" />}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{data.label}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{data.subtitle || "When this happens..."}</p>
          </div>
          {!data.isTargetable && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-slate-500 dark:text-slate-400 transition-opacity">
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <DocumentDuplicateIcon className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <Squares2X2Icon className="mr-2 h-4 w-4" />
                  Move
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteElements({ nodes: [{ id }] })
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
  <div className="w-[280px] flex flex-col items-center">
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
    <div className={`w-[280px] bg-white rounded-lg shadow-sm border-2 transition-all duration-200 group relative ${selected ? "border-primary ring-2 ring-primary/20" : data.isConnecting ? "border-amber-500 ring-2 ring-amber-500/20" : "border-slate-200 hover:border-primary/50 dark:border-slate-700"}`}>
      <div className="h-1.5 w-full rounded-t-sm bg-amber-500" />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-md bg-white border shadow-sm shrink-0 text-amber-500">
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
      <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white opacity-0 pointer-events-none" />
    </div>
  )
}

const CustomEdge = memo(({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, data, label }: EdgeProps) => {
  const [edgePath, , labelY] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetPosition, targetX, targetY })
  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {data?.isSplitTest && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${targetX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            <div className="bg-white rounded-full border border-slate-200 shadow-sm px-3 py-1 flex items-center justify-center min-w-[40px]">
              <span className="text-[10px] font-semibold text-slate-500">{(label as string) || "50%"}</span>
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
})
CustomEdge.displayName = "CustomEdge"

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
  delay: DelayNode,
  end: EndNode,
  loopBack: LoopBackNode,
  placeholder: PlaceholderNode,
  addStep: AddStepNode,
}

const edgeTypes = { custom: CustomEdge }

function CustomControls({ canUndo, canRedo, onUndo, onRedo }: { canUndo: boolean; canRedo: boolean; onUndo: () => void; onRedo: () => void }) {
  const { zoomIn, zoomOut, fitView } = useReactFlow()
  return (
    <Panel position="bottom-left" className="flex gap-2 items-end">
      <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => zoomIn()} title="Zoom In">
          <PlusIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => zoomOut()} title="Zoom Out">
          <IconMinus className="h-0.5 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => fitView()} title="Fit View">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
          </svg>
        </Button>
      </div>
      <div className="bg-white p-1 rounded-lg border border-slate-200 shadow-sm flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onUndo} disabled={!canUndo} title="Undo">
          <ArrowUturnLeftIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRedo} disabled={!canRedo} title="Redo">
          <ArrowUturnRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </Panel>
  )
}

export function FlowBuilder({ automationId }: { automationId: string }) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  const { past, future, takeSnapshot, undo, redo } = useFlowHistory()

  const [searchQuery, setSearchQuery] = useState("")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [showProTips, setShowProTips] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null)

  const [selectedNodeForConfig, setSelectedNodeForConfig] = useState<Node | null>(null)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)

  const { project } = useReactFlow()

  useEffect(() => {
    // Until persistence is wired, switching files resets the canvas.
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [automationId])

  useEffect(() => {
    if (nodes.length === 0) {
      setNodes(initialNodes)
      setEdges(initialEdges)
      return
    }
    const hasContentNodes = nodes.some((n) => ["trigger", "action", "condition", "delay", "end", "loopBack", "placeholder"].includes(n.type || ""))
    if (!hasContentNodes) {
      setNodes(initialNodes)
      setEdges(initialEdges)
    }
  }, [nodes])

  const onUndo = useCallback(() => {
    const previousState = undo(nodes, edges)
    if (!previousState) return
    const restoredNodes = JSON.parse(JSON.stringify(previousState.nodes))
    const restoredEdges = JSON.parse(JSON.stringify(previousState.edges))
    restoreNodeIcons(restoredNodes, TOOLBOX_ITEMS)
    ensureBranchAdders(restoredNodes, restoredEdges)
    setNodes(restoredNodes)
    setEdges(restoredEdges)
  }, [undo, nodes, edges])

  const onRedo = useCallback(() => {
    const nextState = redo(nodes, edges)
    if (!nextState) return
    const restoredNodes = JSON.parse(JSON.stringify(nextState.nodes))
    const restoredEdges = JSON.parse(JSON.stringify(nextState.edges))
    restoreNodeIcons(restoredNodes, TOOLBOX_ITEMS)
    ensureBranchAdders(restoredNodes, restoredEdges)
    setNodes(restoredNodes)
    setEdges(restoredEdges)
  }, [redo, nodes, edges])

  const onStartConnect = useCallback((nodeId: string) => {
    setConnectingNodeId(nodeId)
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) return { ...n, data: { ...n.data, isConnecting: true } }
        if (n.type !== "placeholder" && n.type !== "addStep" && n.type !== "loopBack" && !n.data?.isBranchAdder) {
          return { ...n, data: { ...n.data, isTargetable: true } }
        }
        return n
      }),
    )
  }, [])

  const onClearConnection = useCallback(
    (nodeId: string) => {
      setEdges((eds) => eds.filter((e) => !(e.source === nodeId && e.data?.isLoopBack)))
      onStartConnect(nodeId)
    },
    [onStartConnect],
  )

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (connectingNodeId && node.data?.isTargetable) {
        const newEdge: Edge = {
          id: `e-${connectingNodeId}-${node.id}-loopback`,
          source: connectingNodeId,
          target: node.id,
          type: "custom",
          animated: true,
          style: { stroke: "#22c55e", strokeWidth: 2, strokeDasharray: "5,5" },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#22c55e" },
          data: { isLoopBack: true },
        }
        setEdges((eds) => [...eds, newEdge])
        setConnectingNodeId(null)
        setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, isConnecting: false, isTargetable: false } })))
        return
      }

      if (node.type !== "placeholder" && node.type !== "addStep" && node.data?.label !== "End Automation") {
        if (!node.data.icon) {
          for (const group of TOOLBOX_ITEMS) {
            const found = group.items.find((i) => i.label === node.data.label)
            if (found) {
              node.data.icon = found.icon
              break
            }
          }
        }
        setSelectedNodeForConfig(node)
        setIsConfigModalOpen(true)
      }
    },
    [connectingNodeId],
  )

  const onSaveConfig = useCallback(
    (nodeId: string, newData: any) => {
      takeSnapshot(nodes, edges)
      setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n)))

      if (newData.label === "Split Test (A/B)" && newData.weights) {
        setEdges((eds) => {
          const siblings = eds.filter((ed) => ed.source === nodeId && ed.sourceHandle !== "right-source").slice()
          siblings.sort((a, b) => a.id.localeCompare(b.id))
          return eds.map((e) => {
            if (e.source !== nodeId || e.sourceHandle === "right-source") return e
            const idx = siblings.findIndex((s) => s.id === e.id)
            if (idx !== -1 && newData.weights[idx] !== undefined) {
              return { ...e, label: `${newData.weights[idx]}%`, data: { ...(e.data || {}), isSplitTest: true } }
            }
            return e
          })
        })
      }
    },
    [takeSnapshot, nodes, edges],
  )

  const nodesWithData = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isDragging,
          onStartConnect,
          onClearConnection,
        },
      })),
    [nodes, isDragging, onStartConnect, onClearConnection],
  )

  const edgesWithData = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        type: "custom",
        data: { ...edge.data, isDragging },
      })),
    [edges, isDragging],
  )

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const significant = changes.filter((c) => c.type !== "select" && c.type !== "dimensions")
      if (significant.length > 0) takeSnapshot(nodes, edges)
      setNodes((currentNodes) => {
        const updated = applyNodeChanges(changes, currentNodes)
        if (changes.some((c) => c.type === "remove")) return performAutoLayout(updated, edges)
        return updated
      })
    },
    [takeSnapshot, nodes, edges],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const significant = changes.filter((c) => c.type !== "select")
      if (significant.length > 0) takeSnapshot(nodes, edges)
      setEdges((eds) => applyEdgeChanges(changes, eds))
    },
    [takeSnapshot, nodes, edges],
  )

  const onConnect = useCallback(
    (connection: any) => {
      takeSnapshot(nodes, edges)
      setEdges((eds) => addEdge({ ...connection, type: "custom" }, eds))
    },
    [takeSnapshot, nodes, edges],
  )

  const onDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(true)
  }, [])

  const onDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    const relatedTarget = event.relatedTarget as HTMLElement | null
    if (event.currentTarget.contains(relatedTarget)) return
    setIsDragging(false)
  }, [])

  const onDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      event.dataTransfer.dropEffect = "move"
      if (!isDragging) setIsDragging(true)
    },
    [isDragging],
  )

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      setIsDragging(false)

      let type = event.dataTransfer.getData("application/reactflow/type")
      let label = event.dataTransfer.getData("application/reactflow/label")
      if (!type) {
        try {
          const raw = event.dataTransfer.getData("text/plain")
          if (raw) {
            const parsed = JSON.parse(raw)
            type = parsed.type
            label = parsed.label
          }
        } catch {
          // ignore
        }
      }
      if (!type) return

      takeSnapshot(nodes, edges)

      let position = { x: 0, y: 0 }
      const reactFlowBounds = document.querySelector(".react-flow")?.getBoundingClientRect()
      if (reactFlowBounds) {
        position = project({ x: event.clientX - reactFlowBounds.left, y: event.clientY - reactFlowBounds.top })
      }

      const newNode: Node = {
        id: `${type}-${nodes.length + 1}-${Date.now()}`,
        type,
        position,
        data: { label },
        width: 280,
      }

      let foundItem: any
      for (const group of TOOLBOX_ITEMS) {
        foundItem = group.items.find((i) => i.label === label)
        if (foundItem) break
      }
      if (foundItem) {
        newNode.data = {
          label: foundItem.label,
          icon: foundItem.icon,
          subtitle: foundItem.label === "Birthday" ? "Triggers on contact's birthday" : foundItem.label === "Notes" ? "Note Added" : type === "trigger" ? "When this happens..." : type === "condition" ? "Check if..." : type === "delay" ? "Wait for..." : "Perform action",
        }
      }

      const placeholderNode = nodes.find((n) => n.type === "placeholder")
      const isFirstNode = nodes.length === 1 && placeholderNode
      const isTerminal = type === "loopBack" || label === "End Automation" || label === "Send To Automation"

      if (isFirstNode && placeholderNode) {
        newNode.position = { ...placeholderNode.position }

        const isBranching = ["If / Else", "Split Test (A/B)", "Switch Case", "Parallel"].includes(foundItem?.label || label)
        if (isBranching) {
          const branchY = newNode.position.y + 150
          const startX = newNode.position.x + 140 - (280 * 2 + 60) / 2
          const addStepA: Node = { id: `add-step-${Date.now()}-A`, type: "addStep", position: { x: startX, y: branchY }, data: { label: "Add Step" }, draggable: false, width: 280, height: 100 }
          const addStepB: Node = { id: `add-step-${Date.now()}-B`, type: "addStep", position: { x: startX + 280 + 60, y: branchY }, data: { label: "Add Step", isLastBranchNode: true }, draggable: false, width: 280, height: 100 }
          const addBranchNode: Node = { id: `add-branch-${Date.now()}`, type: "addStep", position: { x: addStepB.position.x + 300, y: branchY + 20 }, data: { label: "Add Branch", isBranchAdder: true, siblingId: addStepB.id }, draggable: false, width: 60, height: 60 }

          const isSplitTest = (foundItem?.label || label) === "Split Test (A/B)"
          const newEdges: Edge[] = [
            { id: `e-${newNode.id}-${addStepA.id}`, source: newNode.id, target: addStepA.id, type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed }, label: isSplitTest ? "50%" : undefined, data: isSplitTest ? { isSplitTest: true } : undefined },
            { id: `e-${newNode.id}-${addStepB.id}`, source: newNode.id, target: addStepB.id, type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed }, label: isSplitTest ? "50%" : undefined, data: isSplitTest ? { isSplitTest: true } : undefined },
            { id: `e-${addStepB.id}-${addBranchNode.id}`, source: addStepB.id, sourceHandle: "right-source", target: addBranchNode.id, type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeDasharray: "5,5", opacity: 0.5 } },
          ]
          const layouted = performAutoLayout([newNode, addStepA, addStepB, addBranchNode], newEdges)
          setNodes(layouted)
          setEdges(newEdges)
          return
        }

        if (!isTerminal) {
          const addStepNode: Node = { id: `add-step-${Date.now()}`, type: "addStep", position: { x: newNode.position.x, y: newNode.position.y + 150 }, data: { label: "Add Step" }, draggable: false, width: 280, height: 100 }
          const newEdge: Edge = { id: `e-${newNode.id}-${addStepNode.id}`, source: newNode.id, target: addStepNode.id, type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed } }
          const layouted = performAutoLayout([newNode, addStepNode], [newEdge])
          setNodes(layouted)
          setEdges([newEdge])
        } else {
          setNodes([newNode])
          setEdges([])
        }
        return
      }

      if (type === "trigger") {
        // Triggers should never overlap. If we already have a flow started,
        // new triggers should connect to the same first downstream step.

        const flowEdges = edges.filter((e) => e.sourceHandle !== "right-source" && !e.data?.isLoopBack)
        const cleanNodes = nodes.filter((n) => n.type !== "placeholder")
        const existingTriggers = cleanNodes.filter((n) => n.type === "trigger")

        // Default placement: top row
        newNode.position.y = 50
        newNode.position.x = 425

        if (existingTriggers.length > 0) {
          const maxX = Math.max(...existingTriggers.map((n) => n.position.x || 0))
          newNode.position.x = maxX + 340 // 280 width + 60 gap
        }

        // Find a template downstream target by looking at any connected trigger.
        let templateTargetId: string | null = null
        for (const trig of existingTriggers) {
          const out = flowEdges.find((e) => e.source === trig.id)
          if (out) {
            templateTargetId = out.target
            break
          }
        }

        let nextEdges = edges.slice()

        if (templateTargetId) {
          // Connect this trigger into the same flow.
          nextEdges = nextEdges.concat({
            id: `e-${newNode.id}-${templateTargetId}`,
            source: newNode.id,
            target: templateTargetId,
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
          })
        } else {
          // If there is an existing graph (actions/logic) but no trigger edges yet,
          // connect this trigger to all non-trigger roots.
          const nonTriggerNodes = cleanNodes.filter((n) => n.type !== "trigger")
          if (nonTriggerNodes.length > 0) {
            const targetIds = new Set(flowEdges.map((e) => e.target))
            let roots = nonTriggerNodes.filter((n) => !targetIds.has(n.id))
            if (roots.length === 0) {
              // Fall back to the visually top-most node.
              const topMost = nonTriggerNodes.reduce((best, n) => (n.position.y < best.position.y ? n : best), nonTriggerNodes[0])
              roots = [topMost]
            }

            nextEdges = nextEdges.concat(
              roots.map((r) => ({
                id: `e-${newNode.id}-${r.id}`,
                source: newNode.id,
                target: r.id,
                type: "smoothstep",
                markerEnd: { type: MarkerType.ArrowClosed },
              })),
            )
          }
        }

        const nextNodes = cleanNodes.concat(newNode)
        const layouted = performAutoLayout(nextNodes, nextEdges)
        setNodes(layouted)
        setEdges(nextEdges)
        return
      }

      const distance = (ax: number, ay: number, bx: number, by: number) => Math.hypot(ax - bx, ay - by)

      // Identify closest drop target: an AddStep slot or a branch "+" button on the last branch card.
      let closestAddStepNode: any = null
      let closestAddStepDist = Infinity
      let nearestAddStepNode: any = null
      let nearestAddStepDist = Infinity
      let addBranchDropOnNode: any = null
      let addBranchDropDist = Infinity

      nodes.forEach((n) => {
        if (n.type === "addStep") {
          const isBranchAdder = !!n.data?.isBranchAdder
          const width = isBranchAdder ? 60 : 280
          const height = isBranchAdder ? 60 : 100
          const cx = n.position.x + width / 2
          const cy = n.position.y + height / 2
          const d = distance(cx, cy, position.x, position.y)

          // Track nearest addStep target (even if not within the strict hit radius)
          if (!isBranchAdder && d < nearestAddStepDist) {
            nearestAddStepDist = d
            nearestAddStepNode = n
          }

          if (d < 80 && d < closestAddStepDist) {
            closestAddStepDist = d
            closestAddStepNode = n
          }
        }

        if (n.data?.isLastBranchNode) {
          const bx = n.position.x + 350
          const by = n.position.y + 50
          const d = distance(bx, by, position.x, position.y)
          if (d < 60 && d < addBranchDropDist) {
            addBranchDropDist = d
            addBranchDropOnNode = n
          }
        }
      })

      // If user drops near-ish the flow but not directly on the slot, still snap to nearest add-step.
      if (!closestAddStepNode && nearestAddStepNode && nearestAddStepDist < 220) {
        closestAddStepNode = nearestAddStepNode
      }

      const isAddBranchDrop = !!addBranchDropOnNode || !!closestAddStepNode?.data?.isBranchAdder

      if (isAddBranchDrop) {
        // Determine the sibling node that currently owns the branch adder.
        const referenceNode = addBranchDropOnNode || closestAddStepNode
        if (!referenceNode) return

        let siblingNode: any
        if (addBranchDropOnNode) {
          siblingNode = addBranchDropOnNode
        } else {
          // Dropped on the (invisible) branch-adder node.
          siblingNode = nodes.find((n) => n.id === referenceNode.data?.siblingId)
        }
        if (!siblingNode) return

        // Place the new branch node roughly to the right of the current last branch,
        // so ordering and layout are stable even before auto-layout runs.
        newNode.position = {
          x: (siblingNode.position?.x || 0) + 340,
          y: siblingNode.position?.y || 0,
        }

        // Find the branching parent via incoming edge.
        const parentEdge = edges.find((e) => e.target === siblingNode!.id && e.sourceHandle !== "right-source" && !e.data?.isLoopBack)
        if (!parentEdge) return
        const parentId = parentEdge.source
        const parentNode = nodes.find((n) => n.id === parentId)
        if (!parentNode) return

        const isSplitTestParent = parentNode.data?.label === "Split Test (A/B)"

        // Collect existing branch children.
        const childEdges = edges.filter((e) => e.source === parentId && e.sourceHandle !== "right-source" && !e.data?.isLoopBack)
        const childIds = childEdges.map((e) => e.target)
        const branchChildren = nodes.filter((n) => childIds.includes(n.id) && !n.data?.isBranchAdder)

        // Remove existing branch adder nodes connected to any child in this group.
        const adderEdges = edges.filter((e) => branchChildren.some((c) => c.id === e.source) && nodes.find((n) => n.id === e.target)?.data?.isBranchAdder)
        const adderIds = adderEdges.map((e) => e.target)

        let nextNodes = nodes.filter((n) => !adderIds.includes(n.id))
        let nextEdges = edges.filter((e) => !adderIds.includes(e.target) && !adderIds.includes(e.source))

        // Create new branch node.
        newNode.data = { ...newNode.data, isBranchChild: true }
        nextNodes = nextNodes.concat(newNode)
        nextEdges = nextEdges.concat({
          id: `e-${parentId}-${newNode.id}`,
          source: parentId,
          target: newNode.id,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
          label: isSplitTestParent ? "" : undefined,
          data: isSplitTestParent ? { isSplitTest: true } : undefined,
        } as any)

        // Update last-branch flags.
        const updatedChildren = [...branchChildren, newNode].sort((a, b) => (a.position.x || 0) - (b.position.x || 0))
        updatedChildren.forEach((c) => {
          if (!c.data) c.data = {}
          c.data.isLastBranchNode = false
        })
        const lastChild = updatedChildren[updatedChildren.length - 1]
        if (lastChild.data) lastChild.data.isLastBranchNode = true

        // Recreate branch adder connected to the new last child.
        const addBranchNode: Node = {
          id: `add-branch-${Date.now()}`,
          type: "addStep",
          position: { x: (lastChild.position.x || 0) + 300, y: (lastChild.position.y || 0) + 20 },
          data: { label: "Add Branch", isBranchAdder: true, siblingId: lastChild.id },
          draggable: false,
          width: 60,
          height: 60,
        }

        nextNodes = nextNodes.concat(addBranchNode)
        nextEdges = nextEdges.concat({
          id: `e-${lastChild.id}-${addBranchNode.id}`,
          source: lastChild.id,
          sourceHandle: "right-source",
          target: addBranchNode.id,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { strokeDasharray: "5,5", opacity: 0.5 },
        })

        // Split-test: normalize edge labels to equal weights.
        if (isSplitTestParent) {
          const count = updatedChildren.length
          const pct = `${Math.floor(100 / count)}%`
          nextEdges = nextEdges.map((e) => {
            if (e.source === parentId && e.sourceHandle !== "right-source") {
              return { ...e, label: pct, data: { ...(e.data || {}), isSplitTest: true } }
            }
            return e
          })
        }

        // Ensure new branch has an add-step below if it’s not terminal.
        if (!isTerminal) {
          const addStepNode: Node = {
            id: `add-step-${Date.now()}-local`,
            type: "addStep",
            position: { x: newNode.position.x, y: newNode.position.y + 150 },
            data: { label: "Add Step" },
            draggable: false,
            width: 280,
            height: 100,
          }
          nextNodes = nextNodes.concat(addStepNode)
          nextEdges = nextEdges.concat({
            id: `e-${newNode.id}-${addStepNode.id}`,
            source: newNode.id,
            target: addStepNode.id,
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed },
          })
        }

        const layouted = performAutoLayout(nextNodes, nextEdges)
        setNodes(layouted)
        setEdges(nextEdges)
        return
      }

      if (!closestAddStepNode) return

      newNode.position = { x: closestAddStepNode.position.x - 76, y: closestAddStepNode.position.y }

      let updatedEdges = edges.filter((e) => e.target !== closestAddStepNode!.id && e.source !== closestAddStepNode!.id)
      const incoming = edges.filter((e) => e.target === closestAddStepNode!.id)
      incoming.forEach((e) => updatedEdges.push({ ...e, target: newNode.id }))

      const newNodes = nodes.filter((n) => n.id !== closestAddStepNode!.id).concat(newNode)

      if (!isTerminal) {
        const addStepNode: Node = { id: `add-step-${Date.now()}`, type: "addStep", position: { x: newNode.position.x, y: newNode.position.y + 150 }, data: { label: "Add Step" }, draggable: false, width: 280, height: 100 }
        newNodes.push(addStepNode)
        updatedEdges.push({ id: `e-${newNode.id}-${addStepNode.id}`, source: newNode.id, target: addStepNode.id, type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed } })
      }

      const layouted = performAutoLayout(newNodes, updatedEdges)
      setNodes(layouted)
      setEdges(updatedEdges)
    },
    [edges, nodes, project, takeSnapshot],
  )

  const onInit = useCallback((instance: ReactFlowInstance) => {
    instance.fitView({ maxZoom: 0.8 })
    const { x, zoom } = instance.getViewport()
    const desiredScreenY = 80
    const nodeY = 100
    const y = desiredScreenY - nodeY * zoom
    instance.setViewport({ x, y, zoom })
  }, [])

  const nextTip = () => setCurrentTipIndex((p) => (p + 1) % PRO_TIPS.length)
  const prevTip = () => setCurrentTipIndex((p) => (p - 1 + PRO_TIPS.length) % PRO_TIPS.length)

  return (
    <div className="flex h-full w-full bg-slate-50 relative">
      <AutomationConfigModal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} node={selectedNodeForConfig} onSave={onSaveConfig} edges={edges} />
      <JsonViewerPanel automationId={automationId} nodes={nodes} edges={edges} />

      <div className="flex-1 h-full relative" onDragEnter={onDragEnter} onDragLeave={onDragLeave}>
        <ReactFlow nodes={nodesWithData} edges={edgesWithData} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onNodeClick={onNodeClick} onDragOver={onDragOver} onDrop={onDrop} onInit={onInit} nodeTypes={nodeTypes} edgeTypes={edgeTypes} nodesDraggable={false} nodesConnectable={false} elementsSelectable defaultEdgeOptions={{ type: "custom", markerEnd: { type: MarkerType.ArrowClosed } }} proOptions={{ hideAttribution: true }} className="bg-slate-50">
          <Background color="#94a3b8" gap={20} size={1} />
          <CustomControls canUndo={past.length > 0} canRedo={future.length > 0} onUndo={onUndo} onRedo={onRedo} />
        </ReactFlow>

        {showProTips && (
          <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-end pointer-events-none">
            <Card className="p-3 bg-blue-50 border-blue-100 shadow-lg pointer-events-auto max-w-2xl w-full mr-4">
              <div className="flex gap-3 items-center">
                <ExclamationCircleIcon className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="flex-1 text-xs text-blue-900 flex items-center gap-2">
                  <span className="font-semibold">Pro Tip:</span>
                  <span className="text-blue-700">{PRO_TIPS[currentTipIndex]}</span>
                </div>
                <div className="flex items-center gap-1 border-l border-blue-200 pl-2">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-500 hover:text-blue-700 hover:bg-blue-100" onClick={prevTip}>
                    <ChevronLeftIcon className="h-3 w-3" />
                  </Button>
                  <span className="text-[10px] text-blue-500 font-medium w-8 text-center">
                    {currentTipIndex + 1} / {PRO_TIPS.length}
                  </span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-500 hover:text-blue-700 hover:bg-blue-100" onClick={nextTip}>
                    <ChevronRightIcon className="h-3 w-3" />
                  </Button>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-500 hover:text-blue-700 hover:bg-blue-100 ml-1" onClick={() => setShowProTips(false)}>
                  <span className="sr-only">Dismiss</span>
                  <span className="text-lg leading-none">×</span>
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className={`bg-white border-l h-full flex flex-col shadow-xl z-20 transition-all duration-300 ${isSidebarCollapsed ? "w-16" : "w-80"}`}>
        <Tabs defaultValue="triggers" className="flex flex-col h-full">
          {!isSidebarCollapsed && (
            <div className="px-4 py-3 border-b bg-white space-y-3">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 shrink-0" onClick={() => setIsSidebarCollapsed(true)}>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input placeholder="Search..." className="pl-9 bg-slate-50" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
              </div>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="triggers">Triggers</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="logic">Logic</TabsTrigger>
              </TabsList>
            </div>
          )}

          {isSidebarCollapsed && (
            <div className="flex flex-col items-center py-2 space-y-2 border-b">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600" onClick={() => setIsSidebarCollapsed(false)}>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsList className="flex flex-col h-auto bg-transparent gap-2 p-0">
                      <TabsTrigger value="triggers" className="w-10 h-10 p-0 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">
                        <Squares2X2Icon className="h-5 w-5" />
                      </TabsTrigger>
                    </TabsList>
                  </TooltipTrigger>
                  <TooltipContent side="left">Triggers</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsList className="flex flex-col h-auto bg-transparent gap-2 p-0">
                      <TabsTrigger value="actions" className="w-10 h-10 p-0 data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-600">
                        <Squares2X2Icon className="h-5 w-5" />
                      </TabsTrigger>
                    </TabsList>
                  </TooltipTrigger>
                  <TooltipContent side="left">Actions</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsList className="flex flex-col h-auto bg-transparent gap-2 p-0">
                      <TabsTrigger value="logic" className="w-10 h-10 p-0 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-600">
                        <Squares2X2Icon className="h-5 w-5" />
                      </TabsTrigger>
                    </TabsList>
                  </TooltipTrigger>
                  <TooltipContent side="left">Logic</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          <div className="flex-1 overflow-hidden bg-slate-50/50">
            <ScrollArea className="h-full">
              {TOOLBOX_ITEMS.map((section) => {
                const filtered = section.items.filter((item) => (isSidebarCollapsed ? true : item.label.toLowerCase().includes(searchQuery.toLowerCase())))
                const available = filtered.filter((i) => !i.comingSoon)
                const comingSoon = filtered.filter((i) => i.comingSoon)
                return (
                  <TabsContent key={section.value} value={section.value} className="m-0 h-full p-2 space-y-2 mt-0">
                    {available.map((item, idx) => (
                      <div
                        key={`avail-${idx}`}
                        draggable
                        className={`flex items-center gap-2 p-1.5 rounded-md border border-transparent hover:border-slate-200 hover:bg-slate-50 cursor-grab active:cursor-grabbing transition-all group ${isSidebarCollapsed ? "justify-center" : ""}`}
                        onDragStart={(event) => {
                          event.dataTransfer.setData("application/reactflow/type", item.type)
                          event.dataTransfer.setData("application/reactflow/label", item.label)
                          event.dataTransfer.setData("text/plain", JSON.stringify({ type: item.type, label: item.label }))
                          event.dataTransfer.effectAllowed = "move"
                        }}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className={`p-1 rounded bg-white border shadow-sm group-hover:shadow-md transition-shadow ${item.color}`} title={isSidebarCollapsed ? item.label : undefined}>
                                <item.icon className="w-4 h-4" />
                              </div>
                            </TooltipTrigger>
                            {isSidebarCollapsed && <TooltipContent side="left">{item.label}</TooltipContent>}
                          </Tooltip>
                        </TooltipProvider>
                        {!isSidebarCollapsed && (
                          <>
                            <div className="flex-1">
                              <span className="text-xs font-medium text-slate-900 dark:text-slate-100">{item.label}</span>
                            </div>
                            <EllipsisVerticalIcon className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </>
                        )}
                      </div>
                    ))}

                    {comingSoon.length > 0 && (
                      <>
                        {!isSidebarCollapsed && (
                          <div className="flex items-center gap-2 mt-6 mb-2 px-1">
                            <div className="h-px bg-slate-200 flex-1" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Coming Soon</span>
                            <div className="h-px bg-slate-200 flex-1" />
                          </div>
                        )}
                        {isSidebarCollapsed && <div className="h-px w-8 mx-auto bg-slate-200 my-2" />}
                        {comingSoon.map((item, idx) => (
                          <div key={`soon-${idx}`} draggable={false} className={`flex items-center gap-2 p-1.5 rounded-md border border-transparent opacity-75 cursor-not-allowed group select-none ${isSidebarCollapsed ? "justify-center" : ""}`}>
                            <div className="p-1 rounded bg-slate-100 border shadow-none grayscale">
                              <item.icon className="w-4 h-4 text-slate-400" />
                            </div>
                            {!isSidebarCollapsed && (
                              <div className="flex-1">
                                <span className="text-xs font-medium text-slate-400">{item.label}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </TabsContent>
                )
              })}
            </ScrollArea>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
