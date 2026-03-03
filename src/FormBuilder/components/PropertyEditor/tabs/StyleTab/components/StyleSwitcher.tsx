import React, { useState, useEffect, useCallback } from "react";
import { Field, BreakpointId, ResponsiveFieldStyle } from "../../../../../types";
import { SCREEN_SIZES, BREAKPOINT_IDS } from "../../../../../constants";
import { resolveBreakpointStyle } from "../../../../../utils/styleUtils";

interface StyleSwitcherProps {
    field: Field;
    activeBreakpoint: BreakpointId;
    updateField: (fieldId: string, updates: Partial<Field>) => void;
}

export const StyleSwitcher: React.FC<StyleSwitcherProps> = ({ field, activeBreakpoint, updateField }) => {
    const getCopiedFromBreakpoint = useCallback((): BreakpointId | null => {
        let current = field.style?.[activeBreakpoint];
        const visited = new Set<BreakpointId>([activeBreakpoint]);

        while (typeof current === 'string') {
            const ref = current as BreakpointId;
            if (visited.has(ref)) return null;
            visited.add(ref);
            const next = field.style?.[ref];
            if (typeof next !== 'string') return ref;
            current = next;
        }

        return null;
    }, [field.style, activeBreakpoint]);

    const copiedFromBreakpoint = getCopiedFromBreakpoint();
    const copiedFromLabel = copiedFromBreakpoint
        ? (SCREEN_SIZES.find((size) => size.id === copiedFromBreakpoint)?.label ?? copiedFromBreakpoint.toUpperCase())
        : null;

    // Compute which breakpoints currently reference the active breakpoint (or ARE the active)
    const getSelectedFromField = useCallback((): Set<BreakpointId> => {
        const selected = new Set<BreakpointId>();
        selected.add(activeBreakpoint);

        BREAKPOINT_IDS.forEach(id => {
            if (id === activeBreakpoint) return;
            const styleVal = field.style?.[id];
            if (styleVal === activeBreakpoint) {
                selected.add(id);
            }
        });

        return selected;
    }, [field.style, activeBreakpoint]);

    const [selectedSizes, setSelectedSizes] = useState<Set<BreakpointId>>(getSelectedFromField);
    const [isDirty, setIsDirty] = useState(false);

    // Re-sync when field style or activeBreakpoint changes externally
    useEffect(() => {
        setSelectedSizes(getSelectedFromField());
        setIsDirty(false);
    }, [getSelectedFromField]);

    const isApplyAll = BREAKPOINT_IDS.every(id => selectedSizes.has(id));

    const handleToggleSize = (id: BreakpointId) => {
        if (id === activeBreakpoint) return; // Can't deselect active

        setSelectedSizes(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
        setIsDirty(true);
    };

    const handleApplyAllToggle = () => {
        if (isApplyAll) {
            // Deselect all except active
            setSelectedSizes(new Set([activeBreakpoint]));
        } else {
            // Select all
            setSelectedSizes(new Set([...BREAKPOINT_IDS]));
        }
        setIsDirty(true);
    };

    const handleSave = () => {
        const resolvedStyle = resolveBreakpointStyle(field.style, activeBreakpoint);
        const newStyle: ResponsiveFieldStyle = { ...field.style };

        // Ensure active breakpoint has the resolved object style
        newStyle[activeBreakpoint] = resolvedStyle;

        BREAKPOINT_IDS.forEach(id => {
            if (id === activeBreakpoint) return;

            if (selectedSizes.has(id)) {
                // Reference the active breakpoint
                newStyle[id] = activeBreakpoint;
            } else {
                // If it was previously referencing active, resolve to its own object
                const currentVal = field.style?.[id];
                if (currentVal === activeBreakpoint) {
                    newStyle[id] = resolveBreakpointStyle(field.style, id);
                }
                // Otherwise leave as-is
            }
        });

        updateField(field.id, { style: newStyle });
        setIsDirty(false);
    };

    return (
        <div className="flex flex-col gap-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Apply to sizes:
                </span>
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={isApplyAll}
                        onChange={handleApplyAllToggle}
                        className="editor-checkbox w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary cursor-pointer bg-white dark:bg-white"
                    />
                    <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">Apply all</span>
                </label>
            </div>

            <div className="flex gap-1.5">
                {SCREEN_SIZES.map(size => {
                    const bpId = size.id as BreakpointId;
                    const isActive = bpId === activeBreakpoint;
                    const isSelected = selectedSizes.has(bpId);

                    return (
                        <button
                            key={size.id}
                            onClick={() => handleToggleSize(bpId)}
                            className={`flex-1 py-1.5 rounded-md text-xs select-none font-semibold transition-all ${
                                isSelected
                                    ? "bg-primary text-white shadow-sm"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                            } ${isActive ? "cursor-default ring-2 ring-primary/30" : "cursor-pointer hover:opacity-80"}`}
                            title={isActive ? `${size.title} (current)` : size.title}
                        >
                            {size.label}
                        </button>
                    );
                })}
            </div>

            <div className="flex items-end justify-between">
                <div className="text-[10px] text-gray-500 dark:text-gray-400 text-left">
                    {copiedFromLabel ? `Copied from: ${copiedFromLabel}` : ''}
                </div>

                {isDirty && (
                    <button
                        onClick={handleSave}
                        className="px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-md hover:opacity-90 transition-opacity"
                    >
                        Save
                    </button>
                )}
            </div>
        </div>
    );
};
