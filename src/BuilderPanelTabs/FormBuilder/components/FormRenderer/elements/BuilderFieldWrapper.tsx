/**
 * Base Field Wrapper Component
 * Wraps individual field components in the form builder
 * Useful for adding common styles or functionality
 */
import { ReactNode} from "react";
import { BaseField } from "../../../types";

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
      className={`field-wrapper field-type-${field.type}`}
    >
      {children}
    </div>
  );
}
