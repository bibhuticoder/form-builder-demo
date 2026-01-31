/** 
 * A button field component for the form builder.
 * Renders a button with the specified label and style.
 */
import { ButtonField } from "../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";

interface BuilderButtonProps {
  field: ButtonField;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderButton({
  field,
  isSelected,
  activeSubElement,
}: Readonly<BuilderButtonProps>) {
  return (
    <BuilderFieldWrapper field={field} isSelected={isSelected} activeSubElement={activeSubElement}>
      <button
        style={field.style}
        type="button"
        className={`w-full px-4 py-2 bg-primary text-white rounded-md font-medium text-sm transition-colors focus:outline-none ${isSelected && activeSubElement === 'label' ? 'ring-1 ring-primary ring-offset-1' : ''}`}
      >
        {field.label}
      </button>
    </BuilderFieldWrapper>
  );
}
