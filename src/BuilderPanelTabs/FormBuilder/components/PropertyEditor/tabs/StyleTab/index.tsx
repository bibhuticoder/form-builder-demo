import React, { useMemo } from "react";
import { Field, getFieldCapabilities } from "../../../../types";
import { useFormBuilder } from "../../../../context";
import { LayoutSection } from "./components/LayoutSection";
import { TypographySection } from "./components/TypographySection";
import { DecorationSection } from "./components/DecorationSection";
import { resolveBreakpointStyle } from "../../../../utils/styleUtils";
import { StyleSwitcher } from "./components/StyleSwitcher";

interface StyleTabProps {
    field: Field;
}

export const StyleTab: React.FC<StyleTabProps> = ({ field }) => {
    const { updateField, updateFieldStyleBatch, setActiveSubElement, activeBreakpoint } = useFormBuilder();

    // Get field capabilities
    const capabilities = useMemo(() => getFieldCapabilities(field.type), [field.type]);

    // Use updateFieldStyleBatch for individual updates too, as it handles responsive nesting correctly
    const handleStyleUpdate = (key: string, value: string | number | undefined) => {
        updateFieldStyleBatch(field.id, { [key]: value });
    };

    const handleStyleBatchUpdate = (updates: Record<string, string | number | undefined>) => {
        updateFieldStyleBatch(field.id, updates);
    };

    const getStyleValue = (key: string, defaultValue: string | number | undefined = "") => {
        const resolvedStyle = resolveBreakpointStyle(field.style, activeBreakpoint);
        return (resolvedStyle as Record<string, string | number | undefined>)?.[key] ?? defaultValue;
    };



    return (
        <div className="space-y-6">
            {/* Breakpoint / Copy From Control */}
            <StyleSwitcher
                field={field}
                activeBreakpoint={activeBreakpoint}
                updateField={updateField}
            />

            {/* Layout Section */}
            <LayoutSection
                field={field}
                capabilities={capabilities}
                getStyleValue={getStyleValue}
                handleStyleUpdate={handleStyleUpdate}
                handleStyleBatchUpdate={handleStyleBatchUpdate}
                setActiveSubElement={setActiveSubElement}
            />

            <div className="border-t border-gray-200 dark:border-gray-700" />

            {/* Typography Section */}
            <TypographySection
                field={field}
                capabilities={capabilities}
                getStyleValue={getStyleValue}
                handleStyleUpdate={handleStyleUpdate}
                setActiveSubElement={setActiveSubElement}
            />

            <div className="border-t border-gray-200 dark:border-gray-700" />

            {/* Decoration Section */}
            <DecorationSection
                field={field}
                capabilities={capabilities}
                getStyleValue={getStyleValue}
                handleStyleUpdate={handleStyleUpdate}
                handleStyleBatchUpdate={handleStyleBatchUpdate}
                setActiveSubElement={setActiveSubElement}
            />
        </div>
    );
};
