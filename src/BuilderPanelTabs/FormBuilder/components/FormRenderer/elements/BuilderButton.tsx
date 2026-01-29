/** 
 * A button field component for the form builder.
 * Renders a button with the specified label and style.
 */
import { ButtonField } from "../../../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";

interface BuilderButtonProps {
  field: ButtonField;
}

export default function BuilderButton({
  field,
}: Readonly<BuilderButtonProps>) {
  return (
    <BuilderFieldWrapper field={field}>
      <button
        style={field.style}
        type="button"
        className="w-full px-4 py-2 bg-primary text-white rounded-md font-medium text-sm hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {field.label}
      </button>
    </BuilderFieldWrapper>
  );
}
