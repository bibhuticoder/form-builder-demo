import React, { useState } from "react";
import { Field } from "../../../../../types";
import { ColorControl } from "../../../components/ColorControl";
import { SpacingControl } from "../../../components/SpacingControl";

interface DecorationSectionProps {
    field: Field;
    capabilities: any;
    getStyleValue: (key: string, defaultValue?: string | number) => string | number;
    handleStyleUpdate: (key: string, value: string | number | undefined) => void;
    handleStyleBatchUpdate: (updates: Record<string, string | number | undefined>) => void;
    setActiveSubElement: (element: string) => void;
}

export const DecorationSection: React.FC<DecorationSectionProps> = ({
    capabilities,
    getStyleValue,
    handleStyleUpdate,
    handleStyleBatchUpdate,
    setActiveSubElement
}) => {
    const [activeDecorationTab, setActiveDecorationTab] = useState<"input" | "window">(
        capabilities.supportsInputStyles ? "input" : "window"
    );

    return (
        <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Decoration</h4>

            {/* Decoration Sub-tabs */}
            {/* Only show tabs if both input and window styles are supported */}
            {capabilities.supportsInputStyles && capabilities.supportsWindowStyles && (
                <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded">
                    <button
                        onClick={() => {
                            setActiveDecorationTab("input");
                            setActiveSubElement("input");
                        }}
                        className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${activeDecorationTab === "input"
                            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                    >
                        Input
                    </button>
                    <button
                        onClick={() => {
                            setActiveDecorationTab("window");
                            setActiveSubElement("window");
                        }}
                        className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${activeDecorationTab === "window"
                            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                    >
                        Window
                    </button>
                </div>
            )}

            {/* Decoration Controls */}
            <div className="space-y-4">
                {/* Background Color */}
                <ColorControl
                    label="Background"
                    value={String(getStyleValue(`${activeDecorationTab}BackgroundColor`, activeDecorationTab === "input" ? "#ffffff" : "#f9fafb"))}
                    onChange={(c) => handleStyleUpdate(`${activeDecorationTab}BackgroundColor`, c)}
                />

                {/* Border Style */}
                <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Border Style</label>
                    <select
                        value={getStyleValue(`${activeDecorationTab}BorderStyle`, "solid")}
                        onChange={(e) => handleStyleUpdate(`${activeDecorationTab}BorderStyle`, e.target.value)}
                        className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="none">None</option>
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                    </select>
                </div>

                {/* Border Width and Color */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Border Width</label>
                        <input
                            type="number"
                            value={getStyleValue(`${activeDecorationTab}BorderWidth`, 1)}
                            onChange={(e) => handleStyleUpdate(`${activeDecorationTab}BorderWidth`, e.target.value)}
                            className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="1"
                        />
                    </div>
                    <div className="space-y-1">
                        <ColorControl
                            label="Border Color"
                            value={String(getStyleValue(`${activeDecorationTab}BorderColor`, "#e5e7eb"))}
                            onChange={(c) => handleStyleUpdate(`${activeDecorationTab}BorderColor`, c)}
                        />
                    </div>
                </div>

                {/* Border Radius */}
                <SpacingControl
                    label="Border Radius"
                    keyMapping={{
                        top: `${activeDecorationTab}BorderTopLeftRadius`,
                        right: `${activeDecorationTab}BorderTopRightRadius`,
                        bottom: `${activeDecorationTab}BorderBottomRightRadius`,
                        left: `${activeDecorationTab}BorderBottomLeftRadius`,
                    }}
                    onChange={handleStyleUpdate}
                    onBatchChange={handleStyleBatchUpdate}
                    // Default border radius 4 for inputs/windows if not set
                    values={{
                        top: getStyleValue(`${activeDecorationTab}BorderTopLeftRadius`, 4),
                        right: getStyleValue(`${activeDecorationTab}BorderTopRightRadius`, 4),
                        bottom: getStyleValue(`${activeDecorationTab}BorderBottomRightRadius`, 4),
                        left: getStyleValue(`${activeDecorationTab}BorderBottomLeftRadius`, 4),
                    }}
                />

                {/* Margin */}
                <SpacingControl
                    label="Margin"
                    values={{
                        top: getStyleValue(`${activeDecorationTab}MarginTop`),
                        right: getStyleValue(`${activeDecorationTab}MarginRight`),
                        bottom: getStyleValue(`${activeDecorationTab}MarginBottom`),
                        left: getStyleValue(`${activeDecorationTab}MarginLeft`),
                    }}
                    onChange={handleStyleUpdate}
                    onBatchChange={handleStyleBatchUpdate}
                    prefix={`${activeDecorationTab}Margin`}
                />

                {/* Padding */}
                <SpacingControl
                    label="Padding"
                    values={{
                        top: getStyleValue(`${activeDecorationTab}PaddingTop`),
                        right: getStyleValue(`${activeDecorationTab}PaddingRight`),
                        bottom: getStyleValue(`${activeDecorationTab}PaddingBottom`),
                        left: getStyleValue(`${activeDecorationTab}PaddingLeft`),
                    }}
                    onChange={handleStyleUpdate}
                    onBatchChange={handleStyleBatchUpdate}
                    prefix={`${activeDecorationTab}Padding`}
                />
            </div>
        </div>
    );
};
