/**
 * BuilderDropdown
 * A React component that renders a dropdown/select field within a form builder.
 * Supports labels, placeholders, help text, options, and validation.
 */

import { DropdownField } from "../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";
import { useFormBuilder } from "../../../context";
import { getInputStyles, getLabelStyles, getHelpTextStyles } from "../../../utils/styleUtils";

interface BuilderDropdownProps {
  field: DropdownField;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderDropdown({
  field,
  isSelected,
  activeSubElement,
}: Readonly<BuilderDropdownProps>) {
  const { jsonContent } = useFormBuilder();
  return (
    <BuilderFieldWrapper field={field} isSelected={isSelected} activeSubElement={activeSubElement}>
      <div className="space-y-0.5">
        {field.label && (
          <label
            htmlFor={field.id}
            className={`block text-xs font-medium text-gray-700 ${isSelected && activeSubElement === 'label' ? 'ring-1 ring-primary ring-offset-1' : ''}`}
            style={getLabelStyles(field.style)}
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          id={field.id}
          name={field.name}
          required={field.required}
          disabled
          className={`w-full px-2 py-1 text-xs border border-gray-300 rounded-md bg-white text-gray-900 transition-all duration-200 pointer-events-none outline-none ${isSelected && ['input', 'placeholder'].includes(activeSubElement || '') ? 'ring-1 ring-primary ring-offset-1' : ''}`}
          style={getInputStyles(field.style)}
        >
          {field.placeholder && (
            <option value="">{field.placeholder}</option>
          )}
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {field.helpText && (
          <p
            className={`text-[9px] text-gray-500 ${isSelected && activeSubElement === 'help' ? 'ring-1 ring-primary ring-offset-1' : ''}`}
            style={getHelpTextStyles(field.style, jsonContent.formSettings.settings)}
          >
            {field.helpText}
          </p>
        )}
      </div>
    </BuilderFieldWrapper>
  );
}
