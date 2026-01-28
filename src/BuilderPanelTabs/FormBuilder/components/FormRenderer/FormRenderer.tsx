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
  const { deleteField } = useFormBuilder();
  const { fields, formSettings } = formData;

  const onDelete = (fieldId: string) => {
    deleteField(fieldId);
  };

  return (
    <div style={formSettings.settings}>
      <SortableList items={fields}>
        {fields.map((field) => (
          <React.Fragment key={field.id}>
            <SortableItem
              id={field.id}
              dragData={{ kind: "canvas-field", fieldId: field.id } as DragData}
            >
              {(dragHandleProps) => (
                <BuilderFieldControls
                  field={field}
                  onDelete={onDelete}
                  dragHandleProps={dragHandleProps}
                  selected={selectedFieldId === field.id}
                  onSelect={onSelectField}
                >
                  <FieldRenderer field={field} />
                </BuilderFieldControls>
              )}
            </SortableItem>
            {/* Show drop indicator when hovering over this field */}
            {dragOverId === field.id && <DropIndicator />}
          </React.Fragment>
        ))}
        {/* Show drop indicator at bottom when hovering over empty canvas */}
        {dragOverId === CANVAS_DROPPABLE_ID && fields.length > 0 && <DropIndicator />}
      </SortableList>
    </div>
  );
}
