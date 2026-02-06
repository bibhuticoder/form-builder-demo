import React, { useState, useEffect } from "react";
import { Dialog } from "../../../../../../../components/Dialog";
import { Button } from "../../../../../../../components/Button";
import { Field, LogicRule, LogicEvent, LogicOperation, LogicComparison, LogicEffect, LogicExpression } from "../../../../../types";
// import { ConditionRow } from "../utils";
// import { ConditionRow } from "../utils";
import {
    ChevronLeftIcon
} from "@heroicons/react/24/outline";
import { LogicTypeSelection } from "./LogicTypeSelection";
import { LogicRuleEditor } from "./LogicRuleEditor";

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
                        <LogicTypeSelection onSelect={handleSelectRuleType} />
                    ) : (
                        <LogicRuleEditor
                            expression={rootExpression}
                            onExpressionChange={setRootExpression}
                            action={ruleAction}
                            onActionChange={setRuleAction}
                            type={selectedRuleType!}
                            fields={formFields}
                        />
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
