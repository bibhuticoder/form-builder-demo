import React, { useState } from "react";
import { Field } from "../../../../../types";
import { useFormBuilder } from "../../../context";
import { SpacingControl } from "../components/SpacingControl";
import { ColorPickerField } from "../components/ColorPickerField";

interface StyleTabProps {
  field: Field;
}

export const StyleTab: React.FC<StyleTabProps> = ({ field }) => {
  const { updateField, updateFieldStyleBatch } = useFormBuilder();
  const [activeSpacingTab, setActiveSpacingTab] = useState<"input" | "window">("input");
  const [activeTypographyTab, setActiveTypographyTab] = useState<"input" | "label" | "placeholder" | "help">("input");
  const [activeDecorationTab, setActiveDecorationTab] = useState<"input" | "window">("input");

  const handleStyleUpdate = (key: string, value: any) => {
    updateField(field.id, {
      style: { ...field.style, [key]: value },
    });
  };

  const handleStyleBatchUpdate = (updates: Record<string, any>) => {
    updateFieldStyleBatch(field.id, updates);
  };

  const getStyleValue = (key: string, defaultValue: any = "") => {
    return field.style?.[key] ?? defaultValue;
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
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded">
            <button
              onClick={() => setActiveSpacingTab("input")}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeSpacingTab === "input"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Input
            </button>
            <button
              onClick={() => setActiveSpacingTab("window")}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeSpacingTab === "window"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Window
            </button>
          </div>

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
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded">
          <button
            onClick={() => setActiveTypographyTab("input")}
            className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded transition-colors ${
              activeTypographyTab === "input"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Input
          </button>
          <button
            onClick={() => setActiveTypographyTab("label")}
            className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded transition-colors ${
              activeTypographyTab === "label"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Label
          </button>
          <button
            onClick={() => setActiveTypographyTab("placeholder")}
            className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded transition-colors ${
              activeTypographyTab === "placeholder"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Placeholder
          </button>
          <button
            onClick={() => setActiveTypographyTab("help")}
            className={`flex-1 px-2 py-1.5 text-[10px] font-medium rounded transition-colors ${
              activeTypographyTab === "help"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Help
          </button>
        </div>

        {/* Typography Controls */}
        <div className="space-y-4">
          {/* Font Family */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Font Family</label>
            <select
              value={getStyleValue(`${activeTypographyTab}FontFamily`, "default")}
              onChange={(e) => handleStyleUpdate(`${activeTypographyTab}FontFamily`, e.target.value === "default" ? "" : e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
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
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Size</label>
              <div className="flex">
                <input
                  type="number"
                  value={getStyleValue(`${activeTypographyTab}FontSize`)}
                  onChange={(e) => handleStyleUpdate(`${activeTypographyTab}FontSize`, e.target.value)}
                  className="flex-1 px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-l-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border-r-0"
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
          <ColorPickerField
            label={`${activeTypographyTab.charAt(0).toUpperCase() + activeTypographyTab.slice(1)} Color`}
            color={getStyleValue(`${activeTypographyTab}Color`, activeTypographyTab === "label" ? "#A3A3A3" : activeTypographyTab === "placeholder" ? "#9ca3af" : activeTypographyTab === "help" ? "#64748b" : "#000000")}
            onChange={(c) => handleStyleUpdate(`${activeTypographyTab}Color`, c)}
          />
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700" />

      {/* Decoration Section */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Decoration</h4>
        
        {/* Decoration Sub-tabs */}
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded">
          <button
            onClick={() => setActiveDecorationTab("input")}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeDecorationTab === "input"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Input
          </button>
          <button
            onClick={() => setActiveDecorationTab("window")}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              activeDecorationTab === "window"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Window
          </button>
        </div>

        {/* Decoration Controls */}
        <div className="space-y-4">
          {/* Background Color */}
          <ColorPickerField
            label="Background"
            color={getStyleValue(`${activeDecorationTab}BackgroundColor`, activeDecorationTab === "input" ? "#ffffff" : "#f9fafb")}
            onChange={(c) => handleStyleUpdate(`${activeDecorationTab}BackgroundColor`, c)}
          />

          {/* Border Style */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Border Style</label>
            <select
              value={getStyleValue(`${activeDecorationTab}BorderStyle`, "solid")}
              onChange={(e) => handleStyleUpdate(`${activeDecorationTab}BorderStyle`, e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="none">None</option>
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
          </div>

          {/* Border Width and Color */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Border Width</label>
              <input
                type="number"
                value={getStyleValue(`${activeDecorationTab}BorderWidth`, "")}
                onChange={(e) => handleStyleUpdate(`${activeDecorationTab}BorderWidth`, e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Border Color</label>
              <div className="flex gap-2 items-center">
                <div
                  className="w-10 h-10 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer flex-shrink-0"
                  style={{ backgroundColor: getStyleValue(`${activeDecorationTab}BorderColor`, "#e5e7eb") }}
                  onClick={() => document.getElementById(`border-color-${activeDecorationTab}`)?.click()}
                />
                <input
                  id={`border-color-${activeDecorationTab}`}
                  type="color"
                  value={getStyleValue(`${activeDecorationTab}BorderColor`, "#e5e7eb")}
                  onChange={(e) => handleStyleUpdate(`${activeDecorationTab}BorderColor`, e.target.value)}
                  className="opacity-0 absolute pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Border Radius */}
          <SpacingControl
            label="Border Radius"
            values={{
              top: getStyleValue(`${activeDecorationTab}BorderTopLeftRadius`),
              right: getStyleValue(`${activeDecorationTab}BorderTopRightRadius`),
              bottom: getStyleValue(`${activeDecorationTab}BorderBottomRightRadius`),
              left: getStyleValue(`${activeDecorationTab}BorderBottomLeftRadius`),
            }}
            onChange={handleStyleUpdate}
            onBatchChange={handleStyleBatchUpdate}
            keyMapping={{
              top: `${activeDecorationTab}BorderTopLeftRadius`,
              right: `${activeDecorationTab}BorderTopRightRadius`,
              bottom: `${activeDecorationTab}BorderBottomRightRadius`,
              left: `${activeDecorationTab}BorderBottomLeftRadius`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
