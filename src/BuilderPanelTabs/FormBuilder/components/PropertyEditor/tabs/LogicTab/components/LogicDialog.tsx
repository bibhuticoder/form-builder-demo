import React, { useState, useEffect } from "react";
import { Dialog } from "../../../../../../../components/Dialog";
import { Button } from "../../../../../../../components/Button";
import { Field, LogicRule, LogicEvent, LogicOperation, LogicComparison, LogicEffect, LogicExpression } from "../../../../../types";
// import { ConditionRow } from "../utils";
import { LogicBuilder } from "./LogicBuilder";
import {
    ArrowRightCircleIcon,
    ChatBubbleBottomCenterTextIcon,
    NoSymbolIcon,
    EyeIcon,
    ChevronLeftIcon
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
    const [rootExpression, setRootExpression] = useState<LogicExpression>({
        operation: LogicOperation.AND,
        args: [{ comparison: LogicComparison.EQ, left: { var: '' }, right: { str: '' } }]
    });

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

                // Load expression directly
                setRootExpression(initialRule.if);

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
                setRootExpression({
                    operation: LogicOperation.AND,
                    args: [{ comparison: LogicComparison.EQ, left: { var: '' }, right: { str: '' } }]
                });
                setRuleAction({ action: '', targetField: '' });
            }
        }
    }, [isOpen, initialRule]);

    const handleSelectRuleType = (type: 'redirect' | 'message' | 'disqualify' | 'visibility') => {
        setSelectedRuleType(type);
        setLogicStep('configure');
        // Reset expression for new rule
        setRootExpression({
            operation: LogicOperation.AND,
            args: [{ comparison: LogicComparison.EQ, left: { var: '' }, right: { str: '' } }]
        });
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

    const validateExpression = (expr: LogicExpression): boolean => {
        return expr.args.every(arg => {
            if ((arg as LogicExpression).operation) {
                return validateExpression(arg as LogicExpression);
            } else {
                const cond = arg as any; // Cast for easier access
                // Helper to map comparison to validation logic if needed, 
                // but checking `left.var` existence is primary check for now.
                const noValue = [LogicComparison.IS_EMPTY, LogicComparison.EXISTS, LogicComparison.ON_SUBMIT].includes(cond.comparison);
                // Also check on_submit case if it existed (removed in simplified view but kept in logic)
                return cond.left?.var && (noValue || cond.right?.str !== undefined);
            }
        });
    };

    const getFirstFieldId = (expr: LogicExpression): string | undefined => {
        for (const arg of expr.args) {
            if ((arg as LogicExpression).operation) {
                const found = getFirstFieldId(arg as LogicExpression);
                if (found) return found;
            } else {
                const cond = arg as any;
                if (cond.left?.var) return cond.left.var;
            }
        }
        return undefined;
    };

    const handleSave = () => {
        const isValid = validateExpression(rootExpression);

        if (!selectedRuleType || !isValid) return;

        // Find first field to set as trigger
        const firstField = getFirstFieldId(rootExpression);
        if (!firstField) return;

        const ruleId = initialRule?.id || generateLogicId();

        let triggerEvent = LogicEvent.FIELD_CHANGE;
        // Check if any condition is ON_SUBMIT
        const hasSubmitCondition = (expr: LogicExpression): boolean => {
            return expr.args.some(arg => {
                if ((arg as LogicExpression).operation) return hasSubmitCondition(arg as LogicExpression);
                return (arg as any).comparison === LogicComparison.ON_SUBMIT;
            });
        };

        if (hasSubmitCondition(rootExpression)) {
            triggerEvent = LogicEvent.SUBMISSION_ATTEMPT;
        }

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
                fieldId: firstField
            },
            if: rootExpression,
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

        setLogicStep("select")
        onSave(rule);
        onClose();
    };

    const handleClose = () => {
        setLogicStep("select")
        onClose();
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            header={logicStep === 'select' ? "Add Logic Rule" : "Configure Rule"}
            className="max-w-3xl"
            body={
                <div className="space-y-4">
                    {logicStep === 'select' ? (
                        <div className="grid grid-cols-2 gap-3">

                            {/* Custom Message */}
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

                            {/* Page Redirect */}
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

                            {/* Conditional visibility */}
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

                            {/* Filter Submission */}
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
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700 min-h-[150px] overflow-x-auto">
                                <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Logic Conditions</h5>
                                <LogicBuilder
                                    expression={rootExpression}
                                    onChange={setRootExpression}
                                    fields={formFields}
                                />
                            </div>

                            <div className="bg-primary/5 dark:bg-primary/10 p-3 rounded-lg border border-primary/20 dark:border-primary/20 space-y-3 overflow-auto">
                                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                                    <span className="bg-primary/10 dark:bg-primary/30 text-primary dark:text-primary px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">THEN</span>
                                    <span>Perform action:</span>
                                </div>

                                {selectedRuleType === 'visibility' && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Action</label>
                                            <select
                                                className="shadow w-full text-xs border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary focus:outline-none py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                                                className="shadow w-full text-xs border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary focus:outline-none py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                                            className="shadow w-full text-xs border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary focus:outline-none focus:ring-1 px-2 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
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
                                            className="shadow w-full text-xs border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary focus:outline-none focus:ring-1 px-2 py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
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
                        <Button className="text-xs" variant="transparent" onClick={handleClose}>
                            Cancel
                        </Button>
                        {logicStep === 'configure' && (
                            <Button className="text-xs" variant="primary" onClick={handleSave} disabled={!validateExpression(rootExpression)}>
                                {initialRule ? 'Update Rule' : 'Add Rule'}
                            </Button>
                        )}
                    </div>
                </div>
            }
        />
    );
};
