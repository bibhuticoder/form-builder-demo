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
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderParagraph({
  field,
  isSelected,
  activeSubElement,
}: Readonly<BuilderParagraphProps>) {
  return (
    <BuilderFieldWrapper field={field} isSelected={isSelected} activeSubElement={activeSubElement}>
      <p 
        style={getInputStyles(field.style)}
        className="transition-all duration-200 text-gray-900 dark:text-white"
      >
        {field.label}
      </p>
    </BuilderFieldWrapper>
  );
}
