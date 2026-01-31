/**
 * BuilderNumber
 * A React component that renders a number input field within a form builder.
 * Supports labels, placeholders, help text, min/max values, and validation.
 */

import { NumberField } from "../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";
import { useFormBuilder } from "../../../context";
import { getHelpTextStyles } from "../../../utils/styleUtils";
import { getInputStyles, getLabelStyles } from "../../../utils/styleUtils";
import { PlaceholderStyles } from "./PlaceholderStyles";

interface BuilderNumberProps {
  field: NumberField;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderNumber({ field, isSelected, activeSubElement }: Readonly<BuilderNumberProps>) {
  const { jsonContent } = useFormBuilder();
  return (
    <BuilderFieldWrapper field={field} isSelected={isSelected} activeSubElement={activeSubElement}>
      <PlaceholderStyles fieldId={field.id} style={field.style} />
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
          className={`w-full px-2 py-1 text-xs border border-gray-300 rounded-md bg-white text-gray-900 transition-all duration-200 pointer-events-none outline-none ${isSelected && ['input', 'placeholder'].includes(activeSubElement || '') ? 'ring-1 ring-primary ring-offset-1' : ''}`}
          style={getInputStyles(field.style)}
        />
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
