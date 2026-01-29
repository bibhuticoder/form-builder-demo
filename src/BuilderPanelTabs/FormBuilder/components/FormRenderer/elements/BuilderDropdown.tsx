/**
 * BuilderDropdown
 * A React component that renders a dropdown/select field within a form builder.
 * Supports labels, placeholders, help text, options, and validation.
 */

import { DropdownField } from "../../../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";
import { getInputStyles, getLabelStyles, getHelpTextStyles } from "../../../utils/styleUtils";

interface BuilderDropdownProps {
  field: DropdownField;
}

export default function BuilderDropdown({
  field,
}: Readonly<BuilderDropdownProps>) {
  return (
    <BuilderFieldWrapper field={field}>
      <div className="space-y-0.5">
        {field.label && (
          <label
            htmlFor={field.id}
            className="block text-xs font-medium text-gray-700"
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
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 transition-all duration-200 pointer-events-none outline-none"
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
            className="text-[10px] text-gray-500"
            style={getHelpTextStyles(field.style)}
          >
            {field.helpText}
          </p>
        )}
      </div>
    </BuilderFieldWrapper>
  );
}
