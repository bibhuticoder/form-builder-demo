/**
 * BuilderEmail
 * A React component that renders an email input field within a form builder.
 * Supports labels, placeholders, help text, and email validation.
 */

// Update the import path below to the correct relative path if needed
import { EmailField } from "../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";

interface BuilderEmailProps {
  field: EmailField;
}

export default function BuilderEmail({ field }: Readonly<BuilderEmailProps>) {
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
          id={field.id}
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
          disabled={field.disabled}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
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
