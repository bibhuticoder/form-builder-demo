/**
 * BuilderTime
 * A React component that renders a time input field within a form builder.
 * Supports labels, placeholders, help text, and validation.
 */

import { TimeField } from "../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";
import { useFormBuilder } from "../../../context";
import { getInputStyles, getLabelStyles, getHelpTextStyles, getPlaceholderStyles } from "../../../utils/styleUtils";
import { PlaceholderStyles } from "./PlaceholderStyles";

interface BuilderTimeProps {
  field: TimeField;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderTime({ field, isSelected, activeSubElement }: Readonly<BuilderTimeProps>) {
  const { jsonContent, activeBreakpoint } = useFormBuilder();
  return (
    <BuilderFieldWrapper field={field} isSelected={isSelected} activeSubElement={activeSubElement}>
      <PlaceholderStyles fieldId={field.id} style={field.style} />
      <div className="space-y-0.5">
        {field.label && (
          <label
            htmlFor={field.id}
            className={`block text-xs font-medium text-gray-700 ${isSelected && activeSubElement === 'label' ? 'ring-1 ring-primary ring-offset-1' : ''}`}
            style={getLabelStyles(field.style, activeBreakpoint)}
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative w-full">
          <div
            className={`w-full px-2 py-1 text-xs border border-gray-300 rounded-md bg-white text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap min-h-[26px] ${isSelected && ['input', 'placeholder'].includes(activeSubElement || '') ? 'ring-1 ring-primary ring-offset-1' : ''}`}
            style={getInputStyles(field.style, activeBreakpoint)}
          >
            <span
              className={field.placeholder ? "text-gray-500" : "text-gray-400"}
              style={getPlaceholderStyles(field.style)}
            >
              {field.placeholder}
            </span>
          </div>
          <input
            type="time"
            id={field.id}
            name={field.name}
            required={field.required}
            readOnly
            className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
          />
        </div>
        {field.helpText && (
          <p
            className={`text-[9px] text-gray-500 ${isSelected && activeSubElement === 'help' ? 'ring-1 ring-primary ring-offset-1' : ''}`}
            style={getHelpTextStyles(field.style, jsonContent.formSettings.settings, activeBreakpoint)}
          >
            {field.helpText}
          </p>
        )}
      </div>
    </BuilderFieldWrapper>
  );
}
