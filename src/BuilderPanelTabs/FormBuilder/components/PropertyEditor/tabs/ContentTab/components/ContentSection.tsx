import React from "react";
import { Field, LabeledField, InputField, EmailField, PhoneField, UrlField, TextAreaField, NumberField, CheckboxField, ButtonField, HeadingField, FieldType, ButtonAction } from "../../../../../types";
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
                        className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
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
                        className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
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
                            value={(field as ButtonField).action || ButtonAction.SUBMIT}
                            onChange={(e) => handleUpdate("action", e.target.value)}
                            className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value={ButtonAction.SUBMIT}>Submit Form</option>
                            <option value={ButtonAction.RESET}>Reset Form</option>
                            <option value={ButtonAction.OPEN_URL}>Open URL</option>
                            <option value={ButtonAction.SCROLL_TO_ELEMENT}>Scroll to Element</option>
                        </select>
                    </div>

                    {/* Target URL Input */}
                    {(field as ButtonField).action === ButtonAction.OPEN_URL && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Target URL</label>
                            <input
                                type="url"
                                placeholder="https://example.com"
                                value={(field as ButtonField).targetUrl || ""}
                                onChange={(e) => handleUpdate("targetUrl", e.target.value)}
                                className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    )}





                    {/* Scroll Target Input */}
                    {(field as ButtonField).action === ButtonAction.SCROLL_TO_ELEMENT && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Element ID</label>
                            <input
                                type="text"
                                placeholder="e.g. heading_1"
                                value={(field as ButtonField).scrollToElement || ""}
                                onChange={(e) => handleUpdate("scrollToElement", e.target.value)}
                                className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <p className="text-[10px] text-gray-500">Enter the ID of the element to scroll to.</p>
                        </div>
                    )}
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
                        className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
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
                        className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            )}

            {/* Number Field Options */}
            {field.type === "number" && (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700 my-2 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Min Value</label>
                            <input
                                type="number"
                                value={(field as NumberField).min ?? ""}
                                onChange={(e) => handleUpdate("min", e.target.value === "" ? undefined : Number(e.target.value))}
                                className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Max Value</label>
                            <input
                                type="number"
                                value={(field as NumberField).max ?? ""}
                                onChange={(e) => handleUpdate("max", e.target.value === "" ? undefined : Number(e.target.value))}
                                className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Step Size</label>
                        <input
                            type="number"
                            step="any"
                            value={(field as NumberField).step ?? ""}
                            onChange={(e) => handleUpdate("step", e.target.value === "" ? undefined : Number(e.target.value))}
                            className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
            )}

            {/* Image Caption */}
            {field.type === "image" && (
                <div className="space-y-1 pt-2 border-t border-gray-200 dark:border-gray-700 my-2">
                    <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Caption</label>
                    <input
                        type="text"
                        placeholder="Add a caption..."
                        value={(field as any).caption || ""}
                        onChange={(e) => handleUpdate("caption", e.target.value)}
                        className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-[9px] text-gray-500">Displayed below the image with help text styling.</p>
                </div>
            )}

            {/* Date Format */}
            {
                field.type === "date" && (
                    <div className="space-y-1 pt-1">
                        <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Date Format</label>
                        <select
                            value={(field as any).format || ""}
                            onChange={(e) => {
                                handleUpdate("format", e.target.value);
                                handleUpdate("placeholder", e.target.value);
                            }}
                            className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Default (Browser)</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                    </div>
                )
            }

            {/* Time Format */}
            {
                field.type === "time" && (
                    <div className="space-y-1 pt-1">
                        <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Time Format</label>
                        <select
                            value={(field as any).format || ""}
                            onChange={(e) => handleUpdate("format", e.target.value)}
                            className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Default (Browser)</option>
                            <option value="12h">12-hour (AM/PM)</option>
                            <option value="24h">24-hour</option>
                        </select>
                    </div>
                )
            }

            {/* Checkbox Selection Mode */}
            {
                field.type === "checkbox" && (
                    <div className="space-y-1 pt-1">
                        <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Selection Mode</label>
                        <select
                            value={(field as CheckboxField).selectionMode || "multi"}
                            onChange={(e) => handleUpdate("selectionMode", e.target.value)}
                            className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="multi">Multi Select (Checkboxes)</option>
                            <option value="single">Single Select (Radio-style)</option>
                        </select>
                    </div>
                )
            }
        </>
    );
};
