import React from "react";
import { EmailBlock } from "../../../../../types";
import { BlockStyleCapabilities } from "../../../../../types/block-capabilities";
import { ColorControl } from "../../../components/ColorControl";
import { SpacingControl } from "../../../components/SpacingControl";

interface DecorationSectionProps {
    block: EmailBlock;
    capabilities: BlockStyleCapabilities;
    getStyleValue: (key: string, defaultValue?: string | number) => string | number | undefined;
    handleStyleUpdate: (key: string, value: string | number | undefined) => void;
    handleStyleBatchUpdate: (updates: Record<string, string | number | undefined>) => void;
    setActiveSubElement: (element: string | null) => void;
    defaultBgColor?: string;
}

export const DecorationSection: React.FC<DecorationSectionProps> = ({
    block: _block,
    capabilities,
    getStyleValue,
    handleStyleUpdate,
    handleStyleBatchUpdate,
    setActiveSubElement: _setActiveSubElement,
    defaultBgColor
}) => {
    return (
        <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Decoration</h4>

            <div className="space-y-4">
                {/* Background Color */}
                {capabilities.supportsBackgroundColor && (
                    <ColorControl
                        label="Background Color"
                        value={String(getStyleValue("backgroundColor", ""))}
                        onChange={(c) => handleStyleUpdate("backgroundColor", c)}
                        defaultColor={defaultBgColor}
                    />
                )}

                {/* Border */}
                {capabilities.supportsBorder && (
                    <>
                        {/* Border Style */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Border Style</label>
                            <select
                                value={String(getStyleValue("borderStyle", "none"))}
                                onChange={(e) => handleStyleUpdate("borderStyle", e.target.value)}
                                className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="none">None</option>
                                <option value="solid">Solid</option>
                                <option value="dashed">Dashed</option>
                                <option value="dotted">Dotted</option>
                            </select>
                        </div>

                        {/* Border Width + Color side by side */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Border Width</label>
                                <input
                                    type="number"
                                    value={getStyleValue("borderWidth", 1)}
                                    onChange={(e) => handleStyleUpdate("borderWidth", e.target.value)}
                                    className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="1"
                                    min={0}
                                />
                            </div>
                            <ColorControl
                                label="Border Color"
                                value={String(getStyleValue("borderColor", "#e5e7eb"))}
                                onChange={(c) => handleStyleUpdate("borderColor", c)}
                            />
                        </div>

                        {/* Border Radius */}
                        <SpacingControl
                            label="Border Radius"
                            keyMapping={{
                                top: "borderTopLeftRadius",
                                right: "borderTopRightRadius",
                                bottom: "borderBottomRightRadius",
                                left: "borderBottomLeftRadius",
                            }}
                            onChange={handleStyleUpdate}
                            onBatchChange={handleStyleBatchUpdate}
                            values={{
                                top: getStyleValue("borderTopLeftRadius", 0),
                                right: getStyleValue("borderTopRightRadius", 0),
                                bottom: getStyleValue("borderBottomRightRadius", 0),
                                left: getStyleValue("borderBottomLeftRadius", 0),
                            }}
                        />
                    </>
                )}

                {/* Padding */}
                {capabilities.supportsPadding && (
                    <SpacingControl
                        label="Padding"
                        values={{
                            top: getStyleValue("paddingTop"),
                            right: getStyleValue("paddingRight"),
                            bottom: getStyleValue("paddingBottom"),
                            left: getStyleValue("paddingLeft"),
                        }}
                        onChange={handleStyleUpdate}
                        onBatchChange={handleStyleBatchUpdate}
                        prefix="padding"
                    />
                )}

                {/* Margin */}
                {capabilities.supportsMargin && (
                    <SpacingControl
                        label="Margin"
                        values={{
                            top: getStyleValue("marginTop"),
                            right: getStyleValue("marginRight"),
                            bottom: getStyleValue("marginBottom"),
                            left: getStyleValue("marginLeft"),
                        }}
                        onChange={handleStyleUpdate}
                        onBatchChange={handleStyleBatchUpdate}
                        prefix="margin"
                    />
                )}
            </div>
        </div>
    );
};
