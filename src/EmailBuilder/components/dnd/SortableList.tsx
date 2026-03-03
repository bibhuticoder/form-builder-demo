import React from "react";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";

interface SortableListProps {
  items: Array<{ id: string }>;
  children: React.ReactNode;
}

export function SortableList({ items, children }: SortableListProps) {
  return (
    <SortableContext id="email-sortable-list" items={items.map((item) => item.id)} strategy={rectSortingStrategy}>
      {children}
    </SortableContext>
  );
}
