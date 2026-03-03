import React, { useState, useCallback, useEffect, useRef } from "react";
import { Dialog } from "@/components/Dialog";
import { TemplateSettings, CustomHeader } from "../../types";
import { Button } from "@/components";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ColorControl } from "../PropertyEditor/components/ColorControl";

interface EmailSettingsProps {
    isOpen: boolean;
    onSave: () => void;
    onCancel: () => void;
    onChangeRealTime: (settings: Partial<TemplateSettings>) => void;
    initialConfig?: Partial<TemplateSettings>;
}

const inputClass = "shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary";
const labelClass = "block text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1";
const sectionTitle = "text-sm font-semibold text-gray-900 dark:text-white mb-3";

const Switch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${checked ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"}`}
    >
        <span className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
    </button>
);

export const EmailSettings: React.FC<EmailSettingsProps> = ({
    isOpen,
    onSave,
    onCancel,
    onChangeRealTime,
    initialConfig,
}) => {
    const [config, setConfig] = useState<Partial<TemplateSettings>>({
        ...initialConfig,
        settings: { ...initialConfig?.settings } as any,
    });

    const prevIsOpenRef = useRef(false);
    useEffect(() => {
        if (isOpen && !prevIsOpenRef.current) {
            setConfig({
                ...initialConfig,
                settings: { ...initialConfig?.settings } as any,
            });
        }
        prevIsOpenRef.current = isOpen;
    }, [isOpen, initialConfig]);

    const handleChange = useCallback(
        (key: keyof TemplateSettings, value: any) => {
            setConfig((prev) => {
                const updated = { ...prev, [key]: value };
                onChangeRealTime(updated);
                return updated;
            });
        },
        [onChangeRealTime],
    );

    const handleSettingsChange = useCallback(
        (key: string, value: any) => {
            setConfig((prev) => {
                const updated = {
                    ...prev,
                    settings: { ...prev.settings, [key]: value } as any,
                };
                onChangeRealTime(updated);
                return updated;
            });
        },
        [onChangeRealTime],
    );

    const handleCancel = useCallback(() => {
        setConfig({ ...initialConfig });
        onCancel();
    }, [initialConfig, onCancel]);

    const customHeaders: CustomHeader[] = config.customHeaders ?? [];

    const addCustomHeader = () => {
        handleChange("customHeaders", [...customHeaders, { name: "", value: "" }]);
    };

    const updateCustomHeader = (index: number, field: keyof CustomHeader, value: string) => {
        const updated = customHeaders.map((h, i) => i === index ? { ...h, [field]: value } : h);
        handleChange("customHeaders", updated);
    };

    const removeCustomHeader = (index: number) => {
        handleChange("customHeaders", customHeaders.filter((_, i) => i !== index));
    };

    const ccBccEnabled = config.ccBccEnabled ?? false;

    return (
        <Dialog
            isOpen={isOpen}
            header="Email Settings"
            subtitle="Configure sender details, tracking, and styling for your email."
            onClose={handleCancel}
            isCloseable={true}
            className="max-w-[560px]"
            body={
                <div className="space-y-6 max-h-[65vh] overflow-y-auto scrollbar-hide-hover px-1 pb-4">

                    {/* ── Subject & Preheader ── */}
                    <div className="space-y-4">
                        <h3 className={sectionTitle}>Subject</h3>

                        <div>
                            <label className={labelClass}>Subject Line</label>
                            <input
                                type="text"
                                placeholder="New Campaign"
                                value={config.subject ?? ""}
                                onChange={(e) => handleChange("subject", e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Preheader Text</label>
                            <textarea
                                rows={2}
                                placeholder="Preview text shows here..."
                                value={config.preheader ?? ""}
                                onChange={(e) => handleChange("preheader", e.target.value)}
                                className={`${inputClass} resize-none`}
                            />
                            <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-1">Text that appears after the subject line in the inbox.</p>
                        </div>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    {/* ── Sender Info ── */}
                    <div className="space-y-4">
                        <h3 className={sectionTitle}>Sender</h3>

                        <div>
                            <label className={labelClass}>From Name</label>
                            <input
                                type="text"
                                placeholder="My Company"
                                value={config.fromName ?? ""}
                                onChange={(e) => handleChange("fromName", e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>From Email</label>
                            <input
                                type="email"
                                placeholder="hello@mycompany.com"
                                value={config.fromEmail ?? ""}
                                onChange={(e) => handleChange("fromEmail", e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Reply-To Email</label>
                            <input
                                type="email"
                                placeholder="Same as From Email"
                                value={config.replyTo ?? ""}
                                onChange={(e) => handleChange("replyTo", e.target.value)}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    {/* ── CC / BCC ── */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className={`${sectionTitle} mb-0`}>CC / BCC</h3>
                            <Switch
                                checked={ccBccEnabled}
                                onChange={(v) => handleChange("ccBccEnabled", v)}
                            />
                        </div>

                        {ccBccEnabled && (
                            <div className="space-y-2">
                                <div>
                                    <label className={labelClass}>CC</label>
                                    <input
                                        type="text"
                                        placeholder="cc@example.com"
                                        value={config.cc ?? ""}
                                        onChange={(e) => handleChange("cc", e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>BCC</label>
                                    <input
                                        type="text"
                                        placeholder="bcc@example.com"
                                        value={config.bcc ?? ""}
                                        onChange={(e) => handleChange("bcc", e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-gray-400">Separate multiple emails with commas</p>
                            </div>
                        )}
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    {/* ── Custom Headers ── */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className={`${sectionTitle} mb-0`}>Custom Headers</h3>
                            <Button
                                variant="secondary"
                                className="h-6 w-6 !p-0 flex items-center justify-center"
                                onClick={addCustomHeader}
                                title="Add header"
                            >
                                <PlusIcon className="w-3.5 h-3.5" />
                            </Button>
                        </div>

                        {customHeaders.length === 0 ? (
                            <div className="text-center py-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                <p className="text-xs text-slate-400 dark:text-gray-500">No custom headers added</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {customHeaders.map((header, index) => (
                                    <div key={index} className="flex gap-2 items-start">
                                        <div className="flex-1 grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                placeholder="Name (e.g. X-Custom-ID)"
                                                value={header.name}
                                                onChange={(e) => updateCustomHeader(index, "name", e.target.value)}
                                                className={inputClass}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Value"
                                                value={header.value}
                                                onChange={(e) => updateCustomHeader(index, "value", e.target.value)}
                                                className={inputClass}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeCustomHeader(index)}
                                            className="mt-1 p-1 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <hr className="border-gray-200 dark:border-gray-700" />

                    {/* ── Styling ── */}
                    <div className="space-y-4">
                        <h3 className={sectionTitle}>Styling</h3>

                        <div>
                            <label className={labelClass}>Content Width (px)</label>
                            <input
                                type="number"
                                value={config.settings?.contentWidth ?? 600}
                                onChange={(e) => handleSettingsChange("contentWidth", Number(e.target.value))}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Font Family</label>
                            <select
                                value={config.settings?.fontFamily ?? "Arial, sans-serif"}
                                onChange={(e) => handleSettingsChange("fontFamily", e.target.value)}
                                className={inputClass}
                            >
                                <option value="Arial, sans-serif">Arial</option>
                                <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
                                <option value="'Times New Roman', Times, serif">Times New Roman</option>
                                <option value="Georgia, serif">Georgia</option>
                            </select>
                        </div>

                        <ColorControl
                            label="Background Color"
                            value={String(config.settings?.backgroundColor ?? "#f9fafb")}
                            onChange={(v) => handleSettingsChange("backgroundColor", v)}
                        />
                    </div>
                </div>
            }
            footer={
                <div className="flex gap-3 justify-end">
                    <Button className="text-xs" onClick={handleCancel} variant="secondary">
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={onSave} className="text-xs">
                        Save Changes
                    </Button>
                </div>
            }
        />
    );
};
