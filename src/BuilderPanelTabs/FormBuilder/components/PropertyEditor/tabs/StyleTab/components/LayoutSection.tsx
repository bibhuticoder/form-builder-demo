import React, { useState } from "react";
import { Field } from "../../../../../types";
import { SpacingControl } from "../../../components/SpacingControl";

interface LayoutSectionProps {
    field: Field;
    capabilities: any;
    getStyleValue: (key: string, defaultValue?: string | number) => string | number;
    handleStyleUpdate: (key: string, value: string | number | undefined) => void;
    handleStyleBatchUpdate: (updates: Record<string, string | number | undefined>) => void;
    setActiveSubElement: (element: string) => void;
}

export const LayoutSection: React.FC<LayoutSectionProps> = ({
    field,
    capabilities,
    getStyleValue,
    handleStyleUpdate,
    handleStyleBatchUpdate,
    setActiveSubElement
}) => {
    const [activeSpacingTab, setActiveSpacingTab] = useState<"input" | "window">(
        capabilities.supportsInputStyles ? "input" : "window"
    );

    return (
        <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Layout</h4>

            <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Width</label>
                <select
                    value={getStyleValue("width", "full")}
                    onChange={(e) => handleStyleUpdate("width", e.target.value)}
                    className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="full">Full Width (100%)</option>
                    <option value="three-quarters">Three Quarters (75%)</option>
                    <option value="half">Half Width (50%)</option>
                    <option value="third">One Third (33%)</option>
                    <option value="quarter">One Quarter (25%)</option>
                </select>
            </div>

            {/* Spacing Sub-tabs */}
            <div className="space-y-3">
                {/* Only show tabs if both input and window styles are supported */}
                {capabilities.supportsInputStyles && capabilities.supportsWindowStyles && (
                    <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded">
                        <button
                            onClick={() => {
                                setActiveSpacingTab("input");
                                setActiveSubElement("input");
                            }}
                            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${activeSpacingTab === "input"
                                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`}
                        >
                            Input
                        </button>
                        <button
                            onClick={() => {
                                setActiveSpacingTab("window");
                                setActiveSubElement("window");
                            }}
                            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${activeSpacingTab === "window"
                                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`}
                        >
                            Window
                        </button>
                    </div>
                )}

                {activeSpacingTab === "input" && (
                    <div className="space-y-4">
                        <SpacingControl
                            label="Margin"
                            values={{
                                top: getStyleValue("inputMarginTop"),
                                right: getStyleValue("inputMarginRight"),
                                bottom: getStyleValue("inputMarginBottom"),
                                left: getStyleValue("inputMarginLeft"),
                            }}
                            onChange={handleStyleUpdate}
                            onBatchChange={handleStyleBatchUpdate}
                            prefix="inputMargin"
                        />
                        <SpacingControl
                            label="Padding"
                            values={{
                                top: getStyleValue("inputPaddingTop"),
                                right: getStyleValue("inputPaddingRight"),
                                bottom: getStyleValue("inputPaddingBottom"),
                                left: getStyleValue("inputPaddingLeft"),
                            }}
                            onChange={handleStyleUpdate}
                            onBatchChange={handleStyleBatchUpdate}
                            prefix="inputPadding"
                        />
                    </div>
                )}

                {activeSpacingTab === "window" && (
                    <div className="space-y-4">
                        <SpacingControl
                            label="Margin"
                            values={{
                                top: getStyleValue("windowMarginTop"),
                                right: getStyleValue("windowMarginRight"),
                                bottom: getStyleValue("windowMarginBottom"),
                                left: getStyleValue("windowMarginLeft"),
                            }}
                            onChange={handleStyleUpdate}
                            onBatchChange={handleStyleBatchUpdate}
                            prefix="windowMargin"
                        />
                        <SpacingControl
                            label="Padding"
                            values={{
                                top: getStyleValue("windowPaddingTop"),
                                right: getStyleValue("windowPaddingRight"),
                                bottom: getStyleValue("windowPaddingBottom"),
                                left: getStyleValue("windowPaddingLeft"),
                            }}
                            onChange={handleStyleUpdate}
                            onBatchChange={handleStyleBatchUpdate}
                            prefix="windowPadding"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
