/**
 * BuilderUrl
 * A React component that renders a URL input field within a form builder.
 * Supports labels, placeholders, help text, and URL validation.
 */

import { UrlField } from "../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";
import { useFormBuilder } from "../../../context";
import { getInputStyles, getLabelStyles, getHelpTextStyles } from "../../../utils/styleUtils";
import { PlaceholderStyles } from "./PlaceholderStyles";

interface BuilderUrlProps {
  field: UrlField;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderUrl({ field, isSelected, activeSubElement }: Readonly<BuilderUrlProps>) {
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
          type="url"
          id={field.id}
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
          readOnly
          className={`w-full px-2 py-1 text-xs border border-gray-300 rounded-md bg-white text-gray-900 pointer-events-none outline-none ${isSelected && ['input', 'placeholder'].includes(activeSubElement || '') ? 'ring-1 ring-primary ring-offset-1' : ''}`}
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
