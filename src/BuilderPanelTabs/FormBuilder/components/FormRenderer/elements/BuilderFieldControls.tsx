/**
 * Wrapper component that provides hover controls (delete, move) for form fields in the builder.
 */
import { ReactNode, useState } from "react";
import { TrashIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";

import { BaseField } from "../../../../../types";

interface BuilderFieldWrapperProps {
  field: BaseField & { name?: string };
  children: ReactNode;
  onDelete?: (fieldId: string) => void;
  /**
   * dnd-kit drag handle props from useSortable
   * - attributes: Accessibility and data attributes for the drag handle
   * - listeners: Event handlers that enable dragging when attached to an element
   */
  dragHandleProps?: {
    attributes?: DraggableAttributes;
    listeners?: DraggableSyntheticListeners;
  };
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export default function BuilderFieldControls({
  field,
  children,
  onDelete,
  dragHandleProps,
  selected,
  onSelect,
}: Readonly<BuilderFieldWrapperProps>) {
  const [isHovered, setIsHovered] = useState(false);

  const getFieldName = (fieldName: string) => {
    if (fieldName.split("_").length > 1) {
      return fieldName.split("_").join(" ").toUpperCase();
    }
    return fieldName.toUpperCase();
  };

  // Map width values to CSS classes
  const getWidthClass = () => {
    const width = field.style?.width || "full";
    switch (width) {
      case "full":
        return "w-full";
      case "three-quarters":
        return "w-3/4";
      case "half":
        return "w-1/2";
      case "third":
        return "w-1/3";
      case "quarter":
        return "w-1/4";
      default:
        return "w-full";
    }
  };

  return (
    <div
      role="button"
      className={`
        field-wrapper relative p-2 rounded transition-colors duration-200 border-2 border-dotted
        ${getWidthClass()}
        ${isHovered ? 'border-primary' : 'border-transparent'}
        ${selected ? 'bg-primary/5 border-primary border-solid' : ''}
        border-type-${field.type}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(field.id)}
      tabIndex={0}
    >
      {/* Action Bar */}
      <div 
        className={`
          absolute -top-6 right-0 flex items-center gap-2 bg-primary text-white px-2 py-1 
          rounded-t opacity-0 transition-opacity duration-200 z-10 text-xs font-medium tracking-wider
          ${isHovered || selected ? 'opacity-100' : ''}
        `}
      >
        <span className="text-white text-xs">{getFieldName(field.name || field.type)}</span>
        
        <div className="flex gap-1 pl-2 ml-2 border-l border-white/20">
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(field.id);
              }}
              title="Delete"
              className="w-4 h-4 cursor-pointer flex items-center justify-center text-white hover:text-red-200 transition-colors"
            >
              <TrashIcon width={16} height={16} />
            </button>
          )}
          
          {/* Drag handle button */}
          <button
            type="button"
            title="Move"
            {...dragHandleProps?.attributes}
            {...dragHandleProps?.listeners}
            className={`
              w-4 h-4 flex items-center justify-center text-white transition-opacity
              ${dragHandleProps ? 'cursor-grab hover:opacity-80' : 'cursor-default opacity-40'}
            `}
          >
            <EllipsisVerticalIcon width={16} height={16} />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
