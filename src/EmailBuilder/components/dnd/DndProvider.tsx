/**
 * Main DND provider for the email builder.
 */

import React, { useState, useCallback, useMemo } from "react"
import { DndContext, DragOverlay, pointerWithin, rectIntersection, type CollisionDetection, type DragEndEvent, type DragStartEvent, type DragOverEvent } from "@dnd-kit/core"
import type { DragData } from "../../types/dnd"
import type { EmailBlock, EmailBreakpointId } from "../../types"
import { createBlockFromType } from "../../utils/dnd/utils"

const DRAG_PREVIEW_WIDTH = "400px"
const DRAG_PREVIEW_OPACITY = 0.9

interface DndProviderProps {
  children: (dragOverId: string | null) => React.ReactNode
  onBlockAdd: (block: EmailBlock, position?: string | number) => void
  onBlockReorder: (oldIndex: number, newIndex: number) => void
  blocks: EmailBlock[]
  renderPreview?: (block: EmailBlock) => React.ReactNode
  activeBreakpoint: EmailBreakpointId
  defaultBgColor?: string
}

export function DndProvider({ children, onBlockAdd, onBlockReorder, blocks, renderPreview, activeBreakpoint, defaultBgColor }: DndProviderProps) {
  const [activeDrag, setActiveDrag] = useState<{ id?: string; data?: DragData }>({})
  const [overId, setOverId] = useState<string | null>(null)

  const resetDragState = useCallback(() => {
    setActiveDrag({})
    setOverId(null)
  }, [])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDrag({ id: String(event.active.id), data: event.active.data.current as DragData | undefined })
  }, [])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    setOverId(event.over ? String(event.over.id) : null)
  }, [])

  const handlePaletteBlockDrop = useCallback(
    (overId: string, activeData: DragData) => {
      if (!activeData.blockType) return

      const overIndex = blocks.findIndex((b) => b.id === overId)
      const isColumnTarget = overId.startsWith("email-column:")
      const insertPosition = isColumnTarget ? overId : overIndex >= 0 ? overIndex : undefined

      const newBlock = createBlockFromType(activeData.blockType, activeData.label || activeData.blockType, blocks, activeBreakpoint, defaultBgColor)
      onBlockAdd(newBlock, insertPosition)
    },
    [onBlockAdd, blocks, activeBreakpoint, defaultBgColor],
  )

  const handleCanvasBlockReorder = useCallback(
    (activeId: string, overId: string) => {
      const oldIndex = blocks.findIndex((block) => block.id === activeId)
      const newIndex = blocks.findIndex((block) => block.id === overId)

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return

      onBlockReorder(oldIndex, newIndex)
    },
    [blocks, onBlockReorder],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      resetDragState()

      if (!over) return

      const activeData = active.data.current as DragData | undefined
      const overId = String(over.id)

      if (activeData?.kind === "palette-block") {
        handlePaletteBlockDrop(overId, activeData)
      } else if (activeData?.kind === "canvas-block") {
        handleCanvasBlockReorder(String(active.id), overId)
      }
    },
    [resetDragState, handlePaletteBlockDrop, handleCanvasBlockReorder],
  )

  const handleDragCancel = useCallback(() => {
    resetDragState()
  }, [resetDragState])

  const collisionDetection = useCallback<CollisionDetection>((args) => {
    const pointerCollisions = pointerWithin(args)
    const activeData = args.active.data.current as DragData | undefined

    if (activeData?.kind === "palette-block") {
      const columnCollisions = pointerCollisions.filter((collision) => String(collision.id).startsWith("email-column:"))
      if (columnCollisions.length > 0) {
        return columnCollisions
      }
    }

    if (pointerCollisions.length > 0) {
      return pointerCollisions
    }

    return rectIntersection(args)
  }, [])

  const activeCanvasBlock = useMemo(() => blocks?.find((b) => b.id === activeDrag.id), [activeDrag.id, blocks])

  const activePalettePreview = useMemo(() => {
    if (activeDrag.data?.kind === "palette-block" && activeDrag.data.blockType && activeDrag.data.label) {
      return createBlockFromType(activeDrag.data.blockType, activeDrag.data.label, blocks, activeBreakpoint, defaultBgColor)
    }
    return null
  }, [activeDrag.data, blocks, activeBreakpoint, defaultBgColor])

  const previewBlock = activePalettePreview || activeCanvasBlock

  return (
    <DndContext collisionDetection={collisionDetection} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
      {children(overId)}

      <DragOverlay dropAnimation={null}>{(activePalettePreview || (activeDrag.data?.kind === "canvas-block" && activeCanvasBlock)) && <div style={{ width: DRAG_PREVIEW_WIDTH, pointerEvents: "none", opacity: DRAG_PREVIEW_OPACITY }}>{renderPreview && previewBlock ? renderPreview(previewBlock) : null}</div>}</DragOverlay>
    </DndContext>
  )
}
