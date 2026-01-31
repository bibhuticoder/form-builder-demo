/**
 * BuilderCheckbox
 * A React component that renders a checkbox field within a form builder.
 * Supports single or multi-selection modes, labels, help text, and validation.
 */

import { CheckboxField } from "../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";
import { useFormBuilder } from "../../../context";
import { getHelpTextStyles } from "../../../utils/styleUtils";

interface BuilderCheckboxProps {
  field: CheckboxField;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderCheckbox({
  field,
  isSelected,
  activeSubElement,
}: Readonly<BuilderCheckboxProps>) {
  const { jsonContent } = useFormBuilder();
  return (
    <BuilderFieldWrapper field={field}>
      <div className="space-y-1">
        {field.label && (
          <label className={`block text-xs font-medium text-gray-700 ${isSelected && activeSubElement === 'label' ? 'ring-1 ring-primary ring-offset-1' : ''}`}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className={`space-y-1 ${isSelected && ['input', 'options'].includes(activeSubElement || '') ? 'ring-1 ring-primary ring-offset-1 rounded p-1' : ''}`}>
          {field.options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="checkbox"
                id={`${field.id}_${option.value}`}
                name={field.name}
                value={option.value}
                required={
                  field.required && field.selectionMode === "single"
                }
                disabled={true} // Always disabled in builder
                className="appearance-none w-3.5 h-3.5 bg-white border border-gray-900 rounded checked:bg-primary checked:border-primary outline-none transition-colors"
              />
              <label
                htmlFor={`${field.id}_${option.value}`}
                className="ml-2 text-xs text-gray-700"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
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
