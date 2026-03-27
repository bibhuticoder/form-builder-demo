import React, { useState, useEffect } from "react";
import { EmailTemplate } from "../../types";

export interface JsonEditorProps {
    value: EmailTemplate;
    onChange: (value: EmailTemplate) => void;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({ value, onChange }) => {
    const [localValue, setLocalValue] = useState(JSON.stringify(value, null, 2));

    // Update local value if external value changes (and it's different from our current parsed version)
    useEffect(() => {
        try {
            const currentParsed = JSON.parse(localValue);
            if (JSON.stringify(currentParsed) !== JSON.stringify(value)) {
                setLocalValue(JSON.stringify(value, null, 2));
            }
        } catch {
            setLocalValue(JSON.stringify(value, null, 2));
        }
    }, [value]);

    const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);

        try {
            const parsed = JSON.parse(newValue);
            onChange(parsed);
        } catch (error) {
            // Invalid JSON, wait for user to fix it
        }
    };

    return (
        <div className="flex flex-col h-full min-h-0">
            {/* Editable textarea displaying JSON */}
            <div className="flex-1 relative overflow-auto h-full min-h-0">
                <textarea
                    value={localValue}
                    onChange={handleValueChange}
                    className="w-full h-full p-4 font-mono text-xs text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary resize-none outline-none overflow-y-auto min-h-[500px]"
                    placeholder="JSON content..."
                    spellCheck={false}
                />
            </div>
            <div className="mt-2 text-[10px] text-gray-400 italic">
                Changes are applied automatically when valid JSON is entered.
            </div>
        </div>
    );
};
