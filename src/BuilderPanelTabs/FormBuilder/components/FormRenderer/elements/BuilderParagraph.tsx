/**
 * BuilderParagraph
 * A React component that renders a paragraph field within a form builder.
 * Displays text content with custom styling.
 */

import { ParagraphField } from "../../../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";
import { getInputStyles } from "../../../utils/styleUtils";

interface BuilderParagraphProps {
  field: ParagraphField;
}

export default function BuilderParagraph({
  field,
}: Readonly<BuilderParagraphProps>) {
  return (
    <BuilderFieldWrapper field={field}>
      <p 
        style={getInputStyles(field.style)}
        className="transition-all duration-200"
      >
        {field.label}
      </p>
    </BuilderFieldWrapper>
  );
}
