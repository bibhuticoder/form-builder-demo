import React, { useState } from "react";
import { Field } from "../../../../../types";
import { ColorControl } from "../../../components/ColorControl";

interface TypographySectionProps {
    field: Field;
    capabilities: any;
    getStyleValue: (key: string, defaultValue?: string | number) => string | number;
    handleStyleUpdate: (key: string, value: string | number | undefined) => void;
    setActiveSubElement: (element: string) => void;
}

export const TypographySection: React.FC<TypographySectionProps> = ({
    field,
    capabilities,
    getStyleValue,
    handleStyleUpdate,
    setActiveSubElement
}) => {
    const [activeTypographyTab, setActiveTypographyTab] = useState<"input" | "label" | "placeholder" | "help">(
        capabilities.supportsInputStyles ? "input" :
            capabilities.supportsLabelStyles ? "label" : "input"
    );

    return (
        <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Typography</h4>

            {/* Typography Sub-tabs */}
            {/* Only show tabs if more than one typography option is available */}
            {(() => {
                const typographyOptionsCount = [
                    capabilities.supportsInputStyles,
                    capabilities.supportsLabelStyles,
                    capabilities.supportsPlaceholderStyles,
                    capabilities.supportsHelpStyles
                ].filter(Boolean).length;

                return typographyOptionsCount > 1 ? (
                    <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded">
                        {capabilities.supportsInputStyles && (
                            <button
                                onClick={() => {
                                    setActiveTypographyTab("input");
                                    setActiveSubElement("input");
                                }}
                                className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded transition-colors ${activeTypographyTab === "input"
                                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                Input
                            </button>
                        )}
                        {capabilities.supportsLabelStyles && (
                            <button
                                onClick={() => {
                                    setActiveTypographyTab("label");
                                    setActiveSubElement("label");
                                }}
                                className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded transition-colors ${activeTypographyTab === "label"
                                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                Label
                            </button>
                        )}
                        {capabilities.supportsPlaceholderStyles && (
                            <button
                                onClick={() => {
                                    setActiveTypographyTab("placeholder");
                                    setActiveSubElement("placeholder");
                                }}
                                className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded transition-colors ${activeTypographyTab === "placeholder"
                                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                Placeholder
                            </button>
                        )}
                        {capabilities.supportsHelpStyles && (
                            <button
                                onClick={() => {
                                    setActiveTypographyTab("help");
                                    setActiveSubElement("help");
                                }}
                                className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded transition-colors ${activeTypographyTab === "help"
                                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                    }`}
                            >
                                Help
                            </button>
                        )}
                    </div>
                ) : null;
            })()}

            {/* Typography Controls */}
            <div className="space-y-4">
                {/* Font Family */}
                <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Font Family</label>
                    <select
                        value={getStyleValue(`${activeTypographyTab}FontFamily`, "default")}
                        onChange={(e) => handleStyleUpdate(`${activeTypographyTab}FontFamily`, e.target.value === "default" ? "" : e.target.value)}
                        className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="default">Default</option>
                        <option value="inter">Inter</option>
                        <option value="roboto">Roboto</option>
                        <option value="playfair">Playfair Display</option>
                        <option value="lora">Lora</option>
                        <option value="mono">JetBrains Mono</option>
                    </select>
                </div>

                {/* Font Size and Weight */}
                <div className="grid grid-cols-2 gap-1 w-full">
                    <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Size</label>
                        <div className="flex">
                            <input
                                type="number"
                                value={getStyleValue(`${activeTypographyTab}FontSize`, activeTypographyTab === "help" ? 12 : 14)}
                                onChange={(e) => handleStyleUpdate(`${activeTypographyTab}FontSize`, e.target.value)}
                                className="flex-1 px-2 py-1.5 w-[75px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-l-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary border-r-0"
                                placeholder="14"
                            />
                            <select
                                value={getStyleValue(`${activeTypographyTab}FontSizeUnit`, "px")}
                                onChange={(e) => handleStyleUpdate(`${activeTypographyTab}FontSizeUnit`, e.target.value)}
                                className="w-12 px-1 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-r-md text-[10px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="px">px</option>
                                <option value="rem">rem</option>
                                <option value="em">em</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Weight</label>
                        <select
                            value={getStyleValue(`${activeTypographyTab}FontWeight`, "normal")}
                            onChange={(e) => handleStyleUpdate(`${activeTypographyTab}FontWeight`, e.target.value)}
                            className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="light">Light</option>
                            <option value="normal">Normal</option>
                            <option value="medium">Medium</option>
                            <option value="semibold">Semi Bold</option>
                            <option value="bold">Bold</option>
                        </select>
                    </div>
                </div>

                {/* Text Alignment (for input only) */}
                {activeTypographyTab === "input" && (
                    <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Text Alignment</label>
                        <select
                            value={getStyleValue("textAlign", "left")}
                            onChange={(e) => handleStyleUpdate("textAlign", e.target.value)}
                            className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                        </select>
                    </div>
                )}

                {/* Color */}
                <ColorControl
                    label={`${activeTypographyTab.charAt(0).toUpperCase() + activeTypographyTab.slice(1)} Color`}
                    value={String(getStyleValue(`${activeTypographyTab}Color`, activeTypographyTab === "label" ? "#A3A3A3" : activeTypographyTab === "placeholder" ? "#9ca3af" : activeTypographyTab === "help" ? "#64748b" : "#000000"))}
                    onChange={(c) => handleStyleUpdate(`${activeTypographyTab}Color`, c)}
                />
            </div>
        </div>
    );
};
