import React, { useState } from "react";
import { Field, LogicRule, LogicEvent, LogicOperation, LogicComparison, LogicEffect } from "../../../types";
import { useFormBuilder } from "../../../context";
import { Dialog } from "../../../../../components/Dialog";
import { Button } from "../../../../../components/Button";
import {
  ArrowRightCircleIcon,
  ChatBubbleBottomCenterTextIcon,
  NoSymbolIcon,
  EyeIcon,
  ChevronLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  BoltIcon
} from "@heroicons/react/24/outline";

interface LogicTabProps {
  field: Field;
}

interface ConditionRow {
  id: string;
  field: string;
  condition: string;
  value: string;
}

export const LogicTab: React.FC<LogicTabProps> = () => {
  const { jsonContent, addLogicRule, deleteLogicRule, updateLogicRule } = useFormBuilder();
  const rules = jsonContent.logic?.rules || [];
  const formFields = jsonContent.fields || [];

  const [showLogicDialog, setShowLogicDialog] = useState(false);
  const [logicStep, setLogicStep] = useState<'select' | 'configure'>('select');
  const [selectedRuleType, setSelectedRuleType] = useState<'redirect' | 'message' | 'disqualify' | 'visibility' | null>(null);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  // Nested Logic State
  const [matchType, setMatchType] = useState<'AND' | 'OR'>('AND');
  const [conditions, setConditions] = useState<ConditionRow[]>([]);

  // Action State (remains similar, but flexible based on type)
  const [ruleAction, setRuleAction] = useState({
    action: '', // visibility: show/hide, redirect: url, message: text
    targetField: '' // for visibility
  });

  const resetLogicDialog = () => {
    setLogicStep('select');
    setSelectedRuleType(null);
    setConditions([{ id: 'c_1', field: '', condition: 'equals', value: '' }]);
    setMatchType('AND');
    setRuleAction({ action: '', targetField: '' });
    setEditingRuleId(null);
  };

  const handleSelectRuleType = (type: 'redirect' | 'message' | 'disqualify' | 'visibility') => {
    setSelectedRuleType(type);
    setLogicStep('configure');
    // Initialize with one empty condition
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

  const generateLogicId = () => {
    let count = rules.length + 1;
    let newId = `logic_${count.toString().padStart(2, '0')}`;
    while (rules.some(r => r.id === newId)) {
      count++;
      newId = `logic_${count.toString().padStart(2, '0')}`;
    }
    return newId;
  };

  const handleAddRule = () => {
    // Validate: All conditions must have a field. 
    // If condition is not empty/not empty/valid, it usually needs a value (except is_empty etc)
    const isValid = conditions.every(c => {
      const noValue = ['is_empty', 'is_not_empty', 'on_submit'].includes(c.condition);
      return c.field && (noValue || c.value);
    });

    if (!selectedRuleType || !isValid) return;

    const ruleId = editingRuleId || generateLogicId();

    // Logic for TRIGGER: 
    // If any condition is "on_submit", trigger is SUBMISSION_ATTEMPT.
    // Otherwise FIELD_CHANGE. 
    // Note: Mixing on_submit with others is weird. Usually on_submit is a single trigger.
    // For simplicity, if ANY condition is on_submit, we treat whole rule as submission trigger?
    // Actually, "On Submit" is usually not a condition but a trigger.
    // Current simplified builder treated it as a condition. 
    // Let's assume if the first condition is On Submit, it's a submit rule.

    let triggerEvent = LogicEvent.FIELD_CHANGE;
    const hasSubmit = conditions.some(c => c.condition === 'on_submit');
    if (hasSubmit) {
      triggerEvent = LogicEvent.SUBMISSION_ATTEMPT;
    } else {
      // Trigger on change of ANY field involved in conditions?
      // LogicRule.trigger.fieldId is singular. 
      // If we have multiple fields, we might need a generic trigger or the first field.
      // Spec says: "trigger: { event, fieldId }". 
      // If undefined fieldId, maybe it triggers on any field? 
      // Let's set fieldId to the first condition's field for now, or undefined if generic.
      triggerEvent = LogicEvent.FIELD_CHANGE;
    }

    // Build Arguments
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
        fieldId: conditions[0].field // Primary trigger
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

    if (editingRuleId) {
      updateLogicRule(editingRuleId, rule);
    } else {
      addLogicRule(rule);
    }

    setShowLogicDialog(false);
    resetLogicDialog();
  };

  const handleEditRule = (rule: LogicRule) => {
    const primaryEffect = rule.then[0] as any;

    // Determine Type
    let type: any = 'visibility';
    if (primaryEffect.effect === LogicEffect.NAV_REDIRECT) type = 'redirect';
    if (primaryEffect.effect === LogicEffect.UI_TOAST) type = 'message';
    if (primaryEffect.effect === LogicEffect.SUBMISSION_REJECT) type = 'disqualify';

    // Parse Conditions
    const loadedConditions: ConditionRow[] = rule.if.args.map((arg: any, index: number) => {
      let condition = 'equals';
      if (arg.comparison === LogicComparison.EQ) condition = 'equals';
      if (arg.comparison === LogicComparison.NEQ) condition = 'not_equals';
      if (arg.comparison === LogicComparison.CONTAINS) condition = 'contains';
      if (arg.comparison === LogicComparison.IS_EMPTY) condition = 'is_empty';
      if (arg.comparison === LogicComparison.EXISTS) condition = 'is_not_empty';
      if (rule.trigger.event === LogicEvent.SUBMISSION_ATTEMPT && index === 0) condition = 'on_submit'; // Simplify if needed

      return {
        id: `c_${Date.now()}_${index}`,
        field: arg.left?.var || '',
        condition: condition,
        value: arg.right?.str || ''
      };
    });

    setConditions(loadedConditions.length > 0 ? loadedConditions : [{ id: 'c_1', field: '', condition: 'equals', value: '' }]);
    setMatchType(rule.if.operation === LogicOperation.OR ? 'OR' : 'AND');

    // Parse Actions
    setRuleAction({
      action: type === 'visibility' ? (primaryEffect.value ? 'show' : 'hide') :
        type === 'redirect' ? primaryEffect.url :
          type === 'message' ? primaryEffect.body : '',
      targetField: primaryEffect.targets?.[0] || ''
    });

    setSelectedRuleType(type);
    setLogicStep('configure');
    setEditingRuleId(rule.id);
    setShowLogicDialog(true);
  };

  const getFieldLabel = (f: Field) => {
    return (f as any).label || f.type;
  };

  const getLogicTypeInfo = (type: string) => {
    switch (type) {
      case 'redirect': return { label: 'Redirect', className: 'bg-blue-100 text-blue-700', icon: ArrowRightCircleIcon };
      case 'message': return { label: 'Message', className: 'bg-green-100 text-green-700', icon: ChatBubbleBottomCenterTextIcon };
      case 'disqualify': return { label: 'Filter', className: 'bg-red-100 text-red-700', icon: NoSymbolIcon };
      case 'visibility': return { label: 'Visibility', className: 'bg-purple-100 text-purple-700', icon: EyeIcon };
      default: return { label: 'Logic', className: 'bg-gray-100 text-gray-700', icon: BoltIcon };
    }
  };

  const getLogicTypeFromRule = (rule: LogicRule) => {
    const effect = rule.then[0]?.effect;
    if (effect === LogicEffect.NAV_REDIRECT) return 'redirect';
    if (effect === LogicEffect.UI_TOAST) return 'message';
    if (effect === LogicEffect.SUBMISSION_REJECT) return 'disqualify';
    if (effect === LogicEffect.FIELD_VISIBILITY_SET) return 'visibility';
    return 'unknown';
  };

  const formatCondition = (rule: LogicRule) => {
    // This needs to handle multiple conditions now
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
    <div className="space-y-4">
      {/* Header Card */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col gap-2">

        <div className="flex items-center gap-2">
          <div className="p-1 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center shrink-0 shadow-sm">
            <BoltIcon className="w-4 h-4 text-orange-500" />
          </div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Conditional Logic</h3>

        </div>

        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
          Add rules to show/hide fields, disqualify leads, or redirect users based on their inputs.
        </p>
        <Button
          className="w-full justify-center text-xs"
          variant="primary"
          onClick={() => setShowLogicDialog(true)}
        >
          Add New Condition
        </Button>
      </div>

      {/* Rules List */}
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
                    <button onClick={() => handleEditRule(rule)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <PencilIcon className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteLogicRule(rule.id)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
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

      {/* Logic Dialog */}
      <Dialog
        isOpen={showLogicDialog}
        onClose={() => { setShowLogicDialog(false); resetLogicDialog(); }}
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
                        className="text-xs border-none bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded px-2 py-0.5 font-bold uppercase cursor-pointer focus:ring-2 focus:ring-blue-500"
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
                          className="w-full text-xs border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                          className="w-full text-xs border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
                            className="w-full text-xs border-gray-300 dark:border-gray-600 rounded focus:border-primary focus:ring-primary py-1.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
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

                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/20 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 font-medium">
                    <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">THEN</span>
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
              <Button variant="transparent" onClick={() => setLogicStep('select')}>
                <ChevronLeftIcon className="w-4 h-4 mr-1" /> Back
              </Button>
            ) : <div></div>}
            <div className="flex gap-2">
              <Button variant="transparent" onClick={() => { setShowLogicDialog(false); resetLogicDialog(); }}>
                Cancel
              </Button>
              {logicStep === 'configure' && (
                <Button variant="primary" onClick={handleAddRule} disabled={!conditions[0]?.field}>
                  {editingRuleId ? 'Update Rule' : 'Add Rule'}
                </Button>
              )}
            </div>
          </div>
        }
      />
    </div>
  );
};
