import React from "react";
import { EmailBlock } from "../../../../types";
import { getBlockCapabilities } from "../../../../types/block-capabilities";
import { useEmailBuilder } from "../../../../context";
import { resolveBreakpointStyle } from "../../../../utils/styleUtils";

interface StyleTabProps {
  block: EmailBlock;
}

export const StyleTab: React.FC<StyleTabProps> = ({ block }) => {
  const { updateBlockStyleBatch, activeBreakpoint } = useEmailBuilder();

  const capabilities = getBlockCapabilities(block.type);

  const handleStyleUpdate = (key: string, value: string | number | undefined) => {
    updateBlockStyleBatch(block.id, { [key]: value });
  };

  const getStyleValue = (key: string, defaultValue: string | number | undefined = "") => {
    const resolvedStyle = resolveBreakpointStyle(block.style, activeBreakpoint);
    return (resolvedStyle as Record<string, string | number | undefined>)?.[key] ?? defaultValue;
  };

  const labelClass = "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1";
  const inputClass = "w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-primary";
  const sectionTitle = "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3";

  return (
    <div className="space-y-6">
      {/* Typography */}
      {capabilities.supportsTypography && (
        <div>
          <h4 className={sectionTitle}>Typography</h4>
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Font Size (px)</label>
              <input
                type="number"
                value={getStyleValue("fontSize", 14)}
                onChange={(e) => handleStyleUpdate("fontSize", parseInt(e.target.value) || 14)}
                className={inputClass}
                min={8}
                max={72}
              />
            </div>
            <div>
              <label className={labelClass}>Font Weight</label>
              <select
                value={getStyleValue("fontWeight", "normal")}
                onChange={(e) => handleStyleUpdate("fontWeight", e.target.value)}
                className={inputClass}
              >
                <option value="light">Light</option>
                <option value="normal">Normal</option>
                <option value="medium">Medium</option>
                <option value="semibold">Semibold</option>
                <option value="bold">Bold</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={String(getStyleValue("color", "#333333"))}
                  onChange={(e) => handleStyleUpdate("color", e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={getStyleValue("color", "#333333")}
                  onChange={(e) => handleStyleUpdate("color", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Line Height</label>
              <input
                type="text"
                value={getStyleValue("lineHeight", "1.5")}
                onChange={(e) => handleStyleUpdate("lineHeight", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      )}

      {capabilities.supportsTypography && <div className="border-t border-gray-200 dark:border-gray-700" />}

      {/* Alignment */}
      {capabilities.supportsAlignment && (
        <div>
          <h4 className={sectionTitle}>Alignment</h4>
          <div className="flex gap-1">
            {["left", "center", "right"].map((align) => (
              <button
                key={align}
                onClick={() => handleStyleUpdate("textAlign", align)}
                className={`flex-1 py-1.5 text-xs rounded transition-colors ${
                  getStyleValue("textAlign", "left") === align
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {align.charAt(0).toUpperCase() + align.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {capabilities.supportsAlignment && <div className="border-t border-gray-200 dark:border-gray-700" />}

      {/* Padding */}
      {capabilities.supportsPadding && (
        <div>
          <h4 className={sectionTitle}>Padding</h4>
          <div className="grid grid-cols-2 gap-2">
            {["Top", "Right", "Bottom", "Left"].map((side) => (
              <div key={side}>
                <label className={labelClass}>{side}</label>
                <input
                  type="number"
                  value={getStyleValue(`padding${side}`, 10)}
                  onChange={(e) => handleStyleUpdate(`padding${side}`, parseInt(e.target.value) || 0)}
                  className={inputClass}
                  min={0}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {capabilities.supportsPadding && <div className="border-t border-gray-200 dark:border-gray-700" />}

      {/* Background Color */}
      {capabilities.supportsBackgroundColor && (
        <div>
          <h4 className={sectionTitle}>Background</h4>
          <div>
            <label className={labelClass}>Background Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={String(getStyleValue("backgroundColor", "#ffffff"))}
                onChange={(e) => handleStyleUpdate("backgroundColor", e.target.value)}
                className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
              />
              <input
                type="text"
                value={getStyleValue("backgroundColor", "")}
                onChange={(e) => handleStyleUpdate("backgroundColor", e.target.value)}
                className={inputClass}
                placeholder="transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Border */}
      {capabilities.supportsBorder && (
        <div>
          <h4 className={sectionTitle}>Border</h4>
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Style</label>
              <select
                value={getStyleValue("borderStyle", "none")}
                onChange={(e) => handleStyleUpdate("borderStyle", e.target.value)}
                className={inputClass}
              >
                <option value="none">None</option>
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Width (px)</label>
              <input
                type="number"
                value={getStyleValue("borderWidth", 1)}
                onChange={(e) => handleStyleUpdate("borderWidth", parseInt(e.target.value) || 0)}
                className={inputClass}
                min={0}
              />
            </div>
            <div>
              <label className={labelClass}>Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={String(getStyleValue("borderColor", "#cccccc"))}
                  onChange={(e) => handleStyleUpdate("borderColor", e.target.value)}
                  className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={getStyleValue("borderColor", "#cccccc")}
                  onChange={(e) => handleStyleUpdate("borderColor", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Radius (px)</label>
              <input
                type="number"
                value={getStyleValue("borderRadius", 0)}
                onChange={(e) => handleStyleUpdate("borderRadius", parseInt(e.target.value) || 0)}
                className={inputClass}
                min={0}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
