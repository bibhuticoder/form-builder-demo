import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import type { DragData } from "../../types/dnd";

export interface DragHandleProps {
  attributes: ReturnType<typeof useSortable>["attributes"];
  listeners: ReturnType<typeof useSortable>["listeners"];
}

interface SortableItemProps {
  id: string;
  dragData: DragData;
  children: (dragHandleProps: DragHandleProps) => React.ReactNode;
  className?: string;
}

export function SortableItem({ id, dragData, children, className }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data: dragData });

  const transformStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : {};

  const style = {
    ...transformStyle,
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={className}
    >
      {children({ attributes, listeners })}
    </div>
  );
}
