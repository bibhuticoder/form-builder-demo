import React from "react";
import { Field, BreakpointId, ResponsiveFieldStyle } from "../../../../../types";
import { SCREEN_SIZES, BREAKPOINT_IDS } from "../../../../../constants";
import { resolveBreakpointStyle } from "../../../../../utils/styleUtils";

interface StyleSwitcherProps {
    field: Field;
    activeBreakpoint: BreakpointId;
    updateField: (fieldId: string, updates: Partial<Field>) => void;
}

export const StyleSwitcher: React.FC<StyleSwitcherProps> = ({ field, activeBreakpoint, updateField }) => {
    // Determine current "Copy from" value
    // If activeBreakpoint style is a string, that's the reference.
    // If it's an object or undefined, it's "none" (custom).
    const currentStyleRef = field.style?.[activeBreakpoint];
    const copyFromValue = typeof currentStyleRef === 'string' ? currentStyleRef : "";

    const handleCopyFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        // If "None" (empty string), we want to convert current reference to an object
        if (value === "") {
            if (typeof currentStyleRef === 'string') {
                const resolved = resolveBreakpointStyle(field.style, activeBreakpoint);
                updateField(field.id, {
                    style: {
                        ...field.style,
                        [activeBreakpoint]: resolved
                    }
                });
            }
        } else {
            const sourceBreakpoint = value as BreakpointId;

            // Cycle detection: Does source eventually depend on active?
            let createsCycle = false;
            let currentPointer = sourceBreakpoint;
            const visited = new Set<BreakpointId>();

            // Traverse the chain starting from the source
            while (true) {
                if (currentPointer === activeBreakpoint) {
                    createsCycle = true;
                    break;
                }
                if (visited.has(currentPointer)) break; // Internal cycle in chain, but not involving us directly in a loop yet? 
                // Actually if source has a cycle A->B->A, and we are C. C->ref->A. Safe.
                // Critical cycle is if leads back to C (activeBreakpoint).

                visited.add(currentPointer);

                const nextStep = field.style?.[currentPointer];
                if (typeof nextStep === 'string' && nextStep !== currentPointer) {
                    currentPointer = nextStep as BreakpointId;
                } else {
                    break; // End of chain (object or undefined)
                }
            }

            if (createsCycle) {
                // Cycle would be created: Fallback to Value Copy
                const sourceStyle = resolveBreakpointStyle(field.style, sourceBreakpoint);
                updateField(field.id, {
                    style: {
                        ...field.style,
                        [activeBreakpoint]: sourceStyle
                    }
                });
            } else {
                // Safe to set Reference
                updateField(field.id, {
                    style: {
                        ...field.style,
                        [activeBreakpoint]: sourceBreakpoint
                    }
                });
            }
        }
    };

    const handleApplyToAll = () => {
        // Resolve current style to get the "look" we want everywhere
        const resolvedStyle = resolveBreakpointStyle(field.style, activeBreakpoint);

        // Create new style object where CURRENT active is the base,
        // and everything else inherits from CURRENT active.
        const newStyle: ResponsiveFieldStyle = {};

        // 1. Set active style as object
        newStyle[activeBreakpoint] = resolvedStyle;

        // 2. Set others to reference active
        BREAKPOINT_IDS.forEach(id => {
            if (id !== activeBreakpoint) {
                newStyle[id] = activeBreakpoint;
            }
        });

        updateField(field.id, { style: newStyle });
    };

    const availableOptions = SCREEN_SIZES
        .filter(s => s.id !== activeBreakpoint) // Can't copy from self
        .filter(s => {
            // Only show options that have their own styles (are not references)
            // accessing field.style[s.id] directly
            const styleVal = field.style?.[s.id as BreakpointId];
            // It's a source if it's NOT a string reference.
            // (Undefined/Object are valid sources, String is a reference)
            return typeof styleVal !== 'string';
        });

    return (
        <div className="flex flex-col gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-md border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center w-full">
                {copyFromValue === "" && (
                    <button
                        onClick={handleApplyToAll}
                        className="text-[10px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Apply this style to all screen sizes"
                    >
                        Apply to all sizes
                    </button>
                )}

                {availableOptions.length > 0 && (
                    <select
                        value={copyFromValue}
                        onChange={handleCopyFromChange}
                        className="text-xs bg-transparent p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-0 focus:ring-0"
                        id="style-size-options"
                    >
                        <option value={""}>Custom Styles</option>
                        {availableOptions.map(size => (
                            <option key={size.id} value={size.id}>
                                Copy from {size.label}
                            </option>
                        ))}
                    </select>
                )}
            </div>
        </div>
    );
};
