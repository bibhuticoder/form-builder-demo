import React, { useState, useMemo } from "react";
import { Field, getFieldCapabilities } from "../../../../../types";
import { useFormBuilder } from "../../../context";
import { SpacingControl } from "../components/SpacingControl";
import { ColorControl } from "../components/ColorControl";

interface StyleTabProps {
  field: Field;
}

export const StyleTab: React.FC<StyleTabProps> = ({ field }) => {
  const { updateField, updateFieldStyleBatch, setActiveSubElement } = useFormBuilder();
  
  // Get field capabilities
  const capabilities = useMemo(() => getFieldCapabilities(field.type), [field.type]);
  
  // Set initial tabs based on capabilities
  const [activeSpacingTab, setActiveSpacingTab] = useState<"input" | "window">(
    capabilities.supportsInputStyles ? "input" : "window"
  );
  const [activeTypographyTab, setActiveTypographyTab] = useState<"input" | "label" | "placeholder" | "help">(
    capabilities.supportsInputStyles ? "input" : 
    capabilities.supportsLabelStyles ? "label" : "input"
  );
  const [activeDecorationTab, setActiveDecorationTab] = useState<"input" | "window">(
    capabilities.supportsInputStyles ? "input" : "window"
  );

  const handleStyleUpdate = (key: string, value: string | number | undefined) => {
    updateField(field.id, {
      style: { ...field.style, [key]: value },
    });
  };

  const handleStyleBatchUpdate = (updates: Record<string, string | number | undefined>) => {
    updateFieldStyleBatch(field.id, updates);
  };

  const getStyleValue = (key: string, defaultValue: string | number | undefined = "") => {
    return (field.style as Record<string, string | number | undefined>)?.[key] ?? defaultValue;
  };

  return (
    <div className="space-y-6">
      {/* Layout Section */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Layout</h4>
        
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Width</label>
          <select
            value={getStyleValue("width", "full")}
            onChange={(e) => handleStyleUpdate("width", e.target.value)}
            className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
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
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  activeSpacingTab === "input"
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
                className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  activeSpacingTab === "window"
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

      <div className="border-t border-gray-200 dark:border-gray-700" />

      {/* Typography Section */}
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
                  className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded transition-colors ${
                    activeTypographyTab === "input"
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
                  className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded transition-colors ${
                    activeTypographyTab === "label"
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
                  className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded transition-colors ${
                    activeTypographyTab === "placeholder"
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
                  className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded transition-colors ${
                    activeTypographyTab === "help"
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
                  className="flex-1 px-2 py-1.5 w-[75px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-l-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border-r-0"
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

      <div className="border-t border-gray-200 dark:border-gray-700" />

      {/* Decoration Section */}
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
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeDecorationTab === "input"
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
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeDecorationTab === "window"
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
              className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
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
                className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
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
        </div>
      </div>
    </div>
  );
};
