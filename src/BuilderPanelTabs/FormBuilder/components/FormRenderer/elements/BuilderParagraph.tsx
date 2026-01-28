/**
 * BuilderParagraph
 * A React component that renders a paragraph field within a form builder.
 * Displays text content with custom styling.
 */

import { ParagraphField } from "../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";

interface BuilderParagraphProps {
  field: ParagraphField;
}

export default function BuilderParagraph({
  field,
}: Readonly<BuilderParagraphProps>) {
  return (
    <BuilderFieldWrapper field={field}>
      <p style={field.style}>{field.label}</p>
    </BuilderFieldWrapper>
  );
}
