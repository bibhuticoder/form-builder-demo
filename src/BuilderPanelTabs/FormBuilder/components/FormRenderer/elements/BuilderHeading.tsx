/**
 * BuilderHeading
 * A React component that renders a heading field within a form builder.
 * Supports different heading levels (h1-h5) and custom styling.
 */

import { ElementType } from "react";

import { HeadingField } from "../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";


interface BuilderHeadingProps {
  field: HeadingField;
}

export default function BuilderHeading({
  field,
}: Readonly<BuilderHeadingProps>) {
  const Tag = (field.headingLevel || "div") as ElementType;

  return (
    <BuilderFieldWrapper field={field}>
      <Tag style={field.style}>
        {field.label}
      </Tag>
    </BuilderFieldWrapper>
  );
}
