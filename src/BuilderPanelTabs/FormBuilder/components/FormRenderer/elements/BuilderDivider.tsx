/**
 * BuilderDivider
 * A React component that renders a divider field within a form builder.
 * Provides visual separation between form sections.
 */

import { DividerField } from "../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";
import { getInputStyles } from "../../../utils/styleUtils";
import { useFormBuilder } from "../../../context";

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
  const { activeBreakpoint } = useFormBuilder();

  const dividerStyle = getInputStyles(field.style, activeBreakpoint);
  if (!dividerStyle.backgroundColor) {
    dividerStyle.backgroundColor = "#000000";
  }

  return (
    <BuilderFieldWrapper field={field} isSelected={isSelected} activeSubElement={activeSubElement}>
      <div className="h-0.5"
        style={dividerStyle}
      />
    </BuilderFieldWrapper>
  );
}
