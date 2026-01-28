import React from "react";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

interface SpacingControlProps {
  label: string;
  values: { top: any; right: any; bottom: any; left: any };
  onChange: (key: string, value: any) => void;
  onBatchChange?: (updates: Record<string, any>) => void;
  prefix?: string;
  suffix?: string;
  allowAuto?: boolean;
  keyMapping?: { top: string; right: string; bottom: string; left: string };
}

export const SpacingControl: React.FC<SpacingControlProps> = ({
  label,
  values,
  onChange,
  onBatchChange,
  prefix = "",
  suffix = "",
  allowAuto = false,
  keyMapping,
}) => {
  const handleCopyValue = (value: any) => {
    if (onBatchChange) {
      if (keyMapping) {
        onBatchChange({
          [keyMapping.top]: value,
          [keyMapping.right]: value,
          [keyMapping.bottom]: value,
          [keyMapping.left]: value,
        });
      } else {
        onBatchChange({
          [`${prefix}Top${suffix}`]: value,
          [`${prefix}Right${suffix}`]: value,
          [`${prefix}Bottom${suffix}`]: value,
          [`${prefix}Left${suffix}`]: value,
        });
      }
    } else if (keyMapping) {
      onChange(keyMapping.top, value);
      onChange(keyMapping.right, value);
      onChange(keyMapping.bottom, value);
      onChange(keyMapping.left, value);
    } else {
      onChange(`${prefix}Top${suffix}`, value);
      onChange(`${prefix}Right${suffix}`, value);
      onChange(`${prefix}Bottom${suffix}`, value);
      onChange(`${prefix}Left${suffix}`, value);
    }
  };

  const handleInputChange = (side: string, value: any) => {
    const key = keyMapping ? keyMapping[side.toLowerCase() as keyof typeof keyMapping] : `${prefix}${side}${suffix}`;
    onChange(key, value);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{label}</label>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {/* Top */}
        <div className="flex items-center relative group">
          <button
            type="button"
            onClick={() => handleCopyValue(values.top)}
            title="Copy to all sides"
            className="h-8 w-8 flex items-center justify-center rounded-r-none border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shrink-0 z-10 transition-colors"
          >
            <DocumentDuplicateIcon className="h-3 w-3" />
          </button>
          <div className="relative flex-1">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-medium pointer-events-none text-gray-500 dark:text-gray-400">
              T
            </div>
            <input
              type={allowAuto ? "text" : "number"}
              value={values.top || ""}
              onChange={(e) => handleInputChange("Top", e.target.value)}
              className="w-full h-8 px-3 pl-6 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md rounded-l-none text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-center"
              placeholder="0"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center relative group">
          <button
            type="button"
            onClick={() => handleCopyValue(values.right)}
            title="Copy to all sides"
            className="h-8 w-8 flex items-center justify-center rounded-r-none border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shrink-0 z-10 transition-colors"
          >
            <DocumentDuplicateIcon className="h-3 w-3" />
          </button>
          <div className="relative flex-1">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-medium pointer-events-none text-gray-500 dark:text-gray-400">
              R
            </div>
            <input
              type={allowAuto ? "text" : "number"}
              value={values.right || ""}
              onChange={(e) => handleInputChange("Right", e.target.value)}
              className="w-full h-8 px-3 pl-6 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md rounded-l-none text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-center"
              placeholder="0"
            />
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-center relative group">
          <button
            type="button"
            onClick={() => handleCopyValue(values.bottom)}
            title="Copy to all sides"
            className="h-8 w-8 flex items-center justify-center rounded-r-none border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shrink-0 z-10 transition-colors"
          >
            <DocumentDuplicateIcon className="h-3 w-3" />
          </button>
          <div className="relative flex-1">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-medium pointer-events-none text-gray-500 dark:text-gray-400">
              B
            </div>
            <input
              type={allowAuto ? "text" : "number"}
              value={values.bottom || ""}
              onChange={(e) => handleInputChange("Bottom", e.target.value)}
              className="w-full h-8 px-3 pl-6 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md rounded-l-none text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-center"
              placeholder="0"
            />
          </div>
        </div>

        {/* Left */}
        <div className="flex items-center relative group">
          <button
            type="button"
            onClick={() => handleCopyValue(values.left)}
            title="Copy to all sides"
            className="h-8 w-8 flex items-center justify-center rounded-r-none border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 shrink-0 z-10 transition-colors"
          >
            <DocumentDuplicateIcon className="h-3 w-3" />
          </button>
          <div className="relative flex-1">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[9px] font-medium pointer-events-none text-gray-500 dark:text-gray-400">
              L
            </div>
            <input
              type={allowAuto ? "text" : "number"}
              value={values.left || ""}
              onChange={(e) => handleInputChange("Left", e.target.value)}
              className="w-full h-8 px-3 pl-6 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md rounded-l-none text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-center"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

