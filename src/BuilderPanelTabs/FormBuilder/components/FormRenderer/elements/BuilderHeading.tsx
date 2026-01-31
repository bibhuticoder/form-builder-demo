/**
 * BuilderHeading
 * A React component that renders a heading field within a form builder.
 * Supports different heading levels (h1-h5) and custom styling.
 */

import { ElementType } from "react";

import { HeadingField } from "../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";
import { getInputStyles } from "../../../utils/styleUtils";


interface BuilderHeadingProps {
  field: HeadingField;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderHeading({
  field,
  isSelected,
  activeSubElement,
}: Readonly<BuilderHeadingProps>) {
  const Tag = (field.headingLevel || "h2") as ElementType;

  return (
    <BuilderFieldWrapper field={field} isSelected={isSelected} activeSubElement={activeSubElement}>
      <Tag
        dangerouslySetInnerHTML={{ __html: field.label }}
        style={getInputStyles(field.style)}
        className={`transition-all duration-200 text-gray-900 dark:text-white ${isSelected && activeSubElement === 'label' ? 'ring-1 ring-primary ring-offset-1 rounded px-1' : ''}`}
      >
      </Tag>
    </BuilderFieldWrapper>
  );
}
