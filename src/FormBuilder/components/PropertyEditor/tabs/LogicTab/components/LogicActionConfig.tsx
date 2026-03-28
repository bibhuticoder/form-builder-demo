import React from "react";
import { Field } from "../../../../../types";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import RichText from "../../../../../../components/RichText";

interface LogicActionConfigProps {
    type: 'redirect' | 'message' | 'disqualify' | 'visibility';
    action: { action: string; targetField: string };
    onChange: (action: { action: string; targetField: string }) => void;
    fields: Field[];
}

export const LogicActionConfig: React.FC<LogicActionConfigProps> = ({ type, action, onChange, fields }) => {
    const getFieldLabel = (f: Field) => {
        return (f as any).label || f.type;
    };

    return (
        <div className="bg-primary/5 dark:bg-primary/10 p-3 rounded-lg border border-primary/20 dark:border-primary/20 space-y-3 overflow-auto">
            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                <span className="bg-primary/10 dark:bg-primary/30 text-primary dark:text-primary px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">THEN</span>
                <span>Perform action:</span>
            </div>

            {type === 'visibility' && (
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Action</label>
                        <select
                            className="shadow w-full text-xs border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary focus:outline-none py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            value={action.action}
                            onChange={(e) => onChange({ ...action, action: e.target.value })}
                        >
                            <option value="">Select Action...</option>
                            <option value="show">Show Field</option>
                            <option value="hide">Hide Field</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Target Field</label>
                        <select
                            className="shadow w-full text-xs border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary focus:outline-none py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            value={action.targetField}
                            onChange={(e) => onChange({ ...action, targetField: e.target.value })}
                        >
                            <option value="">Select Field...</option>
                            {fields.map(f => (
                                <option key={f.id} value={f.id}>{getFieldLabel(f)}</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {type === 'redirect' && (
                <div className="space-y-1">
                    <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Redirect URL</label>
                    <input
                        type="url"
                        className="shadow w-full text-xs border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary focus:outline-none focus:ring-1 px-2 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="https://example.com/thank-you"
                        value={action.action}
                        onChange={(e) => onChange({ ...action, action: e.target.value })}
                    />
                </div>
            )}

            {type === 'message' && (
                <div className="space-y-1">
                    <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Message</label>
                    <RichText
                        content={action.action}
                        onChange={(html) => onChange({ ...action, action: html })}
                        placeholder="Success message..."
                    />
                </div>
            )}

            {type === 'disqualify' && (
                <div className="space-y-3">
                    <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-100 dark:border-red-900/30 flex items-center gap-2">
                        <NoSymbolIcon className="w-4 h-4" />
                        Lead will be rejected as disqualified.
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Custom Message</label>
                        <RichText
                            content={action.action}
                            onChange={(html) => onChange({ ...action, action: html })}
                            placeholder="Reason for disqualification..."
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
