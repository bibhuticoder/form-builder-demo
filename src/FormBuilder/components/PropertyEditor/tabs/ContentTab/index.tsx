import React from "react";
import { Field, InputField } from "../../../../types";
import { useFormBuilder } from "../../../../context";
import { getFieldCapabilities } from "../../../../types/field-capabilities";
import { ContentSection } from "./components/ContentSection";
import { OptionsSection } from "./components/OptionsSection";
import { MediaSection } from "./components/MediaSection";
import { SettingsSection } from "./components/SettingsSection";

interface ContentTabProps {
    field: Field;
}

// Helper to slugify text
const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

export const ContentTab: React.FC<ContentTabProps> = ({ field }) => {
    const { updateField } = useFormBuilder();

    const handleUpdate = (key: string, value: unknown) => {
        const updates: Partial<Field> = { [key]: value } as Partial<Field>;

        // Auto-generate name from label if not customized
        if (key === "label" && !(field as InputField & { isNameCustomized?: boolean }).isNameCustomized) {
            (updates as Partial<InputField>).name = slugify(value as string);
        }

        updateField(field.id, updates);
    };

    const capabilities = getFieldCapabilities(field.type);

    return (
        <div className="space-y-3">
            <ContentSection
                field={field}
                capabilities={capabilities}
                handleUpdate={handleUpdate}
            />

            <OptionsSection
                field={field}
                capabilities={capabilities}
                handleUpdate={handleUpdate}
            />

            <MediaSection
                field={field}
                handleUpdate={handleUpdate}
            />

            <SettingsSection
                field={field}
                capabilities={capabilities}
                handleUpdate={handleUpdate}
            />
        </div>
    );
};
