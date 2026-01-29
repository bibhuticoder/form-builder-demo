/**
 * Renders a form based on the provided form definition with drag-and-drop support.
 */

import React from "react";

import { FormDefinition } from "../../../../types";
import FieldRenderer from "./FieldRenderer";
import BuilderFieldControls from "./elements/BuilderFieldControls";
import type { DragData } from "../../../../types/dnd";
import { CANVAS_DROPPABLE_ID } from "../../../../types/dnd";
import { useFormBuilder } from "../../context";
import { SortableList, SortableItem, DropIndicator } from "../dnd";

interface FormRendererProps {
  formData: FormDefinition;
  dragOverId?: string | null;
  selectedFieldId?: string | null;
  onSelectField?: (id: string) => void;
}

export default function FormRenderer({
  formData,
  dragOverId,
  selectedFieldId,
  onSelectField,
}: Readonly<FormRendererProps>) {
  const { deleteField, activeSubElement } = useFormBuilder();
  const { fields, formSettings } = formData;

  const onDelete = (fieldId: string) => {
    deleteField(fieldId);
  };

  // Helper to get width style from field
  const getWidthStyle = (field: typeof fields[0]): string => {
    const width = field.style?.width || "full";
    switch (width) {
      case "full":
        return "100%";
      case "three-quarters":
        return "75%";
      case "half":
        return "50%";
      case "third":
        return "33.333%";
      case "quarter":
        return "25%";
      default:
        return "100%";
    }
  };

  return (
    <div style={formSettings.settings}>
      <SortableList items={fields}>
        <div className="flex flex-row flex-wrap gap-1">
          {fields.map((field) => (
            <React.Fragment key={field.id}>
              <SortableItem
                id={field.id}
                dragData={{ kind: "canvas-field", fieldId: field.id } as DragData}
                width={getWidthStyle(field)}
              >
                {(dragHandleProps) => (
                  <BuilderFieldControls
                    field={field}
                    onDelete={onDelete}
                    dragHandleProps={dragHandleProps}
                    selected={selectedFieldId === field.id}
                    onSelect={onSelectField}
                  >
                    <FieldRenderer field={field} isSelected={selectedFieldId === field.id} activeSubElement={activeSubElement} />
                  </BuilderFieldControls>
                )}
              </SortableItem>
              {/* Show drop indicator when hovering over this field */}
              {dragOverId === field.id && <DropIndicator />}
            </React.Fragment>
          ))}
          {/* Show drop indicator at bottom when hovering over empty canvas */}
          {dragOverId === CANVAS_DROPPABLE_ID && fields.length > 0 && <DropIndicator />}
        </div>
      </SortableList>
    </div>
  );
}
