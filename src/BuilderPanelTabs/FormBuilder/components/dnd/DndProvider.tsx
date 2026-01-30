/**
 * Main DND provider that wraps the application with drag-and-drop functionality.
 * Manages all drag state and events, delegating business logic to callbacks.
 */

import React, { useState, useCallback, useMemo } from "react";
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent, type DragOverEvent } from "@dnd-kit/core";
import type { DragData } from "../../types/dnd";
import type { Field } from "../../types";
import { createFieldFromType } from "../../utils/dnd/utils";

/** Width of the drag preview overlay */
const DRAG_PREVIEW_WIDTH = "400px";
/** Opacity of the drag preview overlay */
const DRAG_PREVIEW_OPACITY = 0.9;

interface DndProviderProps {
  children: (dragOverId: string | null) => React.ReactNode;
  /** Callback when a new field is added from the palette */
  onFieldAdd: (field: Field, afterId?: string) => void;
  /** Callback when fields are reordered */
  onFieldReorder: (oldIndex: number, newIndex: number) => void;
  /** Current list of fields for finding active field during drag */
  fields: Field[];
  /** Custom render function for drag preview */
  renderPreview?: (field: Field) => React.ReactNode;
}

/**
 * Provides drag-and-drop context for the form builder.
 * Handles all DND events and manages drag state, while delegating
 * business logic (adding/reordering fields) to parent callbacks.
 * Uses render prop pattern to provide dragOverId to children.
 */
export function DndProvider({
  children,
  onFieldAdd,
  onFieldReorder,
  fields,
  renderPreview
}: DndProviderProps) {
  const [activeDrag, setActiveDrag] = useState<{ id?: string; data?: DragData }>({});
  const [overId, setOverId] = useState<string | null>(null);

  /** Resets drag state when drag operation completes or is cancelled */
  const resetDragState = useCallback(() => {
    setActiveDrag({});
    setOverId(null);
  }, []);

  /** Captures drag start event and stores active drag data */
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDrag({ id: String(event.active.id), data: event.active.data.current as DragData | undefined });
  }, []);

  /** Tracks which element is currently being dragged over for drop indicators */
  const handleDragOver = useCallback((event: DragOverEvent) => {
    setOverId(event.over ? String(event.over.id) : null);
  }, []);

  /**
   * Handles dropping a field from the palette onto the canvas
   * Inserts the new field after the drop target (or at end if no target)
   */
  const handlePaletteFieldDrop = useCallback((overId: string, activeData: DragData) => {
    if (!activeData.fieldType) return;

    const newField = createFieldFromType(activeData.fieldType, activeData.label || activeData.fieldType, fields);
    onFieldAdd(newField, overId);
  }, [onFieldAdd, fields]);

  /**
   * Handles reordering existing fields within the canvas
   */
  const handleCanvasFieldReorder = useCallback((activeId: string, overId: string) => {
    const oldIndex = fields.findIndex((field) => field.id === activeId);
    const newIndex = fields.findIndex((field) => field.id === overId);

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

    onFieldReorder(oldIndex, newIndex);
  }, [fields, onFieldReorder]);

  /**
   * Main drag end handler - delegates to specific handlers based on drag type
   * Always resets state first to immediately clear visual indicators
   */
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    resetDragState();

    if (!over) return;

    const activeData = active.data.current as DragData | undefined;
    const overId = String(over.id);

    if (activeData?.kind === "palette-field") {
      handlePaletteFieldDrop(overId, activeData);
    } else if (activeData?.kind === "canvas-field") {
      handleCanvasFieldReorder(String(active.id), overId);
    }
  }, [resetDragState, handlePaletteFieldDrop, handleCanvasFieldReorder]);

  const handleDragCancel = useCallback(() => {
    resetDragState();
  }, [resetDragState]);

  const activeCanvasField = useMemo(
    () => fields?.find((f) => f.id === activeDrag.id),
    [activeDrag.id, fields]
  );

  /** Creates a preview field instance when dragging from the palette */
  const activePalettePreview = useMemo(() => {
    if (activeDrag.data?.kind === "palette-field" && activeDrag.data.fieldType && activeDrag.data.label) {
      return createFieldFromType(activeDrag.data.fieldType, activeDrag.data.label, fields);
    }
    return null;
  }, [activeDrag.data, fields]);

  const previewField = activePalettePreview || activeCanvasField;

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* Render children with dragOverId */}
      {children(overId)}

      {/* Drag preview overlay - shows actual field component while dragging */}
      <DragOverlay dropAnimation={null}>
        {(activePalettePreview || (activeDrag.data?.kind === "canvas-field" && activeCanvasField)) && (
          <div style={{ width: DRAG_PREVIEW_WIDTH, pointerEvents: "none", opacity: DRAG_PREVIEW_OPACITY }}>
            {renderPreview && previewField ? renderPreview(previewField) : null}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
