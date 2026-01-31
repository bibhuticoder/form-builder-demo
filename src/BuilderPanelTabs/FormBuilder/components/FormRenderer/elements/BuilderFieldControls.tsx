/**
 * Wrapper component that provides hover controls (delete, move) for form fields in the builder.
 */
import { ReactNode, useState } from "react";
import { TrashIcon, QueueListIcon } from "@heroicons/react/24/outline";
import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";
import { BaseField, LabeledField } from "../../../types";

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
  forceHover?: boolean;
}

export default function BuilderFieldControls({
  field,
  children,
  onDelete,
  dragHandleProps,
  selected,
  onSelect,
  forceHover = false,
}: Readonly<BuilderFieldWrapperProps>) {
  const [isHovered, setIsHovered] = useState(false);
  const showHoverState = isHovered || forceHover;

  const getFieldName = (field: BaseField) => {
    let value = (field as LabeledField).label || field.type;

    if (field.type === "paragraph") {
      value = "Paragraph";
    }

    return value.toUpperCase();
  };

  return (
    <div
      role="button"
      className={`
        field-wrapper relative p-1 rounded transition-colors duration-200 border border-transparent
        ${showHoverState || selected ? '!border-primary !border-dotted' : ''}
        ${selected ? 'bg-primary/5' : ''}
        border-type-${field.type}
      `}
      style={{ width: '100%' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(field.id)}
      tabIndex={0}
    >
      {/* Action Bar */}
      <div
        className={`
          absolute -top-5 right-0 flex items-center gap-1.5 bg-primary text-white px-1.5 py-0.5 
          rounded-t opacity-0 transition-opacity duration-200 z-10 text-[10px] font-medium tracking-wider
          ${showHoverState || selected ? 'opacity-100' : ''}
        `}
      >
        <span className="text-white text-[10px]">{getFieldName(field)}</span>

        <div className="flex gap-1 pl-1.5 ml-1.5 border-l border-white/20">
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(field.id);
              }}
              title="Delete"
              className="w-3.5 h-3.5 cursor-pointer flex items-center justify-center text-white hover:text-red-200 transition-colors"
            >
              <TrashIcon width={14} height={14} />
            </button>
          )}

          {/* Drag handle button */}
          <button
            type="button"
            title="Move"
            {...dragHandleProps?.attributes}
            {...dragHandleProps?.listeners}
            className={`
              w-3.5 h-3.5 flex items-center justify-center text-white transition-opacity
              ${dragHandleProps ? 'cursor-grab hover:opacity-80' : 'cursor-default opacity-40'}
            `}
          >
            <QueueListIcon width={14} height={14} />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
