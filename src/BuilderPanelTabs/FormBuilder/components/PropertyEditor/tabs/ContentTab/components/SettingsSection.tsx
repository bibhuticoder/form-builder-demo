import React from "react";
import { Field } from "../../../../../types";

interface SettingsSectionProps {
    field: Field;
    capabilities: any;
    handleUpdate: (key: string, value: unknown) => void;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ field, capabilities, handleUpdate }) => {
    const showRequired = capabilities.hasRequired;
    const showHelpText = capabilities.hasHelpText;

    return (
        <>
            {/* Required Toggle */}
            {showRequired && (
                <div className="flex items-center justify-between py-2 px-2 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                    <label className="cursor-pointer text-xs font-medium text-gray-900 dark:text-white" htmlFor="required-toggle">
                        Required
                    </label>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={(field as any).required || false}
                        onClick={() => handleUpdate("required", !(field as any).required)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${(field as any).required ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(field as any).required ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>
            )}

            {/* Help Text */}
            {showHelpText && (
                <>
                    <div className="border-t border-gray-200 dark:border-gray-700 my-4" />
                    <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Help Text</label>
                        <input
                            type="text"
                            value={(field as any).helpText || ""}
                            onChange={(e) => handleUpdate("helpText", e.target.value)}
                            placeholder="Small text below input"
                            className="w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </>
            )}
        </>
    );
};
