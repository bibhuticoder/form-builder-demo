/**
 * BuilderUpload
 * A React component that renders a file upload field within a form builder.
 * Supports labels, help text, accepted file types, max file size, and validation.
 */

import { UploadField } from "../../../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";

interface BuilderUploadProps {
  field: UploadField;
}

export default function BuilderUpload({ field }: Readonly<BuilderUploadProps>) {
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
          type="file"
          id={field.id}
          name={field.name}
          required={field.required}
          disabled={field.disabled}
          accept={field.acceptedFileTypes?.join(",")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
        />
        {field.helpText && (
          <p className="text-xs text-gray-500">
            {field.helpText}
          </p>
        )}
        {field.maxFileSize && (
          <p className="text-xs text-gray-500">
            Max file size: {(field.maxFileSize / 1024 / 1024).toFixed(2)}MB
          </p>
        )}
      </div>
    </BuilderFieldWrapper>
  );
}
