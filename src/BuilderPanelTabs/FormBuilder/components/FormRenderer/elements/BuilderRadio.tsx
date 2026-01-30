/**
 * BuilderRadio
 * A React component that renders a radio button group field within a form builder.
 * Supports labels, help text, options, and validation.
 */

import { RadioField } from "../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";
import { useFormBuilder } from "../../../context";
import { getHelpTextStyles } from "../../../utils/styleUtils";

interface BuilderRadioProps {
  field: RadioField;
}

export default function BuilderRadio({ field }: Readonly<BuilderRadioProps>) {
  const { jsonContent } = useFormBuilder();
  return (
    <BuilderFieldWrapper field={field}>
      <div className="space-y-1">
        {field.label && (
          <label className="block text-xs font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="space-y-1">
          {field.options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                id={`${field.id}_${option.value}`}
                name={field.name}
                value={option.value}
                required={field.required}
                disabled={true} // Always disabled in builder
                className="appearance-none w-3.5 h-3.5 bg-white border border-gray-900 rounded-full checked:bg-primary checked:border-primary focus:ring-primary outline-none transition-colors"
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
            className="text-[9px] text-gray-500"
            style={getHelpTextStyles(field.style, jsonContent.formSettings.settings)}
          >
            {field.helpText}
          </p>
        )}
      </div>
    </BuilderFieldWrapper>
  );
}
