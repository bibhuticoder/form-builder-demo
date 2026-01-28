import React, { useState, useRef, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

import { CanvasToolbar } from "./CanvasToolbar";
import { MIN_CANVAS_WIDTH, MAX_CANVAS_WIDTH } from "../../../../constants";
import { EmptyState } from "./EmptyState";
import FormRenderer from "../FormRenderer/FormRenderer";
import { CANVAS_DROPPABLE_ID } from "../../../../types/dnd";
import { useFormBuilder } from "../../context";
import "./Canvas.css";

export interface CanvasProps {
  /** ID of the element currently being dragged over (for drop indicators) */
  dragOverId?: string | null;
  selectedFieldId?: string | null;
  onSelectField?: (id: string) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ dragOverId, selectedFieldId, onSelectField }) => {
  const { jsonContent, updateCanvasWidth } = useFormBuilder();
  const [canvasWidth, setCanvasWidth] = useState(768);
  const [isResizing, setIsResizing] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Make canvas a droppable target for palette fields
  const { setNodeRef, isOver } = useDroppable({ id: CANVAS_DROPPABLE_ID });

  const isEmpty = !jsonContent || Object.keys(jsonContent).length === 0;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const newWidth = e.clientX - rect.left

    // Set min and max constraints
    if (newWidth >= MIN_CANVAS_WIDTH && newWidth <= MAX_CANVAS_WIDTH) {
      setCanvasWidth(Math.round(newWidth))
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  const handleCanvasWidthChange = () => {
    updateCanvasWidth(canvasWidth);
  }

  useEffect(() => {
    handleCanvasWidthChange()
  }, [canvasWidth])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "ew-resize"
      document.body.style.userSelect = "none"
    } else {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isResizing])

  return (
    <div className="flex-1 pt-4 flex flex-col gap-4">
      {/* Canvas Toolbar */}
      <CanvasToolbar canvasWidth={jsonContent.formSettings.settings.width} onCanvasWidthChange={setCanvasWidth} />

      {/* Canvas Content Area */}
      <div className="flex-1 overflow-auto flex justify-center h-full">
        <div
          ref={(node) => {
            canvasRef.current = node
            setNodeRef(node)
          }}
          className="shadow-2xl rounded-lg transition-width duration-150 border border-gray-200 dark:border-gray-600 relative bg-white"
          style={{
            width: canvasWidth,
            minWidth: `${MIN_CANVAS_WIDTH}px`,
            maxWidth: `${MAX_CANVAS_WIDTH}px`,
            minHeight: "600px",
            outline: isOver ? "2px dashed #3b82f6" : "none",
          }}
        >
          {isEmpty ? (
            <div className="h-full flex items-center justify-center p-8">
              <EmptyState icon="📝" title="No Form Data" description="Start by pasting your form JSON or drag elements from the sidebar" />
            </div>
          ) : (
            <div>
              {/* <JsonEditor
                value={jsonContent}
                onChange={onJsonChange}
                onSave={onSave}
              /> */}
              {/* Form Renderer */}
              <FormRenderer
                formData={jsonContent}
                dragOverId={dragOverId}
                selectedFieldId={selectedFieldId}
                onSelectField={onSelectField}
              />
            </div>
          )}

          {/* Resize Handle */}
          <div onMouseDown={handleMouseDown} className="resize-handle">
            <EllipsisVerticalIcon className="resize-handle-icon text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
