import React, { useId } from "react";

interface ColorControlProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultColor?: string;
}

export const ColorControl: React.FC<ColorControlProps> = ({
  label,
  value,
  onChange,
  className = "",
  defaultColor = "#ffffff"
}) => {
  const uniqueId = useId();
  const displayValue = value || "";

  // Fallback for the native color input (must be valid hex)
  const safeColorValue = /^#[0-9A-F]{6}$/i.test(displayValue)
    ? displayValue
    : defaultColor;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={`${uniqueId}-text`}
          className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block"
        >
          {label}
        </label>
      )}
      <div className="flex gap-2 items-center">
        {/* Color Swatch / Trigger */}
        <div className="relative flex-shrink-0 w-[30px] h-[30px]">
          <div
            className="absolute inset-0 rounded border border-gray-300 dark:border-gray-600 shadow-sm transition-colors pointer-events-none"
            style={{ backgroundColor: safeColorValue }}
          />
          <input
            id={uniqueId}
            type="color"
            value={safeColorValue}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            title="Click to pick color"
          />
        </div>

        {/* Hex Input */}
        <input
          id={`${uniqueId}-text`}
          type="text"
          value={displayValue}
          onChange={(e) => onChange(e.target.value)}
          className="shadow flex-1 w-full min-w-0 px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary uppercase"
          placeholder="#000000"
          spellCheck={false}
        />
      </div>
    </div>
  );
};
