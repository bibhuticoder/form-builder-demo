/**
 * BuilderDate
 * A React component that renders a date input field within a form builder.
 * Supports labels, placeholders, help text, min/max dates, and validation.
 */

import { DateField } from "../../../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";

interface BuilderDateProps {
  field: DateField;
}

export default function BuilderDate({ field }: Readonly<BuilderDateProps>) {
  return (
    <BuilderFieldWrapper field={field}>
      <div className="space-y-0.5">
        {field.label && (
          <label
            htmlFor={field.id}
            className="block text-xs font-medium text-gray-700"
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          type="date"
          id={field.id}
          name={field.name}
          required={field.required}
          readOnly
          min={field.min}
          max={field.max}
          className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 pointer-events-none outline-none"
        />
        {field.helpText && (
          <p className="text-[10px] text-gray-500">
            {field.helpText}
          </p>
        )}
      </div>
    </BuilderFieldWrapper>
  );
}
