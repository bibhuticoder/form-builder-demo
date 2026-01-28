/**
 * Individual sortable item wrapper that provides drag-and-drop functionality.
 * Uses dnd-kit's useSortable hook to enable dragging and reordering.
 */

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DragData } from "../../../../types/dnd";

/** Opacity applied to items while being dragged */
const DRAGGING_OPACITY = 0.6;

export interface DragHandleProps {
  attributes: ReturnType<typeof useSortable>["attributes"];
  listeners: ReturnType<typeof useSortable>["listeners"];
}

interface SortableItemProps {
  id: string;
  dragData: DragData;
  children: (dragHandleProps: DragHandleProps) => React.ReactNode;
}

/**
 * Wraps a child component to make it sortable via drag-and-drop.
 * The child receives drag handle props to control which element triggers dragging.
 */
export function SortableItem({ id, dragData, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data: dragData });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? DRAGGING_OPACITY : 1,
    position: "relative" as const,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({ attributes, listeners })}
    </div>
  );
}
