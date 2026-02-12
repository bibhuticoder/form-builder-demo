import React from 'react';
import { Field, LogicExpression, LogicCondition, LogicComparison, FieldType } from '../../../../../types';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface LogicBuilderProps {
    expression: LogicExpression;
    onChange: (expression: LogicExpression) => void;
    fields: Field[];
    restrictedMode?: boolean;
}

export const LogicBuilder: React.FC<LogicBuilderProps> = ({
    expression,
    onChange,
    fields,
    restrictedMode = false
}) => {

    // Helper to update a specific condition at index
    const handleUpdateCondition = (index: number, newCondition: LogicCondition) => {
        const newConditions = [...expression.conditions];
        newConditions[index] = newCondition;
        onChange({ conditions: newConditions });
    };

    // Helper to add a new condition - accepts op to link FROM previous
    const handleAddCondition = (op: 'and' | 'or' = 'and') => {
        const newCondition: LogicCondition = {
            id: crypto.randomUUID(),
            comparison: LogicComparison.EQ,
            left: { var: '' },
            right: { str: '' },
            logicalOp: 'and' // default joiner to next
        };

        // If not empty, ensure the last one has the selected joiner
        const newConditions = [...expression.conditions];
        if (newConditions.length > 0) {
            const lastIndex = newConditions.length - 1;
            newConditions[lastIndex].logicalOp = op;
        }

        onChange({ conditions: [...newConditions, newCondition] });
    };

    // Helper to remove a condition
    const handleRemoveCondition = (index: number) => {
        const newConditions = [...expression.conditions];
        newConditions.splice(index, 1);
        onChange({ conditions: newConditions });
    };

    // Helper to update the joiner operator for a condition (e.g. index 0 joins 0 and 1)
    const handleUpdateJoiner = (index: number, op: 'and' | 'or') => {
        const newConditions = [...expression.conditions];
        newConditions[index] = { ...newConditions[index], logicalOp: op };
        onChange({ conditions: newConditions });
    };

    // Get label for field dropdown
    const getFieldLabel = (f: Field) => {
        return (f as any).label || f.type;
    };

    // Filter fields based on mode
    const visibleFields = restrictedMode
        ? fields.filter(f => f.type === FieldType.BUTTON && (f as any).action === 'submit')
        : fields;

    return (
        <div className="space-y-2 w-fit min-w-[450px]">
            {expression.conditions.map((condition, index) => {
                const isLast = index === expression.conditions.length - 1;

                return (
                    <div key={condition.id || index} className="flex flex-col gap-1">
                        {/* Condition Row */}
                        <div className="grid grid-cols-12 gap-2 items-center bg-white dark:bg-gray-800 p-1 rounded border border-gray-100 dark:border-gray-700 shadow-sm relative group">

                            {/* Field Selection */}
                            <div className={`${[LogicComparison.IS_EMPTY, LogicComparison.EXISTS, LogicComparison.ON_SUBMIT].includes(condition.comparison) ? 'col-span-6' : 'col-span-4'} `}>
                                <select
                                    className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary focus:outline-none px-2 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    value={condition.left.var || ''}
                                    onChange={(e) => handleUpdateCondition(index, {
                                        ...condition,
                                        left: { ...condition.left, var: e.target.value },
                                        comparison: restrictedMode || e.target.value === 'submit_btn' ? LogicComparison.ON_SUBMIT : LogicComparison.EQ
                                    })}
                                >
                                    <option value="">Select Field...</option>
                                    {visibleFields.map(f => (
                                        <option key={f.id} value={f.id}>{getFieldLabel(f)}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Operator Selection */}
                            <div className={`${[LogicComparison.IS_EMPTY, LogicComparison.EXISTS, LogicComparison.ON_SUBMIT].includes(condition.comparison) ? 'col-span-5' : 'col-span-3'} `}>
                                <select
                                    className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary focus:outline-none px-2 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500"
                                    value={condition.comparison}
                                    onChange={(e) => handleUpdateCondition(index, { ...condition, comparison: e.target.value as LogicComparison })}
                                    disabled={restrictedMode}
                                >
                                    {restrictedMode ? (
                                        <option value={LogicComparison.ON_SUBMIT}>On Submit</option>
                                    ) : (
                                        condition.left.var === 'submit_btn' ? (
                                            <option value={LogicComparison.ON_SUBMIT}>On Submit</option>
                                        ) : (
                                            <>
                                                <option value={LogicComparison.EQ}>Equals</option>
                                                <option value={LogicComparison.NEQ}>Does not equal</option>
                                                <option value={LogicComparison.CONTAINS}>Contains</option>
                                                <option value={LogicComparison.IS_EMPTY}>Is Empty</option>
                                                <option value={LogicComparison.EXISTS}>Is Not Empty</option>
                                                <option value={LogicComparison.GT}>Greater Than</option>
                                                <option value={LogicComparison.LT}>Less Than</option>
                                                <option value={LogicComparison.GTE}>Greater/Equal</option>
                                                <option value={LogicComparison.LTE}>Less/Equal</option>
                                            </>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Value Input */}
                            {![LogicComparison.IS_EMPTY, LogicComparison.EXISTS, LogicComparison.ON_SUBMIT].includes(condition.comparison) && (
                                <div className="col-span-4">
                                    <input
                                        type="text"
                                        className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary focus:outline-none px-2 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400"
                                        placeholder="Value..."
                                        value={condition.right?.str || ''}
                                        onChange={(e) => handleUpdateCondition(index, { ...condition, right: { ...condition.right, str: e.target.value } })}
                                    />
                                </div>
                            )}

                            {/* Remove Button */}
                            {!restrictedMode && (
                                <div className="col-span-1 flex justify-start">
                                    <button
                                        onClick={() => handleRemoveCondition(index)}
                                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                        title="Remove Condition"
                                    >
                                        <XMarkIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Joiner (AND/OR) Button Group - only if not last */}
                        {!isLast && !restrictedMode && (
                            <div className="flex justify-start relative">
                                {/* Vertical line behind */}
                                <div className="absolute top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700 left-1/2 -translate-x-1/2 -z-10"></div>

                                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 border border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => handleUpdateJoiner(index, 'and')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${condition.logicalOp === 'and' || !condition.logicalOp
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                            }`}
                                    >
                                        AND
                                    </button>
                                    <button
                                        onClick={() => handleUpdateJoiner(index, 'or')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${condition.logicalOp === 'or'
                                            ? 'bg-primary text-white shadow-sm'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                            }`}
                                    >
                                        OR
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Add Button */}
            {!restrictedMode && (
                <div className="flex justify-start mt-2">
                    {expression.conditions.length === 0 ? (
                        <button
                            onClick={() => handleAddCondition('and')}
                            className="text-xs flex items-center gap-1 text-primary hover:text-primary-dark font-medium px-2 py-1 hover:bg-primary/5 rounded transition-colors"
                        >
                            <PlusIcon className="w-3 h-3" /> Condition
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleAddCondition('and')}
                                className="text-xs flex items-center gap-1 text-primary hover:text-primary-dark font-medium px-2 py-1 hover:bg-primary/5 rounded transition-colors border border-primary/20"
                            >
                                <PlusIcon className="w-3 h-3" /> AND
                            </button>
                            <button
                                onClick={() => handleAddCondition('or')}
                                className="text-xs flex items-center gap-1 text-primary hover:text-primary-dark font-medium px-2 py-1 hover:bg-primary/5 rounded transition-colors border border-primary/20"
                            >
                                <PlusIcon className="w-3 h-3" /> OR
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
