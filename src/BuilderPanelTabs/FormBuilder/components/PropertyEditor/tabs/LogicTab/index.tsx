import React, { useState } from "react";
import { Field, LogicRule } from "../../../../types";
import { useFormBuilder } from "../../../../context";
import { LogicHeader } from "./components/LogicHeader";
import { LogicList } from "./components/LogicList";
import { LogicDialog } from "./components/LogicDialog";

interface LogicTabProps {
    field?: Field;
}

export const LogicTab: React.FC<LogicTabProps> = () => {
    const { jsonContent, addLogicRule, deleteLogicRule, updateLogicRule } = useFormBuilder();
    const rules = jsonContent.logic?.rules || [];
    const formFields = jsonContent.fields || [];

    const [showLogicDialog, setShowLogicDialog] = useState(false);
    const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

    const handleAddRuleOpen = () => {
        setEditingRuleId(null);
        setShowLogicDialog(true);
    };

    const handleEditRule = (rule: LogicRule) => {
        setEditingRuleId(rule.id);
        setShowLogicDialog(true);
    };

    const handleSaveRule = (rule: LogicRule) => {
        if (editingRuleId) {
            updateLogicRule(editingRuleId, rule);
        } else {
            addLogicRule(rule);
        }
        setShowLogicDialog(false);
    };

    const handleDeleteRule = (id: string) => {
        deleteLogicRule(id);
    };

    // Find the rule being edited to pass as initial state
    const editingRule = editingRuleId ? rules.find(r => r.id === editingRuleId) : null;

    return (
        <div className="space-y-4">
            <LogicHeader onAdd={handleAddRuleOpen} />

            <LogicList
                rules={rules}
                onEdit={handleEditRule}
                onDelete={handleDeleteRule}
            />

            <LogicDialog
                isOpen={showLogicDialog}
                onClose={() => setShowLogicDialog(false)}
                onSave={handleSaveRule}
                initialRule={editingRule}
                existingRules={rules}
                formFields={formFields}
            />
        </div>
    );
};
