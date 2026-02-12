import React, { useState, useEffect } from "react";
import { Dialog } from "../../../../../../../components/Dialog";
import { Button } from "../../../../../../../components/Button";
import { Field, LogicRule, LogicEvent, LogicOperation, LogicComparison, LogicEffect, LogicExpression, LogicActionType, ON_SUBMIT_LOGIC_TYPES } from "../../../../../types";
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
    const [selectedRuleType, setSelectedRuleType] = useState<LogicActionType | null>(null);

    // Nested Logic State
    const [rootExpression, setRootExpression] = useState<LogicExpression | undefined>({
        conditions: [{
            id: crypto.randomUUID(),
            comparison: LogicComparison.EQ,
            left: { var: '' },
            right: { str: '' }
        }]
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

                let type: LogicActionType = LogicActionType.VISIBILITY;
                if (primaryEffect.effect === LogicEffect.NAV_REDIRECT) type = LogicActionType.REDIRECT;
                if (primaryEffect.effect === LogicEffect.UI_TOAST) type = LogicActionType.MESSAGE;
                if (primaryEffect.effect === LogicEffect.SUBMISSION_REJECT) type = LogicActionType.DISQUALIFY;

                // Load expression directly
                setRootExpression(initialRule.if);

                setRuleAction({
                    action: type === LogicActionType.VISIBILITY ? (primaryEffect.value ? 'show' : 'hide') :
                        type === LogicActionType.REDIRECT ? primaryEffect.url :
                            type === LogicActionType.MESSAGE ? primaryEffect.body : '',
                    targetField: primaryEffect.targets?.[0] || ''
                });
                setSelectedRuleType(type);
                setLogicStep('configure');
            } else {
                // Add Mode: Reset
                setLogicStep('select');
                setSelectedRuleType(null);
                setRootExpression({
                    conditions: [{
                        id: crypto.randomUUID(),
                        comparison: LogicComparison.EQ,
                        left: { var: '' },
                        right: { str: '' }
                    }]
                });
                setRuleAction({ action: '', targetField: '' });
            }
        }
    }, [isOpen, initialRule]);

    const handleSelectRuleType = (typeVal: string) => {
        // Map string to LogicActionType (LogicTypeSelection passes string)
        // Assuming LogicTypeSelection returns valid LogicActionType strings or we cast
        const type = typeVal as LogicActionType;
        setSelectedRuleType(type);
        setLogicStep('configure');
        // Reset expression for new rule
        setRootExpression({
            conditions: [{
                id: crypto.randomUUID(),
                comparison: LogicComparison.EQ,
                left: { var: '' },
                right: { str: '' }
            }]
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

    const validateExpression = (expr: LogicExpression | undefined): boolean => {
        if (!expr) return true; // Valid if undefined (e.g. for onSubmit actions)
        return expr.conditions.every(cond => {
            // Helper to map comparison to validation logic if needed, 
            // but checking `left.var` existence is primary check for now.
            const noValue = [LogicComparison.IS_EMPTY, LogicComparison.EXISTS, LogicComparison.ON_SUBMIT].includes(cond.comparison);
            // Also check on_submit case if it existed (removed in simplified view but kept in logic)
            return cond.left?.var && (noValue || cond.right?.str !== undefined);
        });
    };

    const getFirstFieldId = (expr: LogicExpression | undefined): string | undefined => {
        if (!expr || expr.conditions.length === 0) return undefined;
        // Just return the first condition's field
        return expr.conditions[0].left.var;
    };

    const handleSave = () => {
        // Validation changes based on type
        const isSubmitLogic = selectedRuleType && ON_SUBMIT_LOGIC_TYPES.includes(selectedRuleType);

        let isValid = true;

        if (!isSubmitLogic) {
            isValid = validateExpression(rootExpression);
        }

        if (!selectedRuleType || !isValid) return;

        const ruleId = initialRule?.id || generateLogicId();

        let triggerEvent = LogicEvent.FIELD_CHANGE;
        let firstField: string | undefined;

        if (isSubmitLogic) {
            triggerEvent = LogicEvent.SUBMISSION_SUCCESS;
        } else {
            firstField = getFirstFieldId(rootExpression);
            if (!firstField) return; // Valid field required for field change rules
        }

        let effectType = LogicEffect.FIELD_VISIBILITY_SET;
        switch (selectedRuleType) {
            case LogicActionType.VISIBILITY: effectType = LogicEffect.FIELD_VISIBILITY_SET; break;
            case LogicActionType.REDIRECT: effectType = LogicEffect.NAV_REDIRECT; break;
            case LogicActionType.MESSAGE: effectType = LogicEffect.UI_TOAST; break;
            case LogicActionType.DISQUALIFY: effectType = LogicEffect.SUBMISSION_REJECT; break;
        }

        const rule: LogicRule = {
            id: ruleId,
            enabled: true,
            trigger: {
                event: triggerEvent,
                fieldId: firstField
            },
            if: isSubmitLogic ? undefined : rootExpression,
            then: [
                {
                    effect: effectType,
                    ...(selectedRuleType === LogicActionType.VISIBILITY ? { targets: [ruleAction.targetField], value: ruleAction.action === 'show' } : {}),
                    ...(selectedRuleType === LogicActionType.REDIRECT ? { url: ruleAction.action } : {}),
                    ...(selectedRuleType === LogicActionType.MESSAGE ? { variant: 'success', title: 'Message', body: ruleAction.action } : {}),
                    ...(selectedRuleType === LogicActionType.DISQUALIFY ? { error: { message: 'Submission filtered' } } : {})
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
