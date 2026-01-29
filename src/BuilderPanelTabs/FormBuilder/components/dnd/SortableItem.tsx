/**
 * Individual sortable item wrapper that provides drag-and-drop functionality.
 * Uses dnd-kit's useSortable hook to enable dragging and reordering.
 */

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import type { DragData } from "../../../../types/dnd";



export interface DragHandleProps {
  attributes: ReturnType<typeof useSortable>["attributes"];
  listeners: ReturnType<typeof useSortable>["listeners"];
}

interface SortableItemProps {
  id: string;
  dragData: DragData;
  children: (dragHandleProps: DragHandleProps) => React.ReactNode;
  width?: string; // Width class to apply to wrapper
}

/**
 * Wraps a child component to make it sortable via drag-and-drop.
 * The child receives drag handle props to control which element triggers dragging.
 */
export function SortableItem({ id, dragData, children, width }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data: dragData });

  // Create transform without scaling to prevent scaleX/scaleY effects
  const transformStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : {};

  const style = {
    ...transformStyle,
    transition,
    opacity: isDragging ? 0 : 1, // Hide completely when dragging
    width: width || undefined, // Apply width if provided
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
    >
      {children({ attributes, listeners })}
    </div>
  );
}
