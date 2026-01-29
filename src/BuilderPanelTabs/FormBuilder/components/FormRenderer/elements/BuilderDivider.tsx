/**
 * BuilderDivider
 * A React component that renders a divider field within a form builder.
 * Provides visual separation between form sections.
 */

import { DividerField } from "../../../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";

interface BuilderDividerProps {
  field: DividerField;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderDivider({
  field,
  isSelected,
  activeSubElement,
}: Readonly<BuilderDividerProps>) {
  return (
    <BuilderFieldWrapper field={field} isSelected={isSelected} activeSubElement={activeSubElement}>
      <hr
        style={field.style}
        className="border-t border-gray-300 dark:border-gray-600 my-6"
      />
    </BuilderFieldWrapper>
  );
}
