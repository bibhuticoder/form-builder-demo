/**
 * Base Field Wrapper Component
 * Wraps individual field components in the form builder
 * Useful for adding common styles or functionality
 */
import { ReactNode} from "react";
import { BaseField } from "../../../../../types";
import { getContainerStyles } from "../../../utils/styleUtils";

interface FieldWrapperProps {
  field: BaseField;
  children: ReactNode;
  onDelete?: (fieldId: string) => void;
  onMove?: (fieldId: string) => void;
}

export default function BuilderFieldWrapper({
  field,
  children,
}: Readonly<FieldWrapperProps>) {
 
  return (
    <div 
      className={`field-wrapper field-type-${field.type} transition-all duration-200`}
      style={getContainerStyles(field.style)}
    >
      {children}
    </div>
  );
}
