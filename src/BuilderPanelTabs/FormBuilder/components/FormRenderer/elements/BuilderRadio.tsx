/**
 * BuilderRadio
 * A React component that renders a radio button group field within a form builder.
 * Supports labels, help text, options, and validation.
 */

import { RadioField } from "../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";

interface BuilderRadioProps {
  field: RadioField;
}

export default function BuilderRadio({ field }: Readonly<BuilderRadioProps>) {
  return (
    <BuilderFieldWrapper field={field}>
      <div className="space-y-2">
        {field.label && (
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="space-y-2">
          {field.options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                id={`${field.id}_${option.value}`}
                name={field.name}
                value={option.value}
                required={field.required}
                disabled={field.disabled}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <label
                htmlFor={`${field.id}_${option.value}`}
                className="ml-2 text-sm text-gray-700"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
        {field.helpText && (
          <p className="text-xs text-gray-500">
            {field.helpText}
          </p>
        )}
      </div>
    </BuilderFieldWrapper>
  );
}
