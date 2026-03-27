import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useEmailBuilder } from "../../context";
import { EmailSettings } from "./EmailSettings";
import { useState, useRef } from "react";
import { TemplateSettings } from "../../types";

export const EmailSettingsTrigger: React.FC = () => {
    const [showSettings, setShowSettings] = useState(false);
    const initialSettingsRef = useRef<TemplateSettings | null>(null);
    const { jsonContent, updateTemplateSettings } = useEmailBuilder();

    const handleOpenSettings = () => {
        initialSettingsRef.current = structuredClone(jsonContent.templateSettings);
        setShowSettings(true);
    };

    const handleSave = () => {
        setShowSettings(false);
        initialSettingsRef.current = null;
    };

    const handleCancel = () => {
        if (initialSettingsRef.current) {
            updateTemplateSettings(initialSettingsRef.current);
        }
        setShowSettings(false);
        initialSettingsRef.current = null;
    };

    return (
        <>
            <button
                type="button"
                onClick={handleOpenSettings}
                aria-label="Open email settings"
                className="inline-flex items-center justify-center p-1"
            >
                <Cog6ToothIcon
                    className="w-5 h-5 transition-colors text-gray-400 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white"
                />
            </button>

            <EmailSettings
                isOpen={showSettings}
                initialConfig={jsonContent.templateSettings}
                onSave={handleSave}
                onCancel={handleCancel}
                onChangeRealTime={updateTemplateSettings}
            />
        </>
    );
};
