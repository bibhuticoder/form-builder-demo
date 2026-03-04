import React, { useRef } from "react"
import { useDroppable } from "@dnd-kit/core"
import { CanvasToolbar } from "./CanvasToolbar"
import { EmptyState } from "./EmptyState"
import EmailRenderer from "../EmailRenderer/EmailRenderer"
import { CANVAS_DROPPABLE_ID } from "../../types/dnd"
import { useEmailBuilder } from "../../context"
import "./canvas.css"

export interface CanvasProps {
  dragOverId?: string | null
  selectedBlockId?: string | null
  onSelectBlock?: (id: string | null) => void
}

export const Canvas: React.FC<CanvasProps> = ({ dragOverId, selectedBlockId, onSelectBlock }) => {
  const { jsonContent, canvasWidth, setCanvasWidth, activeBreakpoint } = useEmailBuilder()
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const { setNodeRef, isOver } = useDroppable({ id: CANVAS_DROPPABLE_ID })
  const isEmpty = jsonContent.blocks.length === 0

  return (
    <div className="flex-1 pt-2 flex flex-col gap-2">
      <CanvasToolbar canvasWidth={canvasWidth} onCanvasWidthChange={setCanvasWidth} />
      <div className="flex-1 overflow-auto h-full p-16" onClick={() => onSelectBlock?.(null)}>
        <div
          ref={(node) => {
            canvasRef.current = node
            setNodeRef(node)
          }}
          className="relative mx-auto h-full transition-[width] duration-300 ease-in-out"
          style={{
            width: canvasWidth,
            minHeight: "400px",
          }}
        >
          <div className={`h-full overflow-auto shadow-md transition-all duration-300 ${activeBreakpoint === "mobile" ? "rounded-2xl border-4 border-black dark:border-white" : "rounded"}`}>
            {isEmpty ? (
              <div className="h-full flex items-center justify-center p-8 bg-primary/5 dark:bg-primary/10">
                <EmptyState isOver={isOver} />
              </div>
            ) : (
              <div className="canvas-content h-full">
                <EmailRenderer templateData={jsonContent} dragOverId={dragOverId} selectedBlockId={selectedBlockId} onSelectBlock={onSelectBlock} canvasWidth={canvasWidth} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
