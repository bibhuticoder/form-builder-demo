import React, { useRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import { CanvasResizer } from "./CanvasResizer";

import { CanvasToolbar } from "./CanvasToolbar";
import { MIN_CANVAS_WIDTH, MAX_CANVAS_WIDTH } from "../../constants";
import { EmptyState } from "./EmptyState";
import FormRenderer from "../FormRenderer/FormRenderer";
import { CANVAS_DROPPABLE_ID } from "../../types/dnd";
import { useFormBuilder } from "../../context";
import "./canvas.css";

export interface CanvasProps {
  /** ID of the element currently being dragged over (for drop indicators) */
  dragOverId?: string | null;
  selectedFieldId?: string | null;
  onSelectField?: (id: string | null) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ dragOverId, selectedFieldId, onSelectField }) => {
  const { jsonContent, canvasWidth, setCanvasWidth } = useFormBuilder();
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Make canvas a droppable target for palette fields
  const { setNodeRef, isOver } = useDroppable({ id: CANVAS_DROPPABLE_ID });

  const isEmpty = jsonContent.fields.length === 0;

  return (
    <div className="flex-1 pt-2 flex flex-col gap-2">
      {/* Canvas Toolbar */}
      <CanvasToolbar canvasWidth={canvasWidth} onCanvasWidthChange={setCanvasWidth} selectedFieldId={selectedFieldId} />

      {/* Canvas Content Area */}
      <div
        className="flex-1 overflow-auto h-full p-16"
        onClick={() => onSelectField?.(null)}
      >
        <div
          ref={(node) => {
            canvasRef.current = node
            setNodeRef(node)
          }}
          className="relative mx-auto h-full"
          style={{
            width: canvasWidth,
            minWidth: `${MIN_CANVAS_WIDTH}px`,
            maxWidth: `${MAX_CANVAS_WIDTH}px`,
            minHeight: "600px",
          }}
        >
          {/* Visual Canvas (Scrollable) */}
          <div className="h-full rounded-lg bg-white dark:bg-gray-800 overflow-auto shadow-md">
            {isEmpty ? (
              <div className="h-full flex items-center justify-center p-8">
                <EmptyState isOver={isOver} />
              </div>
            ) : (
              <div className="canvas-content h-full">
                {/* Form Renderer */}
                <FormRenderer
                  formData={jsonContent}
                  dragOverId={dragOverId}
                  selectedFieldId={selectedFieldId}
                  onSelectField={onSelectField}
                  canvasWidth={canvasWidth}
                />
              </div>
            )}
          </div>

          {/* Resize Handle */}
          <CanvasResizer
            canvasRef={canvasRef}
            onResize={setCanvasWidth}
            minWidth={MIN_CANVAS_WIDTH}
            maxWidth={MAX_CANVAS_WIDTH}
          />
        </div>
      </div>
    </div>
  )
}
