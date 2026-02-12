/**
 * Base Field Wrapper Component
 * Wraps individual field components in the form builder
 * Useful for adding common styles or functionality
 */
import { ReactNode } from "react";
import { BaseField } from "../../../types";
import { getContainerStyles } from "../../../utils/styleUtils";
import { useFormBuilder } from "../../../context";

interface FieldWrapperProps {
  field: BaseField;
  children: ReactNode;
  onDelete?: (fieldId: string) => void;
  onMove?: (fieldId: string) => void;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderFieldWrapper({
  field,
  children,
  isSelected,
  activeSubElement,
}: Readonly<FieldWrapperProps>) {
  const { activeBreakpoint } = useFormBuilder();

  // Apply highlighting ring when window is selected
  const highlightClass = isSelected && activeSubElement === 'window'
    ? 'ring-1 ring-primary ring-offset-1'
    : '';

  return (
    <div
      className={`field-wrapper h-fit field-type-${field.type} transition-all duration-200 ${highlightClass}`}
      style={getContainerStyles(field.style, activeBreakpoint)}
    >
      {children}
    </div>
  );
}
