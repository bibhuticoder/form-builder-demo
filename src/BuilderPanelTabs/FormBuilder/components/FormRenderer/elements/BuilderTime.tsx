/**
 * BuilderTime
 * A React component that renders a time input field within a form builder.
 * Supports labels, placeholders, help text, and validation.
 */

import { TimeField } from "../../../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";

interface BuilderTimeProps {
  field: TimeField;
}

export default function BuilderTime({ field }: Readonly<BuilderTimeProps>) {
  return (
    <BuilderFieldWrapper field={field}>
      <div className="space-y-1">
        {field.label && (
          <label
            htmlFor={field.id}
            className="block text-sm font-medium text-gray-700"
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          type="time"
          id={field.id}
          name={field.name}
          required={field.required}
          disabled={field.disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900"
        />
        {field.helpText && (
          <p className="text-xs text-gray-500">
            {field.helpText}
          </p>
        )}
      </div>
    </BuilderFieldWrapper>
  );
}
