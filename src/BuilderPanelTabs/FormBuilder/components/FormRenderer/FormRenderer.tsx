/**
 * Renders a form based on the provided form definition with drag-and-drop support.
 */

import React from "react";

import { FormDefinition } from "../../types";
import FieldRenderer from "./FieldRenderer";
import BuilderFieldControls from "./elements/BuilderFieldControls";
import type { DragData } from "../../types/dnd";
import { CANVAS_DROPPABLE_ID } from "../../types/dnd";
import { useFormBuilder } from "../../context";
import { SortableList, SortableItem, DropIndicator } from "../dnd";
import { DEF_CANVAS_WIDTH } from "../../constants";
import { getFormSettingsStyles, resolveBreakpointStyle, getActiveBreakpoint } from "../../utils/styleUtils";
import { BreakpointId } from "../../types";

interface FormRendererProps {
  formData: FormDefinition;
  dragOverId?: string | null;
  selectedFieldId?: string | null;
  onSelectField?: (id: string) => void;
  canvasWidth: number;
}

export default function FormRenderer({
  formData,
  dragOverId,
  selectedFieldId,
  onSelectField,
  canvasWidth
}: Readonly<FormRendererProps>) {
  const { deleteField, activeSubElement } = useFormBuilder();
  const { fields, formSettings } = formData;

  const onDelete = (fieldId: string) => {
    deleteField(fieldId);
  };

  // Determine active breakpoint based on canvas width
  const activeBreakpoint: BreakpointId = getActiveBreakpoint(canvasWidth);

  const getWidthClass = (field: typeof fields[0]): string => {
    const resolvedStyle = resolveBreakpointStyle(field.style, activeBreakpoint);
    const width = resolvedStyle.width || "full";

    const isSmallScreen = canvasWidth < DEF_CANVAS_WIDTH;

    if (isSmallScreen) {
      return "col-span-12";
    }

    switch (width) {
      case "full":
        return "col-span-12";
      case "three-quarters":
        return "col-span-9";
      case "half":
        return "col-span-6";
      case "third":
        return "col-span-4";
      case "quarter":
        return "col-span-3";
      default:
        return "col-span-12";
    }
  };

  return (

    <SortableList items={fields}>
      {/* outer layer to center form */}
      <div className="mx-auto w-full h-full" style={{ maxWidth: getFormSettingsStyles(formSettings.settings).maxWidth, maxHeight: getFormSettingsStyles(formSettings.settings).maxHeight }}>
        <div className="grid grid-cols-12 content-start gap-2 mx-auto overflow-auto" style={getFormSettingsStyles(formSettings.settings)}>
          {fields.map((field) => (
            <React.Fragment key={field.id}>
              {/* Show drop indicator when hovering over this field (inserts before) */}
              {dragOverId === field.id && <DropIndicator width={getWidthClass(field)} />}

              <SortableItem
                id={field.id}
                dragData={{ kind: "canvas-field", fieldId: field.id } as DragData}
                className={getWidthClass(field)}
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
            </React.Fragment>
          ))}
          {/* Show drop indicator at bottom when hovering over empty canvas */}
          {dragOverId === CANVAS_DROPPABLE_ID && fields.length > 0 && <DropIndicator width={`col-span-12`} />}
        </div>
      </div>
    </SortableList>

  );
}
