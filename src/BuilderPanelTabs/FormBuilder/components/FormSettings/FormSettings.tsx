import React, { useState, useCallback } from "react";
import { Dialog } from "../../../../components/Dialog";
import { ColorControl } from "../PropertyEditor/components/ColorControl";
import { SpacingControl } from "../PropertyEditor/components/SpacingControl";
import type { FormSettings as FormSettingsType } from "../../types/form";
import type { StyleSettings } from "../../types/styles";
import { FormStatus } from "../../types/enums";
import { Button } from "../../../../components";

/**
 * Form styling configuration interface
 */
interface FormStyleConfig {
  // Dimensions
  maxWidth: number;
  maxWidthUnit: "%" | "px";
  maxHeight: string; // "Auto" or value in px
  maxHeightUnit: "px" | "Auto";

  // Fonts
  bodyFont: string;
  titleFont: string;

  // Spacing
  marginTop: number;
  marginBottom: number;
  marginRight: number;
  marginLeft: number;

  paddingTop: number;
  paddingBottom: number;
  paddingRight: number;
  paddingLeft: number;

  // Background
  backgroundColor: string;
  backgroundImageUrl: string;
  backgroundRepeat: "No Repeat" | "Repeat" | "Repeat X" | "Repeat Y";
  backgroundAttachment: "Scroll" | "Fixed";
  backgroundPosition: "Center" | "Top" | "Bottom" | "Left" | "Right";
  backgroundSize: "Auto" | "Cover" | "Contain";

  // Border
  borderStyle: "Solid" | "Dashed" | "Dotted" | "Double" | "None";
  borderSize: number;
  borderColor: string;
  borderRadiusTop: number;
  borderRadiusBottom: number;
  borderRadiusRight: number;
  borderRadiusLeft: number;

  // Help Text
  helpFontSize: number;
  helpFontSizeUnit: "px";
  helpColor: string;
}

interface FormSettingsConfig extends FormStyleConfig {
  surveyMode: boolean;
}

interface FormSettingsProps {
  isOpen: boolean;
  onSave: () => void; // No longer needs formSettings, already in context
  onCancel: () => void; // Explicit cancel handler for revert logic
  onChangeRealTime: (formSettings: FormSettingsType) => void; // Real-time updates to context
  initialConfig?: Partial<FormSettingsType>;
}

// Default configuration
import { DEFAULT_CONFIG } from "../../constants";


/**
 * Form Styling Section - Contains all styling related settings
 * Memoized to prevent unnecessary re-renders when parent state changes
 */
const FormStylingSection = React.memo(
  ({
    config,
    onChange,
  }: {
    config: FormSettingsConfig;
    onChange: (key: keyof FormSettingsConfig, value: any) => void;
  }) => {
    /**
     * Memoized spacing change handler
     * Prevents recreation on every render
     */
    const handleSpacingChange = useCallback(
      (
        prefix: "margin" | "padding",
        key: "top" | "right" | "bottom" | "left",
        value: number,
      ) => {
        onChange(
          `${prefix}${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof FormSettingsConfig,
          value,
        );
      },
      [onChange],
    );

    return (
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Form Styling
        </h3>

        {/* Max Width and Height */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block space-y-1 text-[10px] text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              <span className="font-semibold">Max Width</span>

              <div className="flex gap-1">
                <input
                  type="number"
                  value={config.maxWidth}
                  onChange={(e) => onChange("maxWidth", Number(e.target.value))}
                  className="flex-1 px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  value={config.maxWidthUnit}
                  onChange={(e) => onChange("maxWidthUnit", e.target.value)}
                  className="px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Max width unit"
                >
                  <option>%</option>
                  <option>px</option>
                </select>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-[10px] text-gray-600 dark:text-gray-400 uppercase tracking-wider space-y-1">
              <span className="font-semibold">Max Height</span>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={config.maxHeight}
                  onChange={(e) => onChange("maxHeight", e.target.value)}
                  className="flex-1 px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  value={config.maxHeightUnit}
                  onChange={(e) => onChange("maxHeightUnit", e.target.value)}
                  className="px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Max height unit"
                >
                  <option>px</option>
                  <option>Auto</option>
                </select>
              </div>
            </label>
          </div>
        </div>

        {/* Fonts */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider space-y-1"
              htmlFor="bodyFont"
            >
              Body Font
            </label>
            <select
              id="bodyFont"
              value={config.bodyFont}
              onChange={(e) => onChange("bodyFont", e.target.value)}
              className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Default</option>
              <option>Arial</option>
              <option>Helvetica</option>
              <option>Times New Roman</option>
            </select>
          </div>

          <div>
            <label
              className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider space-y-1"
              htmlFor="titleFont"
            >
              Title Font
            </label>
            <select
              id="titleFont"
              value={config.titleFont}
              onChange={(e) => onChange("titleFont", e.target.value)}
              className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Default</option>
              <option>Arial</option>
              <option>Helvetica</option>
              <option>Times New Roman</option>
            </select>
          </div>
        </div>

        {/* Help Text Styling */}
        <div>
          <label className="block text-[10px] text-gray-600 dark:text-gray-400 uppercase tracking-wider space-y-1">
            <span className="font-semibold">Help Text Font Size</span>
            <div className="flex gap-1">
              <input
                type="number"
                value={config.helpFontSize}
                onChange={(e) => onChange("helpFontSize", Number(e.target.value))}
                className="flex-1 px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select
                value={config.helpFontSizeUnit}
                onChange={(e) => onChange("helpFontSizeUnit", e.target.value)}
                className="px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Help font size unit"
                disabled
              >
                <option>px</option>
              </select>
            </div>
          </label>
        </div>

        {/* Margin */}
        <SpacingControl
          label="Form Margin"
          values={{
            top: config.marginTop,
            right: config.marginRight,
            bottom: config.marginBottom,
            left: config.marginLeft,
          }}
          onChange={(key, value) =>
            handleSpacingChange(
              "margin",
              key as "top" | "right" | "bottom" | "left",
              Number(value),
            )
          }
        />

        {/* Padding */}
        <SpacingControl
          label="Form Padding"
          values={{
            top: config.paddingTop,
            right: config.paddingRight,
            bottom: config.paddingBottom,
            left: config.paddingLeft,
          }}
          onChange={(key, value) =>
            handleSpacingChange(
              "padding",
              key as "top" | "right" | "bottom" | "left",
              Number(value),
            )
          }
        />

        {/* Background Color */}
        <ColorControl
          label="Background Color"
          value={config.backgroundColor}
          onChange={(color) => onChange("backgroundColor", color)}
        />

        {/* Background Image URL */}
        <div>
          <label
            className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider space-y-1"
            htmlFor="bgImageUrl"
          >
            Background Image URL
          </label>
          <input
            id="bgImageUrl"
            type="text"
            value={config.backgroundImageUrl}
            onChange={(e) => onChange("backgroundImageUrl", e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Background Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider space-y-1"
              htmlFor="bgRepeat"
            >
              Repeat
            </label>
            <select
              id="bgRepeat"
              value={config.backgroundRepeat}
              onChange={(e) => onChange("backgroundRepeat", e.target.value)}
              className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>No Repeat</option>
              <option>Repeat</option>
              <option>Repeat X</option>
              <option>Repeat Y</option>
            </select>
          </div>

          <div>
            <label
              className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider space-y-1"
              htmlFor="bgAttachment"
            >
              Attachment
            </label>
            <select
              id="bgAttachment"
              value={config.backgroundAttachment}
              onChange={(e) => onChange("backgroundAttachment", e.target.value)}
              className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Scroll</option>
              <option>Fixed</option>
            </select>
          </div>
        </div>

        {/* Position and Size */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider space-y-1"
              htmlFor="bgPosition"
            >
              Position
            </label>
            <select
              id="bgPosition"
              value={config.backgroundPosition}
              onChange={(e) => onChange("backgroundPosition", e.target.value)}
              className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Center</option>
              <option>Top</option>
              <option>Bottom</option>
              <option>Left</option>
              <option>Right</option>
            </select>
          </div>

          <div>
            <label
              className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider space-y-1"
              htmlFor="bgSize"
            >
              Size
            </label>
            <select
              id="bgSize"
              value={config.backgroundSize}
              onChange={(e) => onChange("backgroundSize", e.target.value)}
              className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Auto</option>
              <option>Cover</option>
              <option>Contain</option>
            </select>
          </div>
        </div>

        {/* Border Style and Size */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider space-y-1"
              htmlFor="borderStyle"
            >
              Border Style
            </label>
            <select
              id="borderStyle"
              value={config.borderStyle}
              onChange={(e) => onChange("borderStyle", e.target.value)}
              className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Solid</option>
              <option>Dashed</option>
              <option>Dotted</option>
              <option>Double</option>
              <option>None</option>
            </select>
          </div>

          <div>
            <label
              className="block text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider space-y-1"
              htmlFor="borderSize"
            >
              Border Size (px)
            </label>
            <input
              id="borderSize"
              type="number"
              value={config.borderSize}
              onChange={(e) => onChange("borderSize", Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Border Color */}
        <ColorControl
          label="Border Color"
          value={config.borderColor}
          onChange={(color) => onChange("borderColor", color)}
        />

        {/* Border Radius */}
        <SpacingControl
          label="Border Radius"
          values={{
            top: config.borderRadiusTop,
            right: config.borderRadiusRight,
            bottom: config.borderRadiusBottom,
            left: config.borderRadiusLeft,
          }}
          onChange={(key, value) => {
            const radiusKey =
              `borderRadius${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof FormSettingsConfig;
            onChange(radiusKey, Number(value));
          }}
        />
      </div>
    );
  },
  // Custom equality check for memo optimization
  (prevProps, nextProps) => {
    return (
      prevProps.config === nextProps.config &&
      prevProps.onChange === nextProps.onChange
    );
  },
);

FormStylingSection.displayName = "FormStylingSection";

/**
 * Convert internal FormSettingsConfig to FormSettings type
 */
const convertToFormSettings = (
  config: FormSettingsConfig,
): FormSettingsType => {
  const settings: StyleSettings = {
    width: config.maxWidth,
    fontFamilyBody: config.bodyFont,
    fontFamilyTitle: config.titleFont,
    backgroundColor: config.backgroundColor,
    borderColor: config.borderColor,
    borderStyle: config.borderStyle.toLowerCase(),
    borderWidth: config.borderSize,
    borderRadius: config.borderRadiusTop, // Use top radius as default
    paddingTop: config.paddingTop,
    paddingRight: config.paddingRight,
    paddingBottom: config.paddingBottom,
    paddingLeft: config.paddingLeft,
    marginTop: config.marginTop,
    marginRight: config.marginRight,
    marginBottom: config.marginBottom,
    marginLeft: config.marginLeft,

    // Help Text
    helpFontSize: config.helpFontSize,
    helpFontSizeUnit: config.helpFontSizeUnit,
    helpColor: config.helpColor,
  };

  // Add optional background image properties if provided
  if (config.backgroundImageUrl) {
    settings.backgroundImage = config.backgroundImageUrl;
    settings.backgroundRepeat = config.backgroundRepeat
      .toLowerCase()
      .replace(" ", "-");
    settings.backgroundSize = config.backgroundSize.toLowerCase();
    settings.backgroundPosition = config.backgroundPosition.toLowerCase();
  }

  return {
    name: "Form", // Default name, should be provided by parent component
    status: FormStatus.DRAFT, // Default status
    settings,
  };
};

/**
 * Convert FormSettings type to internal FormSettingsConfig
 */
const convertFromFormSettings = (
  formSettings?: Partial<FormSettingsType>,
): Partial<FormSettingsConfig> => {
  if (!formSettings?.settings) return {};

  const settings = formSettings.settings;

  return {
    maxWidth: settings.width || DEFAULT_CONFIG.maxWidth,
    bodyFont: settings.fontFamilyBody || DEFAULT_CONFIG.bodyFont,
    titleFont: settings.fontFamilyTitle || DEFAULT_CONFIG.titleFont,
    backgroundColor:
      (settings.backgroundColor as string) || DEFAULT_CONFIG.backgroundColor,
    borderColor: (settings.borderColor as string) || DEFAULT_CONFIG.borderColor,
    borderStyle:
      (((settings.borderStyle as string)?.charAt(0).toUpperCase() +
        (settings.borderStyle as string)?.slice(1)) as any) ||
      DEFAULT_CONFIG.borderStyle,
    borderSize: (settings.borderWidth as number) || DEFAULT_CONFIG.borderSize,
    borderRadiusTop:
      (settings.borderRadius as number) || DEFAULT_CONFIG.borderRadiusTop,
    borderRadiusBottom:
      (settings.borderRadius as number) || DEFAULT_CONFIG.borderRadiusBottom,
    borderRadiusRight:
      (settings.borderRadius as number) || DEFAULT_CONFIG.borderRadiusRight,
    borderRadiusLeft:
      (settings.borderRadius as number) || DEFAULT_CONFIG.borderRadiusLeft,
    paddingTop: (settings.paddingTop as number) || DEFAULT_CONFIG.paddingTop,
    paddingRight:
      (settings.paddingRight as number) || DEFAULT_CONFIG.paddingRight,
    paddingBottom:
      (settings.paddingBottom as number) || DEFAULT_CONFIG.paddingBottom,
    paddingLeft: (settings.paddingLeft as number) || DEFAULT_CONFIG.paddingLeft,
    marginTop: (settings.marginTop as number) || DEFAULT_CONFIG.marginTop,
    marginRight: (settings.marginRight as number) || DEFAULT_CONFIG.marginRight,
    marginBottom:
      (settings.marginBottom as number) || DEFAULT_CONFIG.marginBottom,
    marginLeft: (settings.marginLeft as number) || DEFAULT_CONFIG.marginLeft,
    backgroundImageUrl:
      (settings.backgroundImage as string) || DEFAULT_CONFIG.backgroundImageUrl,
    backgroundRepeat:
      (settings.backgroundRepeat as any) || DEFAULT_CONFIG.backgroundRepeat,
    backgroundSize:
      (((settings.backgroundSize as string)?.charAt(0).toUpperCase() +
        (settings.backgroundSize as string)?.slice(1)) as any) ||
      DEFAULT_CONFIG.backgroundSize,
    backgroundPosition:
      (((settings.backgroundPosition as string)?.charAt(0).toUpperCase() +
        (settings.backgroundPosition as string)?.slice(1)) as any) ||
      DEFAULT_CONFIG.backgroundPosition,

    // Help Text
    helpFontSize: (settings.helpFontSize as number) || DEFAULT_CONFIG.helpFontSize,
    helpFontSizeUnit: (settings.helpFontSizeUnit as "px") || DEFAULT_CONFIG.helpFontSizeUnit,
    helpColor: (settings.helpColor as string) || DEFAULT_CONFIG.helpColor,
  };
};

/**
 * FormSettings Component
 *
 * A dialog-based settings panel for configuring form appearance and behavior.
 * Provides comprehensive controls for styling, spacing, backgrounds, and borders.
 *
 * @example
 * const [isOpen, setIsOpen] = useState(false);
 * return (
 *   <>
 *     <button onClick={() => setIsOpen(true)}>Open Settings</button>
 *     <FormSettings
 *       isOpen={isOpen}
 *       onClose={() => setIsOpen(false)}
 *       onSave={(formSettings) => console.log(formSettings)}
 *     />
 *   </>
 * );
 */
export const FormSettings: React.FC<FormSettingsProps> = ({
  isOpen,
  onSave,
  onCancel,
  onChangeRealTime,
  initialConfig,
}) => {
  const [config, setConfig] = useState<FormSettingsConfig>({
    ...DEFAULT_CONFIG,
    ...convertFromFormSettings(initialConfig),
  });

  /**
   * Handle configuration changes
   * Updates local state and immediately syncs to context for real-time preview
   * Memoized with useCallback to prevent unnecessary re-renders
   */
  const handleChange = useCallback(
    (key: keyof FormSettingsConfig, value: any) => {
      setConfig((prev) => {
        const updated = {
          ...prev,
          [key]: value,
        };
        // Immediately update context with new settings (real-time)
        const formSettings = convertToFormSettings(updated);
        onChangeRealTime(formSettings);
        return updated;
      });
    },
    [onChangeRealTime],
  );

  /**
   * Handle save action
   * Settings already synced to context via onChange
   * Just confirm and close the dialog
   * Memoized with useCallback to prevent unnecessary function recreations
   */
  const handleSave = useCallback(() => {
    onSave();
  }, [onSave]);

  /**
   * Handle cancel action
   * Revert local state and notify parent to restore from backup
   * Memoized with useCallback to prevent unnecessary function recreations
   */
  const handleCancel = useCallback(() => {
    setConfig({
      ...DEFAULT_CONFIG,
      ...convertFromFormSettings(initialConfig),
    });
    onCancel();
  }, [initialConfig, onCancel]);

  return (
    <Dialog
      isOpen={isOpen}
      header="Form Settings"
      subtitle="Configure general settings for your form."
      onClose={handleCancel}
      isCloseable={true}
      body={
        <div className="space-y-4 max-h-[60vh] overflow-y-auto scrollbar-hide-hover pr-2">
          {/* Survey Mode Toggle */}
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Survey Mode
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Enable this to treat submissions as survey responses for
                  reporting and analytics.
                </p>
              </div>
              <button
                onClick={() => handleChange("surveyMode", !config.surveyMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.surveyMode
                  ? "bg-primary"
                  : "bg-gray-300 dark:bg-gray-600"
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.surveyMode ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Form Styling Section */}
          <FormStylingSection config={config} onChange={handleChange} />
        </div>
      }
      footer={
        <div className="flex gap-3 justify-end">
          <Button
            className="flex items-center gap-2 text-xs"
            onClick={handleCancel}
            variant="secondary"
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={handleSave}
            className="flex items-center gap-2 text-xs"
          >
            Save Changes
          </Button>
        </div>
      }
    />
  );
};
