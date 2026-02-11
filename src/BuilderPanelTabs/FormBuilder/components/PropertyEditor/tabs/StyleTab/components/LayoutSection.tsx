import React from "react";
import { Field } from "../../../../../types";

interface LayoutSectionProps {
    field: Field;
    capabilities: any;
    getStyleValue: (key: string, defaultValue?: string | number) => string | number;
    handleStyleUpdate: (key: string, value: string | number | undefined) => void;
    handleStyleBatchUpdate: (updates: Record<string, string | number | undefined>) => void;
    setActiveSubElement: (element: string) => void;
}

export const LayoutSection: React.FC<LayoutSectionProps> = ({
    getStyleValue,
    handleStyleUpdate,
}) => {
    return (
        <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Layout</h4>

            <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Width</label>
                <select
                    value={getStyleValue("width", "full")}
                    onChange={(e) => handleStyleUpdate("width", e.target.value)}
                    className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="full">Full Width (100%)</option>
                    <option value="three-quarters">Three Quarters (75%)</option>
                    <option value="half">Half Width (50%)</option>
                    <option value="third">One Third (33%)</option>
                    <option value="quarter">One Quarter (25%)</option>
                </select>
            </div>
        </div>
    );
};
