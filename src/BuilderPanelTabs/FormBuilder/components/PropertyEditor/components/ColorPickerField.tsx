import React from "react";

interface ColorPickerFieldProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

export const ColorPickerField: React.FC<ColorPickerFieldProps> = ({ label, color, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">
        {label}
      </label>
      <div className="flex gap-2 items-center">
        <div
          className="w-10 h-10 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer flex-shrink-0"
          style={{ backgroundColor: color }}
          onClick={() => document.getElementById(`color-${label}`)?.click()}
        />
        <input
          id={`color-${label}`}
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="opacity-0 absolute pointer-events-none"
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="#000000"
        />
      </div>
    </div>
  );
};
