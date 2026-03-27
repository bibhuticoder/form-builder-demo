import React from "react";
import { Field, CheckboxField, RadioField, DropdownField } from "../../../../../types";
import { Button } from "@/components"; // Adjust path if needed, Button likely in src/components?
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

// Button might be exported from components/index.ts. If not, use Button component path.
// The original file used `import { Button } from "@/components";`
// This file is one level deeper, so `../../../../../../components`?
// Let's check imports.
// Original: `import { Button } from "@/components";`
// New: `.../tabs/ContentTab/components/OptionsSection.tsx`
// Level 1: components
// Level 2: ContentTab
// Level 3: tabs
// Level 4: PropertyEditor
// Level 5: components (FormBuilder)
// Level 6: FormBuilder
// Level 7: BuilderPanelTabs
// Level 8: src ?
// `../../../../../../components` seems correct if Button is in `src/components`.

interface OptionsSectionProps {
    field: Field;
    capabilities: any;
    handleUpdate: (key: string, value: unknown) => void;
}

export const OptionsSection: React.FC<OptionsSectionProps> = ({ field, capabilities, handleUpdate }) => {
    const showOptions = capabilities.hasOptions;

    if (!showOptions) return null;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Options</label>
                <Button
                    variant="transparent"
                    onClick={() => {
                        const newOption = {
                            id: `opt_${Date.now()}`,
                            label: `Option ${(field as CheckboxField | RadioField | DropdownField).options?.length ? (field as CheckboxField | RadioField | DropdownField).options.length + 1 : 1}`,
                            value: `option_${(field as CheckboxField | RadioField | DropdownField).options?.length ? (field as CheckboxField | RadioField | DropdownField).options.length + 1 : 1}`,
                        };
                        const newOptions = [...((field as CheckboxField | RadioField | DropdownField).options || []), newOption];
                        handleUpdate("options", newOptions);
                    }}
                    className="gap-1 text-xs"
                >
                    <PlusIcon className="w-3 h-3" />
                    Add Option
                </Button>
            </div>

            <div className="space-y-2">
                {((field as CheckboxField | RadioField | DropdownField).options || []).map((option, index: number) => (
                    <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1 space-y-1">
                            <div className="flex gap-2 items-center">
                                <input
                                    type="text"
                                    value={option.label}
                                    onChange={(e) => {
                                        const newOptions = [...((field as CheckboxField | RadioField | DropdownField).options || [])];
                                        newOptions[index] = { ...newOptions[index], label: e.target.value };
                                        handleUpdate("options", newOptions);
                                    }}
                                    placeholder="Label"
                                    className="flex-1 px-3 py-2 bg-white text-xs dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <Button
                                    variant="transparent"
                                    onClick={() => {
                                        const newOptions = (field as CheckboxField | RadioField | DropdownField).options?.filter((_, i: number) => i !== index);
                                        handleUpdate("options", newOptions);
                                    }}
                                    className="hover:text-red-500 p-1"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </Button>
                            </div>
                            <input
                                type="text"
                                value={option.value}
                                onChange={(e) => {
                                    const newOptions = [...((field as CheckboxField | RadioField | DropdownField).options || [])];
                                    newOptions[index] = { ...newOptions[index], value: e.target.value };
                                    handleUpdate("options", newOptions);
                                }}
                                placeholder="Value"
                                className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
