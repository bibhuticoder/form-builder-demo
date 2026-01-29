import React from "react";
import { Field, LabeledField, InputField, EmailField, PhoneField, UrlField, TextAreaField, NumberField, CheckboxField, RadioField, DropdownField, ButtonField, HeadingField, ImageField, VideoField } from "../../../../../types";
import { useFormBuilder } from "../../../context";
import { Button } from "../../../../../components";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getFieldCapabilities } from "../../../../../types/field-capabilities";

interface ContentTabProps {
  field: Field;
}

// Helper to slugify text
const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

export const ContentTab: React.FC<ContentTabProps> = ({ field }) => {
  const { updateField } = useFormBuilder();

  const handleUpdate = (key: string, value: unknown) => {
    const updates: Partial<Field> = { [key]: value } as Partial<Field>;
    
    // Auto-generate name from label if not customized
    if (key === "label" && !(field as InputField & { isNameCustomized?: boolean }).isNameCustomized) {
      (updates as Partial<InputField>).name = slugify(value as string);
    }
    
    updateField(field.id, updates);
  };

  const capabilities = getFieldCapabilities(field.type);
  const showLabel = capabilities.hasLabel;
  const showPlaceholder = capabilities.hasPlaceholder;
  const showRequired = capabilities.hasRequired;
  const showHelpText = capabilities.hasHelpText;
  const showOptions = capabilities.hasOptions;

  return (
    <div className="space-y-3">
      {/* Label / Content Field */}
      {showLabel && (
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">
            {["heading", "paragraph"].includes(field.type) ? "Content" : "Label"}
          </label>
          <input
            type="text"
            value={(field as LabeledField).label || ""}
            onChange={(e) => handleUpdate("label", e.target.value)}
            className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      {/* Heading Level */}
      {field.type === "heading" && (
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Heading Level</label>
          <select
            value={(field as HeadingField).headingLevel || "h2"}
            onChange={(e) => handleUpdate("headingLevel", e.target.value)}
            className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="h1">H1 (XXL)</option>
            <option value="h2">H2 (XL)</option>
            <option value="h3">H3 (Large)</option>
            <option value="h4">H4 (Medium)</option>
            <option value="h5">H5 (Small)</option>
            <option value="h6">H6 (Tiny)</option>
          </select>
        </div>
      )}

      {/* Button Action */}
      {field.type === "button" && (
        <div className="space-y-4 pt-2 pb-2 border-y border-gray-200 dark:border-gray-700 my-2">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Action</label>
            <select
              value={(field as ButtonField).action || "submit"}
              onChange={(e) => handleUpdate("action", e.target.value)}
              className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="submit">Submit Form</option>
              <option value="url">Open URL</option>
              <option value="scroll">Scroll to Element</option>
            </select>
          </div>
        </div>
      )}

      {/* Placeholder */}
      {showPlaceholder && (
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Placeholder</label>
          <input
            type="text"
            value={(field as InputField | EmailField | PhoneField | UrlField | TextAreaField | NumberField).placeholder || ""}
            onChange={(e) => handleUpdate("placeholder", e.target.value)}
            className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      {/* Textarea Rows */}
      {field.type === "textarea" && (
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Rows</label>
          <input
            type="number"
            min={1}
            value={(field as TextAreaField).rows || 4}
            onChange={(e) => handleUpdate("rows", parseInt(e.target.value) || 1)}
            className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      {/* Required Toggle */}
      {showRequired && (
        <div className="flex items-center justify-between py-2 px-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
          <label className="cursor-pointer text-xs font-medium text-gray-900 dark:text-white" htmlFor="required-toggle">
            Required
          </label>
          <button
            type="button"
            role="switch"
            aria-checked={(field as any).required || false}
            onClick={() => handleUpdate("required", !(field as any).required)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              (field as any).required ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                (field as any).required ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      )}

      {/* Options for checkbox/radio/dropdown */}
      {showOptions && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Options</label>
            <Button
              variant="secondary"
              onClick={() => {
                const newOption = {
                  id: `opt_${Date.now()}`,
                  label: `Option ${(field as CheckboxField | RadioField | DropdownField).options?.length ? (field as CheckboxField | RadioField | DropdownField).options.length + 1 : 1}`,
                  value: `option_${(field as CheckboxField | RadioField | DropdownField).options?.length ? (field as CheckboxField | RadioField | DropdownField).options.length + 1 : 1}`,
                };
                const newOptions = [...((field as CheckboxField | RadioField | DropdownField).options || []), newOption];
                handleUpdate("options", newOptions);
              }}
              className="gap-1 text-xs"
            >
              <PlusIcon className="w-3 h-3" />
              Add Option
            </Button>
          </div>

          <div className="space-y-2">
            {((field as CheckboxField | RadioField | DropdownField).options || []).map((option, index: number) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1 space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={option.label}
                      onChange={(e) => {
                        const newOptions = [...((field as CheckboxField | RadioField | DropdownField).options || [])];
                        newOptions[index] = { ...newOptions[index], label: e.target.value };
                        handleUpdate("options", newOptions);
                      }}
                      placeholder="Label"
                      className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const newOptions = (field as CheckboxField | RadioField | DropdownField).options?.filter((_, i: number) => i !== index);
                        handleUpdate("options", newOptions);
                      }}
                      className="h-10 w-10 shrink-0"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                  <input
                    type="text"
                    value={option.value}
                    onChange={(e) => {
                      const newOptions = [...((field as CheckboxField | RadioField | DropdownField).options || [])];
                      newOptions[index] = { ...newOptions[index], value: e.target.value };
                      handleUpdate("options", newOptions);
                    }}
                    placeholder="Value"
                    className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image/Video URL */}
      {["image", "video"].includes(field.type) && (
        <div className="space-y-4 border-y border-gray-200 dark:border-gray-700 py-3 my-2">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Source URL</label>
            <input
              type="text"
              value={(field as ImageField | VideoField).url || ""}
              onChange={(e) => handleUpdate("url", e.target.value)}
              placeholder={field.type === "video" ? "https://youtube.com/..." : "https://example.com/image.jpg"}
              className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Alt Text</label>
            <input
              type="text"
              value={(field as ImageField | VideoField).altText || ""}
              onChange={(e) => handleUpdate("altText", e.target.value)}
              placeholder="Descriptive text for accessibility"
              className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* Checkbox Selection Mode */}
      {field.type === "checkbox" && (
        <div className="space-y-1 pt-1">
          <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Selection Mode</label>
          <select
            value={(field as CheckboxField).selectionMode || "multi"}
            onChange={(e) => handleUpdate("selectionMode", e.target.value)}
            className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="multi">Multi Select (Checkboxes)</option>
            <option value="single">Single Select (Radio-style)</option>
          </select>
        </div>
      )}

      {/* Help Text */}
      {showHelpText && (
        <>
          <div className="border-t border-gray-200 dark:border-gray-700 my-4" />
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Help Text</label>
            <input
              type="text"
              value={(field as any).helpText || ""}
              onChange={(e) => handleUpdate("helpText", e.target.value)}
              placeholder="Small text below input"
              className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </>
      )}
    </div>
  );
};
