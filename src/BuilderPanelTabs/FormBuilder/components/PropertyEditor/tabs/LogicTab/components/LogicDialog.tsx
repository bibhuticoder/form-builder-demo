import React, { useState, useEffect } from "react";
import { Dialog } from "../../../../../../../components/Dialog";
import { Button } from "../../../../../../../components/Button";
import { Field, LogicRule, LogicEvent, LogicOperation, LogicComparison, LogicEffect } from "../../../../../types";
import { ConditionRow } from "../utils";
import {
    ArrowRightCircleIcon,
    ChatBubbleBottomCenterTextIcon,
    NoSymbolIcon,
    EyeIcon,
    ChevronLeftIcon,
    PlusIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";

interface LogicDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (rule: LogicRule) => void;
    initialRule?: LogicRule | null;
    existingRules: LogicRule[];
    formFields: Field[];
}

export const LogicDialog: React.FC<LogicDialogProps> = ({
    isOpen,
    onClose,
    onSave,
    initialRule,
    existingRules,
    formFields
}) => {
    const [logicStep, setLogicStep] = useState<'select' | 'configure'>('select');
    const [selectedRuleType, setSelectedRuleType] = useState<'redirect' | 'message' | 'disqualify' | 'visibility' | null>(null);

    // Nested Logic State
    const [matchType, setMatchType] = useState<'AND' | 'OR'>('AND');
    const [conditions, setConditions] = useState<ConditionRow[]>([]);

    // Action State
    const [ruleAction, setRuleAction] = useState({
        action: '', // visibility: show/hide, redirect: url, message: text
        targetField: '' // for visibility
    });

    // Reset or Initialize state when dialog opens or initialRule changes
    useEffect(() => {
        if (isOpen) {
            if (initialRule) {
                // Edit Mode: Parse existing rule
                const primaryEffect = initialRule.then[0] as any;

                let type: any = 'visibility';
                if (primaryEffect.effect === LogicEffect.NAV_REDIRECT) type = 'redirect';
                if (primaryEffect.effect === LogicEffect.UI_TOAST) type = 'message';
                if (primaryEffect.effect === LogicEffect.SUBMISSION_REJECT) type = 'disqualify';

                const loadedConditions: ConditionRow[] = initialRule.if.args.map((arg: any, index: number) => {
                    let condition = 'equals';
                    if (arg.comparison === LogicComparison.EQ) condition = 'equals';
                    if (arg.comparison === LogicComparison.NEQ) condition = 'not_equals';
                    if (arg.comparison === LogicComparison.CONTAINS) condition = 'contains';
                    if (arg.comparison === LogicComparison.IS_EMPTY) condition = 'is_empty';
                    if (arg.comparison === LogicComparison.EXISTS) condition = 'is_not_empty';
                    if (initialRule.trigger.event === LogicEvent.SUBMISSION_ATTEMPT && index === 0) condition = 'on_submit';

                    return {
                        id: `c_${Date.now()}_${index}`,
                        field: arg.left?.var || '',
                        condition: condition,
                        value: arg.right?.str || ''
                    };
                });

                setConditions(loadedConditions.length > 0 ? loadedConditions : [{ id: 'c_1', field: '', condition: 'equals', value: '' }]);
                setMatchType(initialRule.if.operation === LogicOperation.OR ? 'OR' : 'AND');
                setRuleAction({
                    action: type === 'visibility' ? (primaryEffect.value ? 'show' : 'hide') :
                        type === 'redirect' ? primaryEffect.url :
                            type === 'message' ? primaryEffect.body : '',
                    targetField: primaryEffect.targets?.[0] || ''
                });
                setSelectedRuleType(type);
                setLogicStep('configure');
            } else {
                // Add Mode: Reset
                setLogicStep('select');
                setSelectedRuleType(null);
                setConditions([{ id: 'c_1', field: '', condition: 'equals', value: '' }]);
                setMatchType('AND');
                setRuleAction({ action: '', targetField: '' });
            }
        }
    }, [isOpen, initialRule]);

    const handleSelectRuleType = (type: 'redirect' | 'message' | 'disqualify' | 'visibility') => {
        setSelectedRuleType(type);
        setLogicStep('configure');
        setConditions([{ id: `c_${Date.now()}`, field: '', condition: 'equals', value: '' }]);
    };

    const addConditionRow = () => {
        setConditions([...conditions, { id: `c_${Date.now()}`, field: '', condition: 'equals', value: '' }]);
    };

    const removeConditionRow = (id: string) => {
        if (conditions.length > 1) {
            setConditions(conditions.filter(c => c.id !== id));
        }
    };

    const updateConditionRow = (id: string, updates: Partial<ConditionRow>) => {
        setConditions(conditions.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const getFieldLabel = (f: Field) => {
        return (f as any).label || f.type;
    };

    const generateLogicId = () => {
        let count = existingRules.length + 1;
        let newId = `logic_${count.toString().padStart(2, '0')}`;
        while (existingRules.some(r => r.id === newId)) {
            count++;
            newId = `logic_${count.toString().padStart(2, '0')}`;
        }
        return newId;
    };

    const handleSave = () => {
        const isValid = conditions.every(c => {
            const noValue = ['is_empty', 'is_not_empty', 'on_submit'].includes(c.condition);
            return c.field && (noValue || c.value);
        });

        if (!selectedRuleType || !isValid) return;

        const ruleId = initialRule?.id || generateLogicId();

        let triggerEvent = LogicEvent.FIELD_CHANGE;
        const hasSubmit = conditions.some(c => c.condition === 'on_submit');
        if (hasSubmit) {
            triggerEvent = LogicEvent.SUBMISSION_ATTEMPT;
        }

        const args = conditions.map(c => {
            let comparison = LogicComparison.EQ;
            switch (c.condition) {
                case 'equals': comparison = LogicComparison.EQ; break;
                case 'not_equals': comparison = LogicComparison.NEQ; break;
                case 'contains': comparison = LogicComparison.CONTAINS; break;
                case 'is_empty': comparison = LogicComparison.IS_EMPTY; break;
                case 'is_not_empty': comparison = LogicComparison.EXISTS; break;
            }

            return {
                comparison: comparison,
                left: { var: c.field },
                right: { str: c.value }
            };
        });

        let effectType = LogicEffect.FIELD_VISIBILITY_SET;
        switch (selectedRuleType) {
            case 'visibility': effectType = LogicEffect.FIELD_VISIBILITY_SET; break;
            case 'redirect': effectType = LogicEffect.NAV_REDIRECT; break;
            case 'message': effectType = LogicEffect.UI_TOAST; break;
            case 'disqualify': effectType = LogicEffect.SUBMISSION_REJECT; break;
        }

        const rule: LogicRule = {
            id: ruleId,
            enabled: true,
            trigger: {
                event: triggerEvent,
                fieldId: conditions[0].field
            },
            if: {
                operation: matchType === 'AND' ? LogicOperation.AND : LogicOperation.OR,
                args: args
            },
            then: [
                {
                    effect: effectType,
                    ...(selectedRuleType === 'visibility' ? { targets: [ruleAction.targetField], value: ruleAction.action === 'show' } : {}),
                    ...(selectedRuleType === 'redirect' ? { url: ruleAction.action } : {}),
                    ...(selectedRuleType === 'message' ? { variant: 'success', title: 'Message', body: ruleAction.action } : {}),
                    ...(selectedRuleType === 'disqualify' ? { error: { message: 'Submission filtered' } } : {})
                } as any
            ]
        };

        onSave(rule);
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            header={logicStep === 'select' ? "Add Logic Rule" : "Configure Rule"}
            className="max-w-2xl"
            body={
                <div className="space-y-4">
                    {logicStep === 'select' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 cursor-pointer hover:border-purple-500 border-transparent ring-1 ring-gray-200 hover:ring-purple-500 hover:bg-purple-50/10 dark:hover:bg-purple-900/20 transition-all group" onClick={() => handleSelectRuleType('visibility')}>
                                <div className="flex gap-3 items-start">
                                    <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
                                        <EyeIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">Conditional Visibility</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Show or hide fields based on input.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 cursor-pointer hover:border-blue-500 border-transparent ring-1 ring-gray-200 hover:ring-blue-500 hover:bg-blue-50/10 dark:hover:bg-blue-900/20 transition-all group" onClick={() => handleSelectRuleType('redirect')}>
                                <div className="flex gap-3 items-start">
                                    <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                                        <ArrowRightCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">Page Redirect</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Redirect users after submission.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 cursor-pointer hover:border-green-500 border-transparent ring-1 ring-gray-200 hover:ring-green-500 hover:bg-green-50/10 dark:hover:bg-green-900/20 transition-all group" onClick={() => handleSelectRuleType('message')}>
                                <div className="flex gap-3 items-start">
                                    <div className="h-8 w-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center shrink-0 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                                        <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">Custom Message</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Show a custom success message.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 cursor-pointer hover:border-red-500 border-transparent ring-1 ring-gray-200 hover:ring-red-500 hover:bg-red-50/10 dark:hover:bg-red-900/20 transition-all group" onClick={() => handleSelectRuleType('disqualify')}>
                                <div className="flex gap-3 items-start">
                                    <div className="h-8 w-8 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center shrink-0 group-hover:bg-red-100 dark:group-hover:bg-red-900/50 transition-colors">
                                        <NoSymbolIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">Filter Submission</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Reject submissions based on criteria.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700 space-y-3">
                                <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300 font-medium pb-2 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <span>Execute if</span>
                                        <select
                                            className="text-xs border-none bg-primary/10 dark:bg-primary/30 text-primary dark:text-primary rounded px-2 py-0.5 font-bold uppercase cursor-pointer focus:ring-2 focus:ring-primary"
                                            value={matchType}
                                            onChange={(e) => setMatchType(e.target.value as 'AND' | 'OR')}
                                        >
                                            <option value="AND">ALL</option>
                                            <option value="OR">ANY</option>
                                        </select>
                                        <span>of the following match:</span>
                                    </div>
                                </div>

                                {conditions.map((conditionRow, index) => (
                                    <div key={conditionRow.id} className="relative grid grid-cols-12 gap-2 items-start group">
                                        {/* Connecting Line for multiple items (Visual Enhancement) */}
                                        {index > 0 && (
                                            <div className="absolute -left-3 top-[-14px] w-3 h-[24px] border-l-2 border-b-2 border-gray-200 dark:border-gray-600 rounded-bl-md"></div>
                                        )}

                                        <div className="col-span-4 space-y-1">
                                            {index === 0 && <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Field</label>}
                                            <select
                                                className="w-full text-xs border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary px-2 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                value={conditionRow.field}
                                                onChange={(e) => updateConditionRow(conditionRow.id, { field: e.target.value })}
                                            >
                                                <option value="">Select Field...</option>
                                                {formFields.map(f => (
                                                    <option key={f.id} value={getFieldLabel(f) || f.id}>{getFieldLabel(f)}</option>
                                                ))}
                                                <option value="submit_btn">Submit Button</option>
                                            </select>
                                        </div>
                                        <div className="col-span-3 space-y-1">
                                            {index === 0 && <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Condition</label>}
                                            <select
                                                className="w-full text-xs border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary px-2 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                value={conditionRow.condition}
                                                onChange={(e) => updateConditionRow(conditionRow.id, { condition: e.target.value })}
                                            >
                                                <option value="equals">Equals</option>
                                                <option value="not_equals">Does not equal</option>
                                                <option value="contains">Contains</option>
                                                <option value="is_empty">Is Empty</option>
                                                <option value="is_not_empty">Is Not Empty</option>
                                                {conditionRow.field === 'submit_btn' && <option value="on_submit">On Submit</option>}
                                            </select>
                                        </div>
                                        <div className="col-span-4 space-y-1">
                                            {index === 0 && <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Value</label>}
                                            {!['is_empty', 'is_not_empty', 'on_submit'].includes(conditionRow.condition) ? (
                                                <input
                                                    type="text"
                                                    className="w-full text-xs border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary px-2 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                                    placeholder="Value..."
                                                    value={conditionRow.value}
                                                    onChange={(e) => updateConditionRow(conditionRow.id, { value: e.target.value })}
                                                />
                                            ) : (
                                                <div className="h-[26px] bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"></div>
                                            )}
                                        </div>
                                        <div className={`col-span-1 flex items-center justify-center ${index === 0 ? 'pt-6' : 'pt-1'}`}>
                                            {conditions.length > 1 && (
                                                <button
                                                    onClick={() => removeConditionRow(conditionRow.id)}
                                                    className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded transition-colors"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={addConditionRow}
                                    className="text-xs flex items-center gap-1 text-primary hover:text-primary-dark font-medium mt-2"
                                >
                                    <PlusIcon className="w-3 h-3" /> Add Condition
                                </button>

                            </div>

                            <div className="bg-primary/5 dark:bg-primary/10 p-3 rounded-lg border border-primary/20 dark:border-primary/20 space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                                    <span className="bg-primary/10 dark:bg-primary/30 text-primary dark:text-primary px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">THEN</span>
                                    <span>Perform action:</span>
                                </div>

                                {selectedRuleType === 'visibility' && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Action</label>
                                            <select
                                                className="w-full text-xs border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                value={ruleAction.action}
                                                onChange={(e) => setRuleAction({ ...ruleAction, action: e.target.value })}
                                            >
                                                <option value="">Select Action...</option>
                                                <option value="show">Show Field</option>
                                                <option value="hide">Hide Field</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Target Field</label>
                                            <select
                                                className="w-full text-xs border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                value={ruleAction.targetField}
                                                onChange={(e) => setRuleAction({ ...ruleAction, targetField: e.target.value })}
                                            >
                                                <option value="">Select Field...</option>
                                                {formFields.map(f => (
                                                    <option key={f.id} value={f.id}>{getFieldLabel(f)}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {selectedRuleType === 'redirect' && (
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Redirect URL</label>
                                        <input
                                            type="url"
                                            className="w-full text-xs border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                            placeholder="https://example.com/thank-you"
                                            value={ruleAction.action}
                                            onChange={(e) => setRuleAction({ ...ruleAction, action: e.target.value })}
                                        />
                                    </div>
                                )}

                                {selectedRuleType === 'message' && (
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Message</label>
                                        <textarea
                                            className="w-full text-xs border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                            placeholder="Success message..."
                                            rows={3}
                                            value={ruleAction.action}
                                            onChange={(e) => setRuleAction({ ...ruleAction, action: e.target.value })}
                                        />
                                    </div>
                                )}

                                {selectedRuleType === 'disqualify' && (
                                    <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-100 dark:border-red-900/30 flex items-center gap-2">
                                        <NoSymbolIcon className="w-4 h-4" />
                                        Submission will be rejected as disqualified.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            }
            footer={
                <div className="flex justify-between w-full">
                    {logicStep === 'configure' ? (
                        <Button className="text-xs" variant="transparent" onClick={() => setLogicStep('select')}>
                            <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back
                        </Button>
                    ) : <div></div>}
                    <div className="flex gap-2">
                        <Button className="text-xs" variant="transparent" onClick={onClose}>
                            Cancel
                        </Button>
                        {logicStep === 'configure' && (
                            <Button className="text-xs" variant="primary" onClick={handleSave} disabled={!conditions[0]?.field}>
                                {initialRule ? 'Update Rule' : 'Add Rule'}
                            </Button>
                        )}
                    </div>
                </div>
            }
        />
    );
};
