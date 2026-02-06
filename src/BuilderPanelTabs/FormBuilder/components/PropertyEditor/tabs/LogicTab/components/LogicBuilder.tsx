import React from 'react';
import { Field, LogicExpression, LogicCondition, LogicOperation, LogicComparison, FieldType } from '../../../../../types';
import { PlusIcon, XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

interface LogicBuilderProps {
    expression: LogicExpression;
    onChange: (expression: LogicExpression) => void;
    onRemove?: () => void;
    fields: Field[];
    depth?: number;
    restrictedMode?: boolean;
}

export const LogicBuilder: React.FC<LogicBuilderProps> = ({
    expression,
    onChange,
    onRemove,
    fields,
    depth = 0,
    restrictedMode = false
}) => {
    // Filter fields based on mode
    const visibleFields = restrictedMode
        ? fields.filter(f => f.type === FieldType.BUTTON && (f as any).action === 'submit')
        : fields;

    // Initialize/Enforce restricted mode state
    React.useEffect(() => {
        if (restrictedMode && depth === 0) {
            // Ensure we have exactly one condition
            if (expression.args.length !== 1 || (expression.args[0] as LogicExpression).operation) {
                const submitButtons = fields.filter(f => f.type === FieldType.BUTTON && (f as any).action === 'submit');
                if (submitButtons.length > 0) {
                    onChange({
                        ...expression,
                        args: [{
                            comparison: LogicComparison.ON_SUBMIT,
                            left: { var: submitButtons[0].id },
                            right: { str: '' }
                        }]
                    });
                }
            }
        }
    }, [restrictedMode, depth]);

    const handleOperationChange = (op: LogicOperation) => {
        onChange({ ...expression, operation: op });
    };

    const handleAddCondition = () => {
        const newCondition: LogicCondition = {
            comparison: LogicComparison.EQ,
            left: { var: '' },
            right: { str: '' }
        };
        onChange({
            ...expression,
            args: [...expression.args, newCondition]
        });
    };

    const handleAddGroup = () => {
        const newGroup: LogicExpression = {
            operation: LogicOperation.AND,
            args: [
                {
                    comparison: LogicComparison.EQ,
                    left: { var: '' },
                    right: { str: '' }
                }
            ]
        };
        onChange({
            ...expression,
            args: [...expression.args, newGroup]
        });
    };

    const handleRemoveArg = (index: number) => {
        const newArgs = [...expression.args];
        newArgs.splice(index, 1);
        onChange({ ...expression, args: newArgs });
    };

    const handleUpdateArg = (index: number, newValue: LogicCondition | LogicExpression) => {
        const newArgs = [...expression.args];
        newArgs[index] = newValue;
        onChange({ ...expression, args: newArgs });
    };

    const getFieldLabel = (f: Field) => {
        return (f as any).label || f.type;
    };

    const isExpression = (arg: any): arg is LogicExpression => {
        return (arg as LogicExpression).operation !== undefined;
    };

    const MAX_NESTING_LEVEL = 3;

    return (
        <div className={`
      ${depth > 1 ? 'ml-4 mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 relative' : 'space-y-3'} min-w-[500px] w-fit
    `}>
            {/* Connecting line for nested groups */}
            {depth > 1 && (
                <div className="absolute -left-4 top-4 w-4 h-0.5 bg-gray-200 dark:bg-gray-600"></div>
            )}

            {/* Header for Group */}
            {!restrictedMode && (
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Match</span>
                        <select
                            className="shadow text-xs border-none bg-primary/10 dark:bg-primary/30 text-primary dark:text-primary rounded px-2 py-0.5 font-bold uppercase cursor-pointer focus:ring-2 focus:ring-primary"
                            value={expression.operation}
                            onChange={(e) => handleOperationChange(e.target.value as LogicOperation)}
                        >
                            <option value={LogicOperation.AND}>ALL</option>
                            <option value={LogicOperation.OR}>ANY</option>
                        </select>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">of the following:</span>
                    </div>

                    {onRemove && (
                        <button
                            onClick={onRemove}
                            className="ml-auto p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove Group"
                        >
                            <TrashIcon className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}

            {/* List of Conditions/Groups */}
            <div className="space-y-2 relative">
                {/* Vertical line connecting items */}
                {!restrictedMode && expression.args.length > 0 && depth > 0 && <div className="absolute left-2 top-0 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700 -z-10"></div>}

                {expression.args.map((arg, index) => (
                    <div key={index} className={`relative ${depth > 0 ? 'pl-6' : ''}`}>
                        {/* Horizontal line for items */}
                        {!restrictedMode && depth > 0 && <div className="absolute left-2 top-3 w-4 h-0.5 bg-gray-200 dark:bg-gray-700"></div>}

                        {isExpression(arg) ? (
                            <LogicBuilder
                                expression={arg}
                                onChange={(val) => handleUpdateArg(index, val)}
                                onRemove={() => handleRemoveArg(index)}
                                fields={fields}
                                depth={depth + 1}
                                restrictedMode={restrictedMode}
                            />
                        ) : (
                            // Single Condition Row
                            <div className="grid grid-cols-12 gap-2 items-start bg-white dark:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-700 shadow-sm relative group">
                                {/* Field Selection */}
                                <div className={`${[LogicComparison.IS_EMPTY, LogicComparison.EXISTS, LogicComparison.ON_SUBMIT].includes(arg.comparison) ? 'col-span-6' : 'col-span-4'}`}>
                                    <select
                                        className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary focus:outline-none px-2 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        value={arg.left.var || ''}
                                        onChange={(e) => handleUpdateArg(index, {
                                            ...arg,
                                            left: { ...arg.left, var: e.target.value },
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
                                <div className={`${[LogicComparison.IS_EMPTY, LogicComparison.EXISTS, LogicComparison.ON_SUBMIT].includes(arg.comparison) ? 'col-span-5' : 'col-span-3'}`}>
                                    <select
                                        className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary focus:outline-none px-2 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500"
                                        value={arg.comparison}
                                        onChange={(e) => handleUpdateArg(index, { ...arg, comparison: e.target.value as LogicComparison })}
                                        disabled={restrictedMode}
                                    >
                                        {restrictedMode ? (
                                            <option value={LogicComparison.ON_SUBMIT}>On Submit</option>
                                        ) : (
                                            arg.left.var === 'submit_btn' ? (
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

                                {/* Value Input - Hidden when not needed */}
                                {![LogicComparison.IS_EMPTY, LogicComparison.EXISTS, LogicComparison.ON_SUBMIT].includes(arg.comparison) && (
                                    <div className="col-span-4">
                                        <input
                                            type="text"
                                            className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary focus:outline-none px-2 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400"
                                            placeholder="Value..."
                                            value={arg.right?.str || ''}
                                            onChange={(e) => handleUpdateArg(index, { ...arg, right: { ...arg.right, str: e.target.value } })}
                                        />
                                    </div>
                                )}

                                {/* Remove Button */}
                                {!restrictedMode && (
                                    <div className="col-span-1 flex justify-center">
                                        <button
                                            onClick={() => handleRemoveArg(index)}
                                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                            title="Remove Condition"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Buttons */}
            {!restrictedMode && (
                <div className={`flex gap-2 mt-2 ${depth > 0 ? 'pl-6' : ''}`}>
                    <button
                        onClick={handleAddCondition}
                        className="text-xs flex items-center gap-1 text-primary hover:text-primary-dark font-medium px-2 py-1 hover:bg-primary/5 rounded transition-colors"
                    >
                        <PlusIcon className="w-3 h-3" /> Condition
                    </button>
                    {depth < MAX_NESTING_LEVEL && (
                        <button
                            onClick={handleAddGroup}
                            className="text-xs flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                            <PlusIcon className="w-3 h-3" /> Group
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
