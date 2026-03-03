import React from "react";
import { EmailBlock } from "../../../../../types";
import { BlockStyleCapabilities } from "../../../../../types/block-capabilities";
import { ColorControl } from "../../../components/ColorControl";

interface TypographySectionProps {
    block: EmailBlock;
    capabilities: BlockStyleCapabilities;
    getStyleValue: (key: string, defaultValue?: string | number) => string | number | undefined;
    handleStyleUpdate: (key: string, value: string | number | undefined) => void;
    setActiveSubElement: (element: string | null) => void;
}

export const TypographySection: React.FC<TypographySectionProps> = ({
    block: _block,
    capabilities,
    getStyleValue,
    handleStyleUpdate,
    setActiveSubElement: _setActiveSubElement
}) => {
    if (!capabilities.supportsTypography) return null;

    return (
        <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Typography</h4>

            <div className="space-y-4">
                {/* Font Family */}
                <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Font Family</label>
                    <select
                        value={String(getStyleValue("fontFamily", "default"))}
                        onChange={(e) => handleStyleUpdate("fontFamily", e.target.value === "default" ? "" : e.target.value)}
                        className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="default">Default</option>
                        <option value="arial">Arial</option>
                        <option value="helvetica">Helvetica</option>
                        <option value="georgia">Georgia</option>
                        <option value="times">Times New Roman</option>
                        <option value="verdana">Verdana</option>
                    </select>
                </div>

                {/* Font Size and Weight */}
                <div className="grid grid-cols-2 gap-1 w-full">
                    <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Size</label>
                        <div className="flex">
                            <input
                                type="number"
                                value={getStyleValue("fontSize", 14)}
                                onChange={(e) => handleStyleUpdate("fontSize", e.target.value)}
                                className="shadow flex-1 px-2 py-1.5 w-[75px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-l-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary border-r-0"
                                placeholder="14"
                            />
                            <select
                                value={String(getStyleValue("fontSizeUnit", "px"))}
                                onChange={(e) => handleStyleUpdate("fontSizeUnit", e.target.value)}
                                className="shadow w-12 px-1 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-r-md text-[10px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
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
                            value={String(getStyleValue("fontWeight", "normal"))}
                            onChange={(e) => handleStyleUpdate("fontWeight", e.target.value)}
                            className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="light">Light</option>
                            <option value="normal">Normal</option>
                            <option value="medium">Medium</option>
                            <option value="semibold">Semi Bold</option>
                            <option value="bold">Bold</option>
                        </select>
                    </div>
                </div>

                {/* Text Alignment */}
                <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Text Align</label>
                    <div className="grid grid-cols-3 gap-1">
                        {["left", "center", "right"].map((align) => (
                            <button
                                key={align}
                                type="button"
                                onClick={() => handleStyleUpdate("textAlign", align)}
                                className={`px-2 py-1.5 rounded-md border text-xs font-medium transition-colors capitalize ${getStyleValue("textAlign", "left") === align
                                    ? "bg-primary text-white border-primary"
                                    : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                                    }`}
                            >
                                {align}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Line Height */}
                <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Line Height</label>
                    <input
                        type="text"
                        value={getStyleValue("lineHeight", "1.5")}
                        onChange={(e) => handleStyleUpdate("lineHeight", e.target.value)}
                        className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="1.5"
                    />
                </div>

                {/* Text Color */}
                <ColorControl
                    label="Color"
                    value={String(getStyleValue("color", "#333333"))}
                    onChange={(c) => handleStyleUpdate("color", c)}
                />
            </div>
        </div>
    );
};
