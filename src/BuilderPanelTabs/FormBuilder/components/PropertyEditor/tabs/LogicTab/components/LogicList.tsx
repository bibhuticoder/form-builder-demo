import React from "react";
import { LogicRule, LogicEvent } from "../../../../../types";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getLogicTypeFromRule, getLogicTypeInfo } from "../utils";

interface LogicListProps {
    rules: LogicRule[];
    onEdit: (rule: LogicRule) => void;
    onDelete: (id: string) => void;
}

export const LogicList: React.FC<LogicListProps> = ({ rules, onEdit, onDelete }) => {
    const formatCondition = (rule: LogicRule) => {
        if (!rule.if) {
            if (rule.trigger.event === LogicEvent.SUBMISSION_SUCCESS) {
                return (
                    <span className="text-xs">
                        On <span className="font-semibold text-primary dark:text-primary">Form Submit</span>
                    </span>
                );
            }
            return <span className="text-gray-400">No conditions</span>;
        }

        const conditions = rule.if.conditions;
        if (!conditions || conditions.length === 0) return <span className="text-gray-400">No conditions</span>;

        return (
            <div className="flex flex-wrap items-center gap-1 text-xs">
                {conditions.map((cond, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && (
                            <span className="font-bold text-gray-400 uppercase text-[10px] mx-1">
                                {conditions[index - 1].logicalOp || 'AND'}
                            </span>
                        )}
                        <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                            <span className="font-medium text-indigo-600 dark:text-indigo-400">{cond.left.var}</span>
                            <span className="mx-1 text-gray-400">{cond.comparison}</span>
                            {cond.right?.str && <span className="font-medium text-gray-900 dark:text-gray-100">"{cond.right.str}"</span>}
                        </span>
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-2">
            {rules.map(rule => {
                const type = getLogicTypeFromRule(rule);
                const typeInfo = getLogicTypeInfo(type);
                const Icon = typeInfo.icon;

                return (
                    <div key={rule.id} className="select-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-2 text-xs shadow-sm flex justify-between items-center group hover:border-primary dark:hover:border-primary transition-colors">
                        <div className="flex flex-col gap-2 w-full">

                            {/* Type and action buttons */}
                            <div className="flex justify-between">
                                <span className={`px-1.5 py-0.5 w-fit rounded text-[10px] uppercase font-bold tracking-wide shrink-0 ${typeInfo.className} flex items-center gap-1`}>
                                    <Icon className="w-3 h-3" />
                                    {typeInfo.label}
                                </span>

                                <div className="flex gap-1 transition-opacity shrink-0">
                                    <button onClick={() => onEdit(rule)} data-testid={`edit-rule-${rule.id}`} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                                        <PencilIcon className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => onDelete(rule.id)} data-testid={`delete-rule-${rule.id}`} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                        <TrashIcon className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Logic Name */}
                            <div className="text-gray-700 dark:text-gray-400">
                                {formatCondition(rule)}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
