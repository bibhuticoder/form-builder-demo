import React from "react";
import { LogicRule, LogicEvent, LogicOperation, LogicComparison } from "../../../../../types";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { getLogicTypeFromRule, getLogicTypeInfo } from "../utils";

interface LogicListProps {
    rules: LogicRule[];
    onEdit: (rule: LogicRule) => void;
    onDelete: (id: string) => void;
}

export const LogicList: React.FC<LogicListProps> = ({ rules, onEdit, onDelete }) => {
    const formatCondition = (rule: LogicRule) => {
        const count = rule.if.args.length;
        if (count === 0) return <span className="text-gray-400">No conditions</span>;

        const op = rule.if.operation === LogicOperation.OR ? 'OR' : 'AND';

        // Just show first condition + "and X more" if multiple
        const firstArg: any = rule.if.args[0];
        const fieldName = firstArg.left?.var || 'Form';
        const operator = firstArg.comparison;
        const value = firstArg.right?.str || '';

        let readableOp = 'is equal to';
        if (operator === LogicComparison.NEQ) readableOp = 'is not equal to';
        if (operator === LogicComparison.CONTAINS) readableOp = 'contains';
        if (operator === LogicComparison.IS_EMPTY) readableOp = 'is empty';
        if (operator === LogicComparison.EXISTS) readableOp = 'is not empty';

        let textSpy = (
            <span className="text-xs">
                If <span className="font-semibold text-blue-600 dark:text-blue-400">"{fieldName}"</span> <span className="text-purple-600 dark:text-purple-400 font-medium">{readableOp}</span> {value && <span className="font-semibold text-orange-600 dark:text-orange-400">"{value}"</span>}
            </span>
        );

        if (rule.trigger.event === LogicEvent.SUBMISSION_ATTEMPT) {
            textSpy = (
                <span className="text-xs">
                    On <span className="font-semibold text-blue-600 dark:text-blue-400">Submit</span>
                </span>
            );
        }

        if (count > 1) {
            return (
                <span className="font-bold">
                    {textSpy} <span className="text-[10px] border rounded bg-gray-200 whitespace-nowrap px-1.5 py-0.5">+{count - 1} {op}</span>
                </span>
            );
        }

        return textSpy;
    };

    return (
        <div className="space-y-2">
            {rules.map(rule => {
                const type = getLogicTypeFromRule(rule);
                const typeInfo = getLogicTypeInfo(type);
                const Icon = typeInfo.icon;

                return (
                    <div key={rule.id} className="select-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-2 text-xs shadow-sm flex justify-between items-center group hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                        <div className="flex flex-col gap-2 w-full">

                            {/* Type and action buttons */}
                            <div className="flex justify-between">
                                <span className={`px-1.5 py-0.5 w-fit rounded text-[10px] uppercase font-bold tracking-wide shrink-0 ${typeInfo.className} flex items-center gap-1`}>
                                    <Icon className="w-3 h-3" />
                                    {typeInfo.label}
                                </span>

                                <div className="flex gap-1 transition-opacity shrink-0">
                                    <button onClick={() => onEdit(rule)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        <PencilIcon className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => onDelete(rule.id)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                        <TrashIcon className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Logic Name */}
                            <div className="text-gray-700 dark:text-gray-300">
                                {formatCondition(rule)}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
