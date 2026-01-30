import React, { useMemo } from "react";
import { Field, getFieldCapabilities } from "../../../../types";
import { useFormBuilder } from "../../../../context";
import { LayoutSection } from "./components/LayoutSection";
import { TypographySection } from "./components/TypographySection";
import { DecorationSection } from "./components/DecorationSection";

interface StyleTabProps {
    field: Field;
}

export const StyleTab: React.FC<StyleTabProps> = ({ field }) => {
    const { updateField, updateFieldStyleBatch, setActiveSubElement } = useFormBuilder();

    // Get field capabilities
    const capabilities = useMemo(() => getFieldCapabilities(field.type), [field.type]);

    const handleStyleUpdate = (key: string, value: string | number | undefined) => {
        updateField(field.id, {
            style: { ...field.style, [key]: value },
        });
    };

    const handleStyleBatchUpdate = (updates: Record<string, string | number | undefined>) => {
        updateFieldStyleBatch(field.id, updates);
    };

    const getStyleValue = (key: string, defaultValue: string | number | undefined = "") => {
        return (field.style as Record<string, string | number | undefined>)?.[key] ?? defaultValue;
    };

    return (
        <div className="space-y-6">
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
