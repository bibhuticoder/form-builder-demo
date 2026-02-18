import React from "react";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

export interface SpacingValues {
  top: string | number | undefined;
  right: string | number | undefined;
  bottom: string | number | undefined;
  left: string | number | undefined;
}

interface SpacingControlProps {
  label: string;
  values: SpacingValues;
  onChange: (key: string, value: string | number | undefined) => void;
  onBatchChange?: (updates: Record<string, string | number | undefined>) => void;
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
  const handleCopyValue = (value: string | number | undefined) => {
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

  const handleInputChange = (side: string, value: string | number | undefined) => {
    const key = keyMapping ? keyMapping[side.toLowerCase() as keyof typeof keyMapping] : `${prefix}${side}${suffix}`;
    onChange(key, value);
  };

  const sides = [
    { key: "Top", short: "T", value: values.top },
    { key: "Right", short: "R", value: values.right },
    { key: "Bottom", short: "B", value: values.bottom },
    { key: "Left", short: "L", value: values.left },
  ] as const;

  const controlWrapperClass = "shadow h-6 grid grid-cols-[1.5rem_1fr] rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:z-20";
  const copyButtonClass = "h-full w-6 flex items-center justify-center border-r border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors";
  const inputClass = "block w-full h-full px-2 pl-5 py-0 bg-transparent text-xs leading-none text-gray-900 dark:text-white focus:outline-none text-center";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{label}</label>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {sides.map((side) => (
          <div key={side.key} className={controlWrapperClass}>
            <button
              type="button"
              onClick={() => handleCopyValue(side.value)}
              title="Copy to all sides"
              className={copyButtonClass}
            >
              <DocumentDuplicateIcon className="h-3 w-3" />
            </button>
            <div className="relative h-full">
              <div className="absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] font-medium pointer-events-none text-gray-500 dark:text-gray-400">
                {side.short}
              </div>
              <input
                type={allowAuto ? "text" : "number"}
                value={side.value || ""}
                onChange={(e) => handleInputChange(side.key, e.target.value)}
                className={inputClass}
                placeholder="0"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

