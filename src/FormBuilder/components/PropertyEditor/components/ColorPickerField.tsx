import React from "react";

interface ColorPickerFieldProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
}

export const ColorPickerField: React.FC<ColorPickerFieldProps> = ({ label, color, onChange }) => {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">
        {label}
      </label>
      <div className="flex gap-2 items-center">
        <div className="relative w-[30px] h-[30px] flex-shrink-0">
          <div
            className="absolute inset-0 rounded border-2 border-gray-300 dark:border-gray-600 pointer-events-none"
            style={{ backgroundColor: color }}
          />
          <input
            id={`color-${label}`}
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            title={`Pick ${label}`}
          />
        </div>
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="shadow flex-1 px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="#000000"
        />
      </div>
    </div>
  );
};
