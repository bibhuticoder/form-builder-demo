import React, { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  /** Current color value in hex format */
  value: string;
  /** Callback when color changes */
  onChange: (color: string) => void;
  /** Optional label for the color picker */
  label?: string;
}

/**
 * ColorPicker Component
 *
 * A reusable color picker using react-colorful.
 * Displays a color swatch that opens a popover with the color picker.
 * Also includes a text input for manual hex entry.
 *
 * @example
 * <ColorPicker
 *   label="Background Color"
 *   value="#FFFFFF"
 *   onChange={(color) => setColor(color)}
 * />
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  /**
   * Close popover when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  /**
   * Handle text input change
   * Validates hex format before updating
   */
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow typing # and hex characters
    if (/^#[0-9A-Fa-f]{0,6}$/.test(newValue) || newValue === "") {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <div className="flex gap-2 relative">
        {/* Color Swatch Button */}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
          style={{ backgroundColor: value }}
          aria-label="Open color picker"
        >
          <span className="sr-only">Pick color</span>
        </button>

        {/* Hex Input */}
        <input
          type="text"
          value={value}
          onChange={handleTextChange}
          placeholder="#FFFFFF"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-mono uppercase"
          maxLength={7}
        />

        {/* Color Picker Popover */}
        {isOpen && (
          <div
            ref={popoverRef}
            className="absolute left-0 top-12 z-50 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <HexColorPicker color={value} onChange={onChange} />
            
            {/* Preset Colors */}
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Presets
              </p>
              <div className="grid grid-cols-8 gap-1">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onChange(color)}
                    className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-primary"
                    style={{ backgroundColor: color }}
                    aria-label={`Select ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Preset colors for quick selection
 */
const PRESET_COLORS = [
  "#FFFFFF",
  "#000000",
  "#F3F4F6",
  "#E5E7EB",
  "#9CA3AF",
  "#6B7280",
  "#374151",
  "#1F2937",
  "#EF4444",
  "#F59E0B",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
];
