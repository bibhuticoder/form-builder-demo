import React from "react";
import { Field, LabeledField, InputField, EmailField, PhoneField, UrlField, TextAreaField, NumberField, CheckboxField, ButtonField, HeadingField, FieldType } from "../../../../../types";
import { stripHtmlTags, reconstructHtmlWithLinks } from "../../../utils/htmlUtils";

interface ContentSectionProps {
    field: Field;
    capabilities: any;
    handleUpdate: (key: string, value: unknown) => void;
}

export const ContentSection: React.FC<ContentSectionProps> = ({ field, capabilities, handleUpdate }) => {
    const showLabel = capabilities.hasLabel;
    const showPlaceholder = capabilities.hasPlaceholder;

    // Check if field supports HTML links
    const supportsLinks = field.type === FieldType.HEADING || field.type === FieldType.PARAGRAPH;
    const fieldLabel = (field as LabeledField).label || "";

    return (
        <>
            {/* Label / Content Field */}
            {showLabel && (
                <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">
                        {["heading", "paragraph"].includes(field.type) ? "Content" : "Label"}
                    </label>
                    <input
                        type="text"
                        value={supportsLinks ? stripHtmlTags(fieldLabel) : fieldLabel}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            const finalValue = supportsLinks ? reconstructHtmlWithLinks(newValue, fieldLabel) : newValue;
                            handleUpdate("label", finalValue);
                        }}
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
                        className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
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
                            className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
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

            {/* Checkbox Selection Mode */}
            {field.type === "checkbox" && (
                <div className="space-y-1 pt-1">
                    <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Selection Mode</label>
                    <select
                        value={(field as CheckboxField).selectionMode || "multi"}
                        onChange={(e) => handleUpdate("selectionMode", e.target.value)}
                        className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="multi">Multi Select (Checkboxes)</option>
                        <option value="single">Single Select (Radio-style)</option>
                    </select>
                </div>
            )}
        </>
    );
};
