/** 
 * A button field component for the form builder.
 * Renders a button with the specified label and style.
 */
import { ButtonField } from "../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";

interface BuilderButtonProps {
  field: ButtonField;
}

export default function BuilderButton({
  field,
}: Readonly<BuilderButtonProps>) {
  return (
    <BuilderFieldWrapper field={field}>
      <button style={field.style} type="button">{field.label}</button>
    </BuilderFieldWrapper>
  );
}
