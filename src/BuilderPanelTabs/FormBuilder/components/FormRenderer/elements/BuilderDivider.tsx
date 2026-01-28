/**
 * BuilderDivider
 * A React component that renders a divider field within a form builder.
 * Provides visual separation between form sections.
 */

import { DividerField } from "../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";

interface BuilderDividerProps {
  field: DividerField;
}

export default function BuilderDivider({
  field,
}: Readonly<BuilderDividerProps>) {
  return (
    <BuilderFieldWrapper field={field}>
      <hr
        style={field.style}
        className="border-t border-gray-300 dark:border-gray-600 my-6"
      />
    </BuilderFieldWrapper>
  );
}
