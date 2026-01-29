/**
 * BuilderNumber
 * A React component that renders a number input field within a form builder.
 * Supports labels, placeholders, help text, min/max values, and validation.
 */

import { NumberField } from "../../../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";
import { getInputStyles, getLabelStyles, getHelpTextStyles } from "../../../utils/styleUtils";
import { PlaceholderStyles } from "./PlaceholderStyles";

interface BuilderNumberProps {
  field: NumberField;
}

export default function BuilderNumber({ field }: Readonly<BuilderNumberProps>) {
  return (
    <BuilderFieldWrapper field={field}>
      <PlaceholderStyles fieldId={field.id} style={field.style} />
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
        <input
          type="number"
          id={field.id}
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
          readOnly
          min={field.min}
          max={field.max}
          step={field.step}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 transition-all duration-200 pointer-events-none outline-none"
          style={getInputStyles(field.style)}
        />
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
