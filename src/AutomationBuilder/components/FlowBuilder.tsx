import { useCallback, useEffect, useMemo, useState } from "react"
import ReactFlow, { Background, MarkerType, ReactFlowInstance, applyEdgeChanges, applyNodeChanges, addEdge, useReactFlow } from "reactflow"
import type { Edge, EdgeChange, Node, NodeChange } from "reactflow"
import "reactflow/dist/style.css"
import { ProTipBanner } from "./ProTipBanner"
import { AutomationConfigModal } from "./AutomationConfigModal"
import { JsonViewerPanel } from "./JsonViewerPanel/JsonViewerPanel"
import { PRO_TIPS, TOOLBOX_ITEMS, initialEdges, initialNodes } from "../constants/toolbox"
import { useFlowHistory } from "../hooks/useFlowHistory"
import { performAutoLayout, restoreNodeIcons, ensureBranchAdders } from "../utils/layout"
import { flowNodeTypes } from "./flow/FlowBuilderNodes"
import { flowEdgeTypes } from "./flow/FlowBuilderEdge"
import { FlowBuilderControls } from "./flow/FlowBuilderControls"
import { FlowBuilderSidebar } from "./flow/FlowBuilderSidebar"

export function FlowBuilder({ automationId }: { automationId: string }) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  const { past, future, takeSnapshot, undo, redo } = useFlowHistory()

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [showProTips, setShowProTips] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null)

  const [selectedNodeForConfig, setSelectedNodeForConfig] = useState<Node | null>(null)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains("dark"))

  const { project } = useReactFlow()

  useEffect(() => {
    const root = document.documentElement
    const observer = new MutationObserver(() => {
      setIsDarkMode(root.classList.contains("dark"))
    })
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

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
        width: 256,
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
          const addStepA: Node = { id: `add-step-${Date.now()}-A`, type: "addStep", position: { x: startX, y: branchY }, data: { label: "Add Step" }, draggable: false, width: 256, height: 92 }
          const addStepB: Node = { id: `add-step-${Date.now()}-B`, type: "addStep", position: { x: startX + 256 + 56, y: branchY }, data: { label: "Add Step", isLastBranchNode: true }, draggable: false, width: 256, height: 92 }
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
          const addStepNode: Node = { id: `add-step-${Date.now()}`, type: "addStep", position: { x: newNode.position.x, y: newNode.position.y + 150 }, data: { label: "Add Step" }, draggable: false, width: 256, height: 92 }
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
            width: 256,
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
        const addStepNode: Node = { id: `add-step-${Date.now()}`, type: "addStep", position: { x: newNode.position.x, y: newNode.position.y + 150 }, data: { label: "Add Step" }, draggable: false, width: 256, height: 92 }
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
    <div className="flex h-full w-full bg-slate-50 dark:bg-slate-950 relative">
      <AutomationConfigModal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} node={selectedNodeForConfig} onSave={onSaveConfig} edges={edges} />
      <JsonViewerPanel automationId={automationId} nodes={nodes} edges={edges} />

      <div className="flex-1 h-full relative" onDragEnter={onDragEnter} onDragLeave={onDragLeave}>
        <ReactFlow nodes={nodesWithData} edges={edgesWithData} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onNodeClick={onNodeClick} onDragOver={onDragOver} onDrop={onDrop} onInit={onInit} nodeTypes={flowNodeTypes} edgeTypes={flowEdgeTypes} nodesDraggable={false} nodesConnectable={false} elementsSelectable defaultEdgeOptions={{ type: "custom", markerEnd: { type: MarkerType.ArrowClosed } }} proOptions={{ hideAttribution: true }} className="bg-slate-50 dark:bg-slate-950">
          <Background color={isDarkMode ? "#475569" : "#94a3b8"} gap={20} size={1} />
          <FlowBuilderControls canUndo={past.length > 0} canRedo={future.length > 0} onUndo={onUndo} onRedo={onRedo} />
        </ReactFlow>

        {showProTips && <ProTipBanner tip={PRO_TIPS[currentTipIndex]} currentIndex={currentTipIndex} total={PRO_TIPS.length} onPrev={prevTip} onNext={nextTip} onDismiss={() => setShowProTips(false)} />}
      </div>

      <FlowBuilderSidebar isCollapsed={isSidebarCollapsed} onCollapse={() => setIsSidebarCollapsed(true)} onExpand={() => setIsSidebarCollapsed(false)} />
    </div>
  )
}
