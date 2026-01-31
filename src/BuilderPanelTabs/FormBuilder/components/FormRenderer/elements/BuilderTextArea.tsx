/**
 * BuilderTextArea
 * A React component that renders a textarea input field within a form builder.
 * Supports labels, placeholders, help text, rows, and validation.
 */

import { TextAreaField } from "../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";
import { useFormBuilder } from "../../../context";
import { getInputStyles, getLabelStyles, getHelpTextStyles } from "../../../utils/styleUtils";
import { PlaceholderStyles } from "./PlaceholderStyles";

interface BuilderTextAreaProps {
  field: TextAreaField;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderTextArea({
  field,
  isSelected,
  activeSubElement,
}: Readonly<BuilderTextAreaProps>) {
  const { jsonContent } = useFormBuilder();
  return (
    <BuilderFieldWrapper field={field}>
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
        <textarea
          id={field.id}
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
          readOnly
          rows={field.rows || 3}
          cols={field.cols}
          maxLength={field.maxLength}
          className={`w-full px-2 py-1 text-xs border border-gray-300 rounded-md bg-white text-gray-900 resize-y transition-all duration-200 pointer-events-none outline-none ${isSelected && ['input', 'placeholder'].includes(activeSubElement || '') ? 'ring-1 ring-primary ring-offset-1' : ''}`}
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
