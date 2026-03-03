import React from "react";
import { Button } from "@/components/Button";
import { BoltIcon } from "@heroicons/react/24/outline";

interface LogicHeaderProps {
    onAdd: () => void;
}

export const LogicHeader: React.FC<LogicHeaderProps> = ({ onAdd }) => {
    return (
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <div className="p-1 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center shrink-0 shadow-sm">
                    <BoltIcon className="w-4 h-4 text-orange-500" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Conditional Logic</h3>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                Add rules to show/hide fields, disqualify leads, or redirect users based on their inputs.
            </p>
            <Button
                className="w-full justify-center text-xs"
                variant="primary"
                onClick={onAdd}
            >
                Add New Condition
            </Button>
        </div>
    );
};
