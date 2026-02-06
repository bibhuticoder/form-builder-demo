import React from "react";
import { Field, LogicExpression } from "../../../../../types";
import { LogicBuilder } from "./LogicBuilder";
import { LogicActionConfig } from "./LogicActionConfig";

interface LogicRuleEditorProps {
    expression: LogicExpression;
    onExpressionChange: (expr: LogicExpression) => void;
    action: { action: string; targetField: string };
    onActionChange: (action: { action: string; targetField: string }) => void;
    type: 'redirect' | 'message' | 'disqualify' | 'visibility';
    fields: Field[];
}

export const LogicRuleEditor: React.FC<LogicRuleEditorProps> = ({
    expression,
    onExpressionChange,
    action,
    onActionChange,
    type,
    fields
}) => {
    const isRestricted = ['message', 'redirect'].includes(type);

    return (
        <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700 min-h-[150px] overflow-x-auto">
                <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Logic Conditions</h5>
                <LogicBuilder
                    expression={expression}
                    onChange={onExpressionChange}
                    fields={fields}
                    restrictedMode={isRestricted}
                />
            </div>

            <LogicActionConfig
                type={type}
                action={action}
                onChange={onActionChange}
                fields={fields}
            />
        </div>
    );
};
