/**
 * BuilderUpload
 * A React component that renders a file upload field within a form builder.
 * Supports labels, help text, accepted file types, max file size, and validation.
 */

import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { UploadField } from "../../../types";
import BuilderFieldWrapper from "./BuilderFieldWrapper";
import { useFormBuilder } from "../../../context";
import { getHelpTextStyles } from "../../../utils/styleUtils";

interface BuilderUploadProps {
  field: UploadField;
}

export default function BuilderUpload({ field }: Readonly<BuilderUploadProps>) {
  const { jsonContent } = useFormBuilder();
  const labelId = `${field.id}-label`;

  const fileTypes = field.acceptedFileTypes
    ?.map((type) => {
      if (type.includes("/")) {
        return type.split("/")[1]?.toUpperCase() ?? type.toUpperCase();
      }

      return type.replace(".", "").toUpperCase();
    })
    .filter(Boolean);

  const maxSizeMb = field.maxFileSize
    ? Math.round(field.maxFileSize / 1024 / 1024)
    : undefined;

  const typesText =
    fileTypes && fileTypes.length > 0
      ? fileTypes.length > 1
        ? `${fileTypes.slice(0, -1).join(", ")} or ${fileTypes[fileTypes.length - 1]}`
        : fileTypes[0]
      : undefined;
  const helperText = typesText
    ? `${typesText}${maxSizeMb ? ` (max. ${maxSizeMb}MB)` : ""}`
    : maxSizeMb
      ? `Max. ${maxSizeMb}MB`
      : undefined;

  return (
    <BuilderFieldWrapper field={field}>
      <div className="space-y-2">
        {field.label && (
          <label
            id={labelId}
            htmlFor={field.id}
            className="block text-lg font-semibold text-slate-700"
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
          className="sr-only"
          aria-labelledby={labelId}
        />
        <label
          htmlFor={field.id}
          className={
            "grid min-h-[150px] grid-cols-[auto,1fr,auto] items-center gap-6 rounded-xl border-2 border-dashed border-slate-200 bg-white px-6 py-8 transition-colors " +
            (field.disabled
              ? "cursor-not-allowed text-slate-300"
              : "cursor-pointer text-slate-500 hover:border-slate-300")
          }
        >
          <div className="w-full flex justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <ArrowUpTrayIcon
                className="h-6 w-6 text-slate-400"
                aria-hidden="true"
              />
            </span>
          </div>

          <span className="flex mt-2 flex-col items-center gap-1 text-center">
            <span className="text-base font-semibold text-slate-600">
              Click to upload file
            </span>
            {(helperText || field.helpText) && (
              <span
                className="text-xs text-slate-400"
                style={getHelpTextStyles(field.style, jsonContent.formSettings.settings)}
              >
                {helperText || field.helpText}
              </span>
            )}
          </span>
          <span className="h-12 w-12 opacity-0" aria-hidden="true" />
        </label>
      </div>
    </BuilderFieldWrapper>
  );
}
