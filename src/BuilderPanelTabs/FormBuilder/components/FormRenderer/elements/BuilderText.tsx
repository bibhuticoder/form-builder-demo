/**
 * BuilderText
 * A React component that renders a text input field within a form builder.
 * Supports labels, placeholders, help text, and validation.
 */

import { TextField } from "../../../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";
import { getInputStyles, getLabelStyles, getHelpTextStyles } from "../../../utils/styleUtils";
import { PlaceholderStyles } from "./PlaceholderStyles";

interface BuilderTextProps {
  field: TextField;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderText({ field, isSelected, activeSubElement }: Readonly<BuilderTextProps>) {
  return (
    <BuilderFieldWrapper field={field} isSelected={isSelected} activeSubElement={activeSubElement}>
      <PlaceholderStyles fieldId={field.id} style={field.style} />
      <div className="space-y-0.5">
        {field.label && (
          <label
            htmlFor={field.id}
            className={`block text-xs font-medium text-gray-700 ${
              isSelected && activeSubElement === 'label' ? 'ring-2 ring-primary ring-offset-2 rounded px-1' : ''
            }`}
            style={getLabelStyles(field.style)}
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          type="text"
          id={field.id}
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
          readOnly
          className={`w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 transition-all duration-200 pointer-events-none outline-none ${
            isSelected && activeSubElement === 'input' ? 'ring-2 ring-primary ring-offset-2' : ''
          }`}
          style={getInputStyles(field.style)}
        />
        {field.helpText && (
          <p 
            className={`text-[10px] text-gray-500 ${
              isSelected && activeSubElement === 'help' ? 'ring-2 ring-primary ring-offset-2 rounded px-1' : ''
            }`}
            style={getHelpTextStyles(field.style)}
          >
            {field.helpText}
          </p>
        )}
      </div>
    </BuilderFieldWrapper>
  );
}
