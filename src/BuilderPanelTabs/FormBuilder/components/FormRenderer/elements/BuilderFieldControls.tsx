/**
 * Wrapper component that provides hover controls (delete, move) for form fields in the builder.
 */
import { ReactNode, useState, CSSProperties } from "react";
import { TrashIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";

import { BaseField } from "../../../types";

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

  const wrapperStyle: CSSProperties = {
    position: "relative",
    padding: "8px",
    border: `2px dotted ${isHovered ? "#5434FF" : "transparent"}`,
    borderRadius: "4px",
    transition: "border-color 0.2s ease",
  };

  const actionBarStyle: CSSProperties = {
    position: "absolute",
    top: "-24px",
    right: "0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#5533ff",
    color: "white",
    padding: "4px 8px",
    borderRadius: "4px 4px 0 0",
    opacity: isHovered ? 1 : 0,
    transition: "opacity 0.2s ease",
    zIndex: 10,
    fontSize: "12px",
    fontWeight: 500,
    letterSpacing: "0.05em",
  };


  const iconContainerStyle: CSSProperties = {
    display: "flex",
    gap: "4px",
    borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
    paddingLeft: "8px",
  };

  const iconButtonStyle: CSSProperties = {
    width: "16px",
    height: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "none",
    padding: "0",
    color: "white",
    transition: "color 0.2s ease",
  };

  const getFieldName = (fieldName: string) => {
    if (fieldName.split("_").length > 1) {
      return fieldName.split("_").join(" ").toUpperCase();
    }
    return fieldName.toUpperCase();
  };

  return (
    <div
      role="button"
      className={`field-wrapper field-type-${field.type} ${selected ? 'bg-purple-100 border' : ''}`}
      style={wrapperStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(field.id)}
      tabIndex={0}
    >
      {/* Action Bar */}
      <div style={actionBarStyle}>
        <span className="text-white text-xs">{getFieldName(field.name || field.type)}</span>
        <div style={iconContainerStyle}>
          {onDelete && (
            <button
              onClick={() => onDelete(field.id)}
              title="Delete"
              style={iconButtonStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fecaca")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
            >
              <TrashIcon width={16} height={16} />
            </button>
          )}
          {/* Drag handle button - spreads dnd-kit attributes and listeners */}
          <button
            type="button"
            title="Move"
            {...dragHandleProps?.attributes}
            {...dragHandleProps?.listeners}
            style={{
              ...iconButtonStyle,
              cursor: dragHandleProps ? "grab" : "default",
              opacity: dragHandleProps ? 1 : 0.4,
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.opacity = dragHandleProps ? "0.8" : "0.4")}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.opacity = dragHandleProps ? "1" : "0.4")}
            aria-disabled={!dragHandleProps}
          >
            <EllipsisVerticalIcon width={16} height={16} />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
