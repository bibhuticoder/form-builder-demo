import { useCallback, useEffect, useMemo, useState } from "react"
import ReactFlow, { Background, MarkerType, ReactFlowInstance, applyEdgeChanges, applyNodeChanges, addEdge, useReactFlow } from "reactflow"
import type { Edge, EdgeChange, Node, NodeChange } from "reactflow"
import "reactflow/dist/style.css"
import { ProTipBanner } from "./ProTipBanner"
import { AutomationConfigModal } from "./AutomationConfig/Modal"
import { JsonViewerPanel } from "./JsonViewerPanel/JsonViewerPanel"
import { PRO_TIPS, TOOLBOX_ITEMS, initialEdges, initialNodes } from "../constants"
import { useFlowHistory } from "../hooks/useFlowHistory"
import { performAutoLayout, restoreNodeIcons } from "../utils/layout"
import { selectAddStepDropTarget } from "../utils/dropTarget"
import { flowNodeTypes } from "./flow/FlowBuilderNodes"
import { flowEdgeTypes } from "./flow/FlowBuilderEdge"
import { FlowBuilderControls } from "./flow/FlowBuilderControls"
import { FlowBuilderSidebar } from "./flow/FlowBuilderSidebar"
import { useAutomationBuilderContext } from "../context/AutomationBuilderContext"
import { buildPayloadFromBuilder } from "../utils/payload"
import { NodeActionsContext } from "../context/NodeActionsContext"
import { deleteNodeAndDescendants } from "../utils/nodeActions"
import { generateEdgeId } from "../utils/hash"

const ACTION_SWAP_EXCLUDED_LABELS = new Set(["End Automation", "Send To Automation"])

function isSwappableAction(node?: Node) {
  if (!node) return false
  if (node.type !== "action") return false
  const label = String(node.data?.label || "")
  if (ACTION_SWAP_EXCLUDED_LABELS.has(label)) return false
  return true
}

function swapNodeId(value: string, aId: string, bId: string) {
  if (value === aId) return bId
  if (value === bId) return aId
  return value
}

export function FlowBuilder({ automationId }: { automationId: string }) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  const { name, setName, status, setStatus, settings, setSettings, setSavedAt, setIsDirty, saveRef, loadRef } = useAutomationBuilderContext()

  const { past, future, takeSnapshot, undo, redo } = useFlowHistory()

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [showProTips, setShowProTips] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null)
  const [movingNodeId, setMovingNodeId] = useState<string | null>(null)
  const [swappingNodeIds, setSwappingNodeIds] = useState<string[] | null>(null)

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

  const handleDeleteNode = useCallback(
    (id: string) => {
      takeSnapshot(nodes, edges)
      deleteNodeAndDescendants(
        id,
        (params) => {
          const idsToDelete = new Set(params.nodes.map((n) => n.id))
          setNodes((nds) => nds.filter((n) => !idsToDelete.has(n.id)))
          setEdges((eds) => eds.filter((e) => !idsToDelete.has(e.source) && !idsToDelete.has(e.target)))
        },
        () => edges,
      )
      setIsDirty(true)
    },
    [nodes, edges, takeSnapshot, setIsDirty],
  )

  const handleDuplicateNode = useCallback(
    (id: string) => {
      const node = nodes.find((n) => n.id === id)
      if (!node) return
      takeSnapshot(nodes, edges)

      const nodesOfType = nodes.filter((n) => n.type === node.type)
      const newNodeId = `${node.type}_${node.data.nodeType || node.type}_${nodesOfType.length + 1}`
      
      const isTrigger = node.type === "trigger"
      const newNode: Node = {
        ...node,
        id: newNodeId,
        position: isTrigger 
          ? { x: node.position.x + 340, y: node.position.y } 
          : { x: node.position.x + 40, y: node.position.y + 100 },
        selected: true,
        data: {
          ...node.data,
          label: `${node.data.label} (Copy)`,
          isRoot: isTrigger,
        },
      }

      let nextEdges = [...edges]

      if (isTrigger) {
        // Mirrored connection: the new trigger connects to the same target as original
        const outgoing = edges.filter((e) => e.source === id && !e.data?.isLoopBack)
        outgoing.forEach((edge) => {
          nextEdges.push({
            ...edge,
            id: generateEdgeId(newNodeId, edge.target),
            source: newNodeId,
          })
        })
      } else {
        // Linear insertion: the new node is inserted after the original one
        const outgoingEdge = edges.find((e) => e.source === id && !e.data?.isLoopBack && !e.data?.branchId)
        if (outgoingEdge) {
          const { target, sourceHandle } = outgoingEdge
          nextEdges = edges.filter((e) => e.id !== outgoingEdge.id)
          nextEdges.push({
            id: generateEdgeId(id, newNodeId),
            source: id,
            target: newNodeId,
            sourceHandle,
            markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
          })
          nextEdges.push({
            id: generateEdgeId(newNodeId, target),
            source: newNodeId,
            target: target,
            markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
          })
        }
      }

      const nextNodes = [...nodes, newNode]
      const { nodes: lNodes, edges: lEdges } = performAutoLayout(nextNodes, nextEdges)
      setNodes(lNodes)
      setEdges(lEdges)
      setIsDirty(true)
    },
    [nodes, edges, takeSnapshot, setIsDirty],
  )

  const handleStartMove = useCallback(
    (id: string) => {
      const node = nodes.find((n) => n.id === id)
      if (!isSwappableAction(node)) return
      setMovingNodeId(id)
    },
    [nodes],
  )

  const handleSwapActions = useCallback(
    (sourceId: string, targetId: string) => {
      if (sourceId === targetId) {
        setMovingNodeId(null)
        return
      }

      const sourceNode = nodes.find((n) => n.id === sourceId)
      const targetNode = nodes.find((n) => n.id === targetId)
      if (!isSwappableAction(sourceNode) || !isSwappableAction(targetNode)) return

      takeSnapshot(nodes, edges)

      const sourcePos = sourceNode!.position
      const targetPos = targetNode!.position

      const nextEdges = edges.map((edge) => {
        const newSource = swapNodeId(edge.source, sourceId, targetId)
        const newTarget = swapNodeId(edge.target, sourceId, targetId)
        if (newSource === edge.source && newTarget === edge.target) return edge
        // Preserve the original edge id to keep IDs stable across swaps.
        return {
          ...edge,
          source: newSource,
          target: newTarget,
        }
      })

      setNodes((prev) =>
        prev.map((n) => {
          if (n.id === sourceId) return { ...n, position: targetPos }
          if (n.id === targetId) return { ...n, position: sourcePos }
          return n
        }),
      )

      // Mark nodes as swapping so they can animate, then clear after animation completes.
      setSwappingNodeIds([sourceId, targetId])

      setEdges(nextEdges)
      setMovingNodeId(null)
      setIsDirty(true)

      // Clear swapping flag after animation duration
      window.setTimeout(() => {
        setSwappingNodeIds(null)
      }, 600)
    },
    [edges, nodes, takeSnapshot, setIsDirty],
  )

  const nodeActions = useMemo(
    () => ({
      onDuplicate: handleDuplicateNode,
      onDelete: handleDeleteNode,
      onMove: handleStartMove,
    }),
    [handleDuplicateNode, handleDeleteNode, handleStartMove],
  )

  const onUndo = useCallback(() => {
    const previousState = undo(nodes, edges)
    if (!previousState) return
    const restoredNodes = JSON.parse(JSON.stringify(previousState.nodes))
    const restoredEdges = JSON.parse(JSON.stringify(previousState.edges))
    restoreNodeIcons(restoredNodes, TOOLBOX_ITEMS)
    setNodes(restoredNodes)
    setEdges(restoredEdges)
  }, [undo, nodes, edges])

  const onRedo = useCallback(() => {
    const nextState = redo(nodes, edges)
    if (!nextState) return
    const restoredNodes = JSON.parse(JSON.stringify(nextState.nodes))
    const restoredEdges = JSON.parse(JSON.stringify(nextState.edges))
    restoreNodeIcons(restoredNodes, TOOLBOX_ITEMS)
    setNodes(restoredNodes)
    setEdges(restoredEdges)
  }, [redo, nodes, edges])

  const onStartConnect = useCallback((nodeId: string) => {
    setConnectingNodeId(nodeId)
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) return { ...n, data: { ...n.data, isConnecting: true } }
        if (n.type !== "placeholder" && n.type !== "addStep" && n.type !== "loopBack") {
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
      if (movingNodeId) {
        if (node.id === movingNodeId) {
          setMovingNodeId(null)
          return
        }
        if (isSwappableAction(node)) {
          handleSwapActions(movingNodeId, node.id)
        }
        return
      }

      if (connectingNodeId && node.data?.isTargetable) {
        const newEdge: Edge = {
          id: generateEdgeId(connectingNodeId, node.id) + "-loopback",
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
    [connectingNodeId, movingNodeId, handleSwapActions],
  )

  const onSaveConfig = useCallback(
    (nodeId: string, newData: any) => {
      takeSnapshot(nodes, edges)

      // 1. Update node data with intelligent config mapping
      const nextNodes = nodes.map((n) => {
        if (n.id === nodeId) {
          const { label, subtitle, icon, iconName, color, config, ...formData } = newData;

          return {
            ...n,
            data: {
              ...n.data,
              ...formData, // Flatten into root data
              label: label || n.data.label,
              subtitle: subtitle || n.data.subtitle,
              icon: icon || n.data.icon,
              iconName: iconName || n.data.iconName,
              color: color || n.data.color,
              // Move form fields into 'config' sub-object for JSON viewers/production
              config: { ...(n.data.config || {}), ...(config || {}), ...formData }
            }
          }
        }
        return n;
      })

      // 2. Prepare updated edges
      let nextEdges = [...edges]

      // Update edge labels for Split Test
      if (newData.label === "Split Test (A/B)" && newData.weights) {
        const siblings = nextEdges.filter((ed) => ed.source === nodeId && ed.sourceHandle !== "right-source").slice()
        siblings.sort((a, b) => a.id.localeCompare(b.id))
        nextEdges = nextEdges.map((e) => {
          if (e.source !== nodeId || e.sourceHandle === "right-source") return e
          const idx = siblings.findIndex((s) => s.id === e.id)
          if (idx !== -1 && newData.weights[idx] !== undefined) {
            return { ...e, label: `${newData.weights[idx]}%`, data: { ...(e.data || {}), isSplitTest: true } }
          }
          return e
        })
      }

      // Update edge labels for If / Else
      if (newData.label === "If / Else") {
        const ifLabel = newData.trueLabel || 'If'
        const elseLabel = newData.elseLabel || newData.falseLabel || 'Else'
        const rawBranches = Array.isArray(newData.branches) && newData.branches.length > 0
          ? newData.branches
          : [{ id: newData.branchId || `branch-${nodeId}-0`, label: ifLabel }]

        const branches = rawBranches.map((branch: any, idx: number) => ({
          id: branch?.id || `branch-${nodeId}-${idx}`,
          label: branch?.label || (idx === 0 ? ifLabel : `Else If ${idx}`),
          branchType: idx === 0 ? 'if' : 'else_if',
          index: idx,
        }))

        const trueLabel = String(ifLabel).toUpperCase()
        const falseLabel = String(elseLabel).toUpperCase()

        const siblings = nextEdges.filter((ed) => ed.source === nodeId && ed.sourceHandle !== "right-source").slice()
        siblings.sort((a, b) => {
          const labelA = String(a.label || a.data?.label || '').toUpperCase()
          const labelB = String(b.label || b.data?.label || '').toUpperCase()
          const rankA = typeof (a.data as any)?.branchIndex === 'number'
            ? (a.data as any).branchIndex
            : (a.data?.conditionType === 'true' || a.sourceHandle === 'true' || labelA === 'YES' || labelA === 'TRUE' || labelA === 'SUCCESS' || labelA === trueLabel ? 0
              : a.data?.conditionType === 'false' || a.sourceHandle === 'false' || labelA === 'NO' || labelA === 'FALSE' || labelA === 'FAIL' || labelA === falseLabel ? 1
                : Number.MAX_SAFE_INTEGER)
          const rankB = typeof (b.data as any)?.branchIndex === 'number'
            ? (b.data as any).branchIndex
            : (b.data?.conditionType === 'true' || b.sourceHandle === 'true' || labelB === 'YES' || labelB === 'TRUE' || labelB === 'SUCCESS' || labelB === trueLabel ? 0
              : b.data?.conditionType === 'false' || b.sourceHandle === 'false' || labelB === 'NO' || labelB === 'FALSE' || labelB === 'FAIL' || labelB === falseLabel ? 1
                : Number.MAX_SAFE_INTEGER)
          if (rankA !== rankB) return rankA - rankB
          return a.id.localeCompare(b.id)
        })

        nextEdges = nextEdges.map((e) => {
          if (e.source !== nodeId || e.sourceHandle === "right-source") return e
          const idx = siblings.findIndex((s) => s.id === e.id)
          if (idx === -1) return e

          if (idx < branches.length) {
            const branch = branches[idx]
            return {
              ...e,
              label: branch.label,
              sourceHandle: `branch-${branch.id}`,
              data: {
                ...(e.data || {}),
                isCondition: true,
                branchId: branch.id,
                branchIndex: branch.index,
                branchType: branch.branchType,
                label: branch.label,
              },
            }
          }

          if (idx === branches.length) {
            return {
              ...e,
              label: elseLabel,
              sourceHandle: 'else',
              data: {
                ...(e.data || {}),
                isCondition: true,
                branchId: 'else',
                branchIndex: branches.length,
                branchType: 'else',
                label: elseLabel,
              },
            }
          }

          return e
        })
      }

      // Update Loop Back connections
      if (newData.label === "Loop Back To") {
        nextEdges = nextEdges.filter(e => !(e.source === nodeId && e.data?.isLoopBack));
        if (newData.targetId) {
          nextEdges.push({
            id: generateEdgeId(nodeId, newData.targetId) + "-loopback",
            source: nodeId,
            sourceHandle: "loop-source",
            target: newData.targetId,
            targetHandle: "loop-target",
            type: "custom",
            animated: true,
            style: { stroke: "#f59e0b", strokeWidth: 2, strokeDasharray: "5,5" },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" },
            data: { isLoopBack: true }
          });
        }
      }

      // 3. Apply layout to ensure structure is updated (e.g. labels, slots)
      const { nodes: lNodes, edges: lEdges } = performAutoLayout(nextNodes, nextEdges)
      setNodes(lNodes)
      setEdges(lEdges)
      setIsConfigModalOpen(false)
      setIsDirty(true)
    },
    [takeSnapshot, nodes, edges, setIsDirty],
  )


  const handleSave = useCallback(async () => {
    const timestamp = new Date().toISOString()

    // Generate the full payload
    const payload = buildPayloadFromBuilder({
      automationId,
      name,
      status,
      settings,
      version: 1,
      savedAt: timestamp,
      nodes,
      edges
    })

    console.log("🚀 [API] Saving automation to backend...", payload)

    // Simulate real API latency
    await new Promise(resolve => setTimeout(resolve, 800))

    setSavedAt(timestamp)
    setIsDirty(false)
    console.log("✅ [API] Automation saved successfully!")
  }, [automationId, nodes, edges, name, status, settings, setSavedAt, setIsDirty])

  const handleLoadAutomation = useCallback((payload: any) => {
    if (!payload?.automation) return;
    const { nodes: pNodes, edges: pEdges, name: pName, status: pStatus, settings: pSettings } = payload.automation;

    // 1. Restore metadata
    if (pName) setName(pName);
    if (pStatus) setStatus(pStatus);
    if (pSettings) setSettings(pSettings);

    // 2. Transform nodes from production format to builder format
    const bNodes = pNodes.map((n: any) => {
      const [category, nodeType] = (n.type || '').split(':');
      let type = category;

      // Map production types to builder types
      if (type === 'logic' || type === 'condition') type = 'condition';
      else if (type === 'loopBack' || type === 'loop_back') type = 'loopBack';
      else if (type === 'end') type = 'action';

      // Fallback for legacy JSON without colon
      if (n.type.startsWith('logic_')) type = 'condition';
      else if (n.type.startsWith('action_')) type = 'action';
      else if (n.type === 'loop_back') type = 'loopBack';

      const extractedNodeType = nodeType || (n.data?.ui?.nodeType) ||
        (n.type.startsWith('action_') ? n.type.replace('action_', '') :
          n.type.startsWith('logic_') ? n.type.replace('logic_', '') :
            n.type === 'end' ? 'end_automation' :
              n.type === 'loop_back' ? 'loop_back' : undefined);

      const isLegacy = !!n.data?.ui || Object.keys(n.data || {}).includes('config');
      const flatConfig = isLegacy ? (n.data?.config || {}) : n.data;

      let label = n.data?.ui?.label || flatConfig?.label;
      let iconName = n.data?.ui?.icon || flatConfig?.iconName;
      let color = n.data?.ui?.color || flatConfig?.color;

      // Extract UI state magically from Toolboxes for flat data without UI props
      if (!isLegacy) {
        const toolboxMeta = TOOLBOX_ITEMS.flatMap(g => g.items).find(i => i.nodeType === extractedNodeType);
        if (toolboxMeta) {
          label = label || toolboxMeta.label;
          iconName = iconName || toolboxMeta.iconName;
          color = color || toolboxMeta.color;
        }
      }

      return {
        id: n.id,
        // Ignore JSON positions to ensure builder's auto-layout takes full control
        position: { x: 0, y: 0 },
        type,
        data: {
          ...(n.data?.ui || {}),
          nodeType: extractedNodeType,
          ...flatConfig,
          config: flatConfig,
          label: label || n.id,
          subtitle: n.data?.ui?.subtitle || flatConfig?.subtitle,
          iconName,
          color,
        }
      };
    });

    // 3. Transform edges
    const bEdges = (pEdges || []).map((e: any) => {
      const isLoop = !!e.data?.isLoopBack;
      return {
        ...e,
        type: 'custom',
        label: e.data?.label || e.label,
        sourceHandle: isLoop ? 'loop-source' : e.sourceHandle,
        targetHandle: isLoop ? 'loop-target' : e.targetHandle,
        data: {
          ...(e.data || {}),
          isLoopBack: isLoop
        },
        style: isLoop ? { stroke: "#f59e0b", strokeWidth: 2, strokeDasharray: "5,5" } : e.style
      }
    });

    // 4. Restore functional components (icons) from names
    restoreNodeIcons(bNodes, TOOLBOX_ITEMS);

    // 5. Clear snapshots
    takeSnapshot(bNodes, bEdges);

    // 6. Update state (layout happens automatically)
    const { nodes: lNodes, edges: lEdges } = performAutoLayout(bNodes, bEdges);
    setNodes(lNodes);
    setEdges(lEdges);

    if (payload.automation.updatedAt || payload.automation.savedAt) {
      setSavedAt(payload.automation.updatedAt || payload.automation.savedAt);
    }
    setIsDirty(false)
  }, [setNodes, setEdges, setSavedAt, setName, setStatus, setSettings, takeSnapshot, setIsDirty]);

  useEffect(() => {
    saveRef.current = handleSave
    loadRef.current = handleLoadAutomation
    return () => {
      saveRef.current = null
      loadRef.current = null
    }
  }, [handleSave, handleLoadAutomation, saveRef, loadRef])

  const nodesWithData = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        draggable: movingNodeId === node.id,
        data: {
          ...node.data,
          isDragging,
          isMoving: movingNodeId === node.id,
          isSwapping: !!swappingNodeIds && swappingNodeIds.includes(node.id),
          isTargetable: node.data?.isTargetable || (!!movingNodeId && isSwappableAction(node) && node.id !== movingNodeId),
          onStartConnect,
          onClearConnection,
        },
      })),
    [nodes, isDragging, onStartConnect, onClearConnection, movingNodeId, swappingNodeIds],
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

      const updated = applyNodeChanges(changes, nodes)
      if (changes.some((c) => c.type === "remove")) {
        const { nodes: lNodes, edges: lEdges } = performAutoLayout(updated, edges)
        setNodes(lNodes)
        setEdges(lEdges)
      } else {
        setNodes(updated)
      }
      if (significant.length > 0) setIsDirty(true)
    },
    [takeSnapshot, nodes, edges, setIsDirty],
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const significant = changes.filter((c) => c.type !== "select")
      if (significant.length > 0) {
        takeSnapshot(nodes, edges)
        setIsDirty(true)
      }
      setEdges((eds) => applyEdgeChanges(changes, eds))
    },
    [takeSnapshot, nodes, edges, setIsDirty],
  )

  const onConnect = useCallback(
    (connection: any) => {
      const edgeId = generateEdgeId(connection.source, connection.target)
      setEdges((eds) => addEdge({ ...connection, id: edgeId, type: "custom" }, eds))
      setIsDirty(true)
    },
    [takeSnapshot, nodes, edges, setIsDirty],
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

      let foundItem: any
      for (const group of TOOLBOX_ITEMS) {
        foundItem = group.items.find((i) => i.label === label)
        if (foundItem) break
      }

      const nodesOfType = nodes.filter((n) => n.type === type)
      const nodeTypeForId = foundItem?.nodeType || type
      const newNodeId = `${type}_${nodeTypeForId}_${nodesOfType.length + 1}`

      const newNode: Node = {
        id: newNodeId,
        type,
        position,
        data: { 
          label,
          nodeType: nodeTypeForId
        },
        width: 256,
      }
      if (foundItem) {
        newNode.data = {
          ...newNode.data,
          label: foundItem.label,
          icon: foundItem.icon,
          nodeType: foundItem.nodeType,
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
          const isSplitTest = (foundItem?.label || label) === "Split Test (A/B)"
          const isIfElse = (foundItem?.label || label) === "If / Else"

          const branchY = newNode.position.y + 150
          const branchWidth = 256
          const branchGap = 56

          if (isIfElse) {
            const ifBranchId = `branch-${newNode.id}-${Date.now()}`
            const ifLabel = newNode.data?.trueLabel || 'If'
            const elseLabel = newNode.data?.elseLabel || newNode.data?.falseLabel || 'Else'
            const seedCondition = { field: 'tag', operator: 'contains', value: '' }

            newNode.data = {
              ...newNode.data,
              branches: [
                {
                  id: ifBranchId,
                  label: ifLabel,
                  logicalOperator: 'and',
                  conditions: [seedCondition],
                },
              ],
              elseLabel,
              trueLabel: ifLabel,
              falseLabel: elseLabel,
            }

            const branchSpecs = [
              { id: ifBranchId, label: ifLabel, branchType: 'if' as const, index: 0 },
              { id: 'else', label: elseLabel, branchType: 'else' as const, index: 1 },
            ]

            const stamp = Date.now()
            const startX = newNode.position.x + 140 - (branchWidth * branchSpecs.length + branchGap * (branchSpecs.length - 1)) / 2
            const addSteps: Node[] = branchSpecs.map((branch, idx) => ({
              id: `add-step-${stamp}-${branch.branchType}-${idx}`,
              type: "addStep",
              position: { x: startX + idx * (branchWidth + branchGap), y: branchY },
              data: { label: "Add Step", isLastBranchNode: idx === branchSpecs.length - 1 },
              draggable: false,
              width: 256,
              height: 92,
            }))

            const newEdges: Edge[] = branchSpecs.map((branch, idx) => ({
              id: generateEdgeId(newNode.id, addSteps[idx].id),
              source: newNode.id,
              sourceHandle: branch.branchType === 'else' ? 'else' : `branch-${branch.id}`,
              target: addSteps[idx].id,
              type: "custom",
              markerEnd: { type: MarkerType.ArrowClosed },
              label: branch.label,
              data: {
                isCondition: true,
                branchId: branch.id,
                branchIndex: branch.index,
                branchType: branch.branchType,
                label: branch.label,
              },
            }))

            const { nodes: lNodes, edges: lEdges } = performAutoLayout([newNode, ...addSteps], newEdges)
            setNodes(lNodes)
            setEdges(lEdges)
            return
          }

          const startX = newNode.position.x + 140 - (280 * 2 + 60) / 2
          const addStepA: Node = { id: `add-step-${Date.now()}-A`, type: "addStep", position: { x: startX, y: branchY }, data: { label: "Add Step" }, draggable: false, width: 256, height: 92 }
          const addStepB: Node = { id: `add-step-${Date.now()}-B`, type: "addStep", position: { x: startX + 256 + 56, y: branchY }, data: { label: "Add Step", isLastBranchNode: true }, draggable: false, width: 256, height: 92 }

          const newEdges: Edge[] = [
            {
              id: generateEdgeId(newNode.id, addStepA.id),
              source: newNode.id,
              target: addStepA.id,
              type: "custom",
              markerEnd: { type: MarkerType.ArrowClosed },
              label: isSplitTest ? "50%" : undefined,
              data: isSplitTest ? { label: "50%", isSplitTest: true } : undefined
            },
            {
              id: generateEdgeId(newNode.id, addStepB.id),
              source: newNode.id,
              target: addStepB.id,
              type: "custom",
              markerEnd: { type: MarkerType.ArrowClosed },
              label: isSplitTest ? "50%" : undefined,
              data: isSplitTest ? { label: "50%", isSplitTest: true } : undefined
            },
          ]

          const { nodes: lNodes, edges: lEdges } = performAutoLayout([newNode, addStepA, addStepB], newEdges)
          setNodes(lNodes)
          setEdges(lEdges)
          return
        }

        if (!isTerminal) {
          const addStepNode: Node = { id: `add-step-${Date.now()}`, type: "addStep", position: { x: newNode.position.x, y: newNode.position.y + 150 }, data: { label: "Add Step" }, draggable: false, width: 256, height: 92 }
          const newEdge: Edge = { id: generateEdgeId(newNode.id, addStepNode.id), source: newNode.id, target: addStepNode.id, type: "smoothstep", markerEnd: { type: MarkerType.ArrowClosed } }
          const { nodes: lNodes, edges: lEdges } = performAutoLayout([newNode, addStepNode], [newEdge])
          setNodes(lNodes)
          setEdges(lEdges)
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
            id: generateEdgeId(newNode.id, templateTargetId),
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
                id: generateEdgeId(newNode.id, r.id),
                source: newNode.id,
                target: r.id,
                type: "smoothstep",
                markerEnd: { type: MarkerType.ArrowClosed },
              })),
            )
          }
        }

        const nextNodes = cleanNodes.concat(newNode)
        const { nodes: lNodes, edges: lEdges } = performAutoLayout(nextNodes, nextEdges)
        setNodes(lNodes)
        setEdges(lEdges)
        return
      }

      const closestAddStepNode = selectAddStepDropTarget({ nodes, edges, position })
      if (!closestAddStepNode) return

      newNode.position = { x: closestAddStepNode.position.x - 76, y: closestAddStepNode.position.y }

      let updatedEdges = edges.filter((e) => e.target !== closestAddStepNode!.id && e.source !== closestAddStepNode!.id)
      const incoming = edges.filter((e) => e.target === closestAddStepNode!.id)
      incoming.forEach((e) => updatedEdges.push({ ...e, target: newNode.id }))

      const newNodes = nodes.filter((n) => n.id !== closestAddStepNode!.id).concat(newNode)

      // Rely on performAutoLayout to add necessary slots and layout the flow
      const { nodes: lNodes, edges: lEdges } = performAutoLayout(newNodes, updatedEdges)
      setNodes(lNodes)
      setEdges(lEdges)
      setIsDirty(true)
    },
    [edges, nodes, project, takeSnapshot, setIsDirty],
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
    <NodeActionsContext.Provider value={nodeActions}>
      <div className="flex h-full w-full bg-slate-50 dark:bg-slate-950 relative">
        <AutomationConfigModal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} node={selectedNodeForConfig} onSave={onSaveConfig} edges={edges} />
        <JsonViewerPanel automationId={automationId} nodes={nodes} edges={edges} />
  
        <div className="flex-1 min-h-0 relative h-full flex flex-col overflow-hidden" onDragEnter={onDragEnter} onDragLeave={onDragLeave}>
          <ReactFlow
            nodes={nodesWithData}
            edges={edgesWithData}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={() => {
              setMovingNodeId(null)
              setSwappingNodeIds(null)
            }}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onInit={onInit}
            nodeTypes={flowNodeTypes}
            edgeTypes={flowEdgeTypes}
            nodesDraggable={!!movingNodeId}
            nodesConnectable={false}
            elementsSelectable
            defaultEdgeOptions={{ type: "custom", markerEnd: { type: MarkerType.ArrowClosed } }}
            proOptions={{ hideAttribution: true }}
            className="bg-slate-50 dark:bg-slate-950"
          >
            <Background color={isDarkMode ? "#475569" : "#94a3b8"} gap={20} size={1} />
            <FlowBuilderControls canUndo={past.length > 0} canRedo={future.length > 0} onUndo={onUndo} onRedo={onRedo} />
          </ReactFlow>

          {showProTips && <ProTipBanner tip={PRO_TIPS[currentTipIndex]} currentIndex={currentTipIndex} total={PRO_TIPS.length} onPrev={prevTip} onNext={nextTip} onDismiss={() => setShowProTips(false)} />}
        </div>

        <FlowBuilderSidebar isCollapsed={isSidebarCollapsed} onCollapse={() => setIsSidebarCollapsed(true)} onExpand={() => setIsSidebarCollapsed(false)} />
      </div>
    </NodeActionsContext.Provider>
  )
}
