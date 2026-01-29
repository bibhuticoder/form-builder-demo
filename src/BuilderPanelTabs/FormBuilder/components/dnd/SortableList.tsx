/**
 * Sortable container that manages a list of draggable items.
 * Provides the context for drag-and-drop reordering.
 */

import React from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

interface SortableListProps {
  /** Array of items with unique IDs */
  items: Array<{ id: string }>;
  /** Child elements to render */
  children: React.ReactNode;
}

/**
 * Wraps children with SortableContext to enable drag-and-drop reordering.
 */
export function SortableList({ items, children }: SortableListProps) {
  return (
    <SortableContext items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
      {children}
    </SortableContext>
  );
}
