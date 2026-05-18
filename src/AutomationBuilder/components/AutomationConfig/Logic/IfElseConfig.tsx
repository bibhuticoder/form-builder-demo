import React, { useRef, useState } from "react"
import type { Node } from "reactflow"
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components"
import { PlusIcon, TrashIcon, ArrowsRightLeftIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"

const CONDITION_FIELDS = [
  { id: 'tag', label: 'Contact Tag' },
  { id: 'first_name', label: 'First Name' },
  { id: 'last_name', label: 'Last Name' },
  { id: 'email', label: 'Email Address' },
  { id: 'phone', label: 'Phone Number' },
  { id: 'engagement_score', label: 'Engagement Score' },
  { id: 'email_opened', label: 'Email Opened' },
  { id: 'form_submitted', label: 'Form Submitted' },
];

const OPERATORS = [
  { id: 'contains', label: 'Contains' },
  { id: 'not_contains', label: 'Does not contain' },
  { id: 'equals', label: 'Is exactly' },
  { id: 'not_equals', label: 'Is not' },
  { id: 'is_empty', label: 'Is empty' },
  { id: 'is_not_empty', label: 'Is not empty' },
  { id: 'greater_than', label: 'Greater than' },
  { id: 'less_than', label: 'Less than' },
];

type IfElseCondition = {
  field: string;
  operator: string;
  value?: string;
  logicalOp?: 'and' | 'or';
};

type IfElseBranch = {
  id: string;
  label: string;
  conditions: IfElseCondition[];
  logicalOperator: 'and' | 'or';
};

const DEFAULT_CONDITION: IfElseCondition = { field: 'tag', operator: 'contains', value: '', logicalOp: 'and' };

const createBranchId = () => `branch-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

const normalizeBranch = (
  branch: Partial<IfElseBranch>,
  idx: number,
  fallbackBase: string,
  legacyIfLabel?: string,
): IfElseBranch => {
  const rawConditions = Array.isArray(branch.conditions) && branch.conditions.length > 0
    ? branch.conditions
    : [{ ...DEFAULT_CONDITION }];

  const conditions = rawConditions.map((condition) => ({
    field: condition.field ?? DEFAULT_CONDITION.field,
    operator: condition.operator ?? DEFAULT_CONDITION.operator,
    value: condition.value ?? DEFAULT_CONDITION.value,
    logicalOp: condition.logicalOp ?? branch.logicalOperator ?? 'and',
  }));

  const joinerOps = conditions.slice(0, -1)
    .map((condition) => condition.logicalOp)
    .filter(Boolean) as Array<'and' | 'or'>;

  const derivedLogicalOperator = joinerOps.length > 0 && new Set(joinerOps).size === 1
    ? joinerOps[0]
    : branch.logicalOperator || 'and';

  const defaultLabel = `Branch ${idx + 1}`;
  const legacyLabel = idx === 0 ? (legacyIfLabel || 'If') : `Else If ${idx}`;
  const label = !branch.label || branch.label === legacyLabel ? defaultLabel : branch.label;

  return {
    id: branch.id || `${fallbackBase}-${idx}`,
    label,
    logicalOperator: derivedLogicalOperator,
    conditions,
  };
};

const buildSubtitle = (branches: IfElseBranch[]) => {
  if (branches.length === 0) return 'Define execution paths';
  const totalConditions = branches.reduce((sum, branch) => sum + branch.conditions.length, 0);
  const first = branches[0]?.conditions?.[0];
  if (branches.length === 1 && totalConditions === 1 && first) {
    const fieldLabel = CONDITION_FIELDS.find(f => f.id === first.field)?.label || first.field;
    const operatorLabel = OPERATORS.find(o => o.id === first.operator)?.label || String(first.operator).replace('_', ' ');
    return `Branch 1: ${fieldLabel} ${operatorLabel}`;
  }
  return `${branches.length} Branch${branches.length > 1 ? 'es' : ''}`;
};

export const IfElseConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void, edges: any[], node: Node }) => {
  const legacyBranchIdRef = useRef<string>(createBranchId());
  const fallbackBase = legacyBranchIdRef.current;
  const [collapsedBranches, setCollapsedBranches] = useState<Record<string, boolean>>({});

  const rawBranches = Array.isArray(data.branches) && data.branches.length > 0
    ? data.branches
    : [
      {
        id: data.branchId || fallbackBase,
        label: data.trueLabel || 'Branch 1',
        logicalOperator: data.logicalOperator || 'and',
        conditions: Array.isArray(data.conditions) && data.conditions.length > 0
          ? data.conditions
          : [{ ...DEFAULT_CONDITION }],
      },
    ];

  const branches: IfElseBranch[] = rawBranches.map((branch: Partial<IfElseBranch>, idx: number) =>
    normalizeBranch(branch, idx, fallbackBase, data.trueLabel),
  );

  const elseLabel = data.elseLabel || data.falseLabel || 'Fallback path';

  const updateBranches = (nextBranches: IfElseBranch[], nextElseLabel = elseLabel) => {
    const normalized = nextBranches.map((branch, idx) => normalizeBranch(branch, idx, fallbackBase, data.trueLabel));
    const subtitle = buildSubtitle(normalized);
    const legacyConditions = normalized[0]?.conditions || [];
    const legacyOperator = normalized[0]?.conditions?.[0]?.logicalOp || normalized[0]?.logicalOperator || 'and';
    const legacyTrueLabel = normalized[0]?.label || data.trueLabel;
    const legacyFalseLabel = nextElseLabel;

    onChange({
      ...data,
      branches: normalized,
      elseLabel: nextElseLabel,
      conditions: legacyConditions,
      logicalOperator: legacyOperator,
      trueLabel: legacyTrueLabel,
      falseLabel: legacyFalseLabel,
      subtitle,
    });
  };

  const updateBranch = (branchIndex: number, patch: Partial<IfElseBranch>) => {
    const next = branches.map((branch, idx) => idx === branchIndex ? { ...branch, ...patch } : branch);
    updateBranches(next);
  };

  const addBranch = () => {
    const nextIndex = branches.length;
    const next = [
      ...branches,
      {
        id: createBranchId(),
        label: `Branch ${nextIndex + 1}`,
        logicalOperator: 'and',
        conditions: [{ ...DEFAULT_CONDITION }],
      },
    ];
    updateBranches(next);
  };

  const removeBranch = (branchIndex: number) => {
    if (branches.length <= 1) return;
    const next = branches.filter((_, idx) => idx !== branchIndex);
    updateBranches(next);
  };

  const addCondition = (branchIndex: number, joiner: 'and' | 'or' = 'and') => {
    const next = branches.map((branch, idx) => {
      if (idx !== branchIndex) return branch;
      const conditions = [...branch.conditions];
      if (conditions.length > 0) {
        const lastIndex = conditions.length - 1;
        conditions[lastIndex] = { ...conditions[lastIndex], logicalOp: joiner };
      }
      return { ...branch, conditions: [...conditions, { ...DEFAULT_CONDITION }] };
    });
    updateBranches(next);
  };

  const removeCondition = (branchIndex: number, conditionIndex: number) => {
    const target = branches[branchIndex];
    if (!target || target.conditions.length <= 1) return;
    const next = branches.map((branch, idx) => {
      if (idx !== branchIndex) return branch;
      return { ...branch, conditions: branch.conditions.filter((_, cIdx) => cIdx !== conditionIndex) };
    });
    updateBranches(next);
  };

  const setConditionJoiner = (branchIndex: number, conditionIndex: number, logicalOp: 'and' | 'or') => {
    const next = branches.map((branch, idx) => {
      if (idx !== branchIndex) return branch;
      const conditions = [...branch.conditions];
      conditions[conditionIndex] = { ...conditions[conditionIndex], logicalOp };
      return { ...branch, conditions };
    });
    updateBranches(next);
  };

  const setField = (branchIndex: number, conditionIndex: number, val: string) => {
    const next = branches.map((branch, idx) => {
      if (idx !== branchIndex) return branch;
      const conditions = [...branch.conditions];
      conditions[conditionIndex] = { ...conditions[conditionIndex], field: val };
      return { ...branch, conditions };
    });
    updateBranches(next);
  };

  const setOperator = (branchIndex: number, conditionIndex: number, val: string) => {
    const next = branches.map((branch, idx) => {
      if (idx !== branchIndex) return branch;
      const conditions = [...branch.conditions];
      conditions[conditionIndex] = { ...conditions[conditionIndex], operator: val };
      return { ...branch, conditions };
    });
    updateBranches(next);
  };

  const setValue = (branchIndex: number, conditionIndex: number, val: string) => {
    const next = branches.map((branch, idx) => {
      if (idx !== branchIndex) return branch;
      const conditions = [...branch.conditions];
      conditions[conditionIndex] = { ...conditions[conditionIndex], value: val };
      return { ...branch, conditions };
    });
    updateBranches(next);
  };

  const toggleBranch = (branchId: string) => {
    setCollapsedBranches(prev => ({ ...prev, [branchId]: !prev[branchId] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-0.5">
        <div>
          <Label className="text-[12px] font-bold text-slate-700 dark:text-slate-200 leading-none">Branches ({branches.length})</Label>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">Evaluate in order, fallback if none match</p>
        </div>
        <Button variant="ghost" size="sm" onClick={addBranch} className="h-7 text-xs font-bold text-primary hover:text-primary hover:bg-primary/5 rounded-lg border border-primary/20">
          <PlusIcon className="w-3 h-3 mr-1" /> Add Branch
        </Button>
      </div>

      <div className="space-y-4">
        {branches.map((branch, branchIndex) => {
          const isCollapsed = !!collapsedBranches[branch.id];
          const branchTitle = branch.label || `Branch ${branchIndex + 1}`;
          return (
            <div key={branch.id} className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleBranch(branch.id)}
                  className="h-7 w-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 rounded-lg flex items-center justify-center transition-all"
                  aria-label={isCollapsed ? "Expand branch" : "Collapse branch"}
                >
                  {isCollapsed ? <ChevronDownIcon className="w-3 h-3" /> : <ChevronUpIcon className="w-3 h-3" />}
                </button>
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                  {branchTitle}
                </div>
              </div>
              {!isCollapsed && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addCondition(branchIndex, 'and')}
                    className="h-7 text-[10px] font-bold text-primary hover:text-primary hover:bg-primary/5 rounded-lg border border-primary/20"
                  >
                    <PlusIcon className="w-3 h-3 mr-1" /> AND
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addCondition(branchIndex, 'or')}
                    className="h-7 text-[10px] font-bold text-primary hover:text-primary hover:bg-primary/5 rounded-lg border border-primary/20"
                  >
                    <PlusIcon className="w-3 h-3 mr-1" /> OR
                  </Button>
                  {branches.length > 1 && branchIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => removeBranch(branchIndex)}
                      className="h-7 w-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 rounded-lg flex items-center justify-center transition-all"
                      aria-label="Remove branch"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {!isCollapsed && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Path Label</Label>
                  <Input
                    className="h-8 text-xs dark:bg-slate-900/50"
                    value={branch.label}
                    onChange={e => updateBranch(branchIndex, { label: e.target.value })}
                    placeholder={`Branch ${branchIndex + 1}`}
                  />
                </div>

                <div className="space-y-3">
                  {branch.conditions.map((c, i) => {
                    const joinerOp = branch.conditions[i - 1]?.logicalOp || 'and';
                    return (
                      <React.Fragment key={`${branch.id}-${i}`}>
                        {i > 0 && (
                          <div className="flex items-center gap-2 px-1">
                            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-lg w-fit border border-slate-200 dark:border-slate-800">
                              <button
                                type="button"
                                onClick={() => setConditionJoiner(branchIndex, i - 1, 'and')}
                                className={cn(
                                  "px-3 py-1 rounded-md text-[10px] font-bold transition-all",
                                  joinerOp === 'and' ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                                )}
                              >
                                AND
                              </button>
                              <button
                                type="button"
                                onClick={() => setConditionJoiner(branchIndex, i - 1, 'or')}
                                className={cn(
                                  "px-3 py-1 rounded-md text-[10px] font-bold transition-all",
                                  joinerOp === 'or' ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                                )}
                              >
                                OR
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="p-4 bg-white/80 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 rounded-xl space-y-4 relative">
                          {branch.conditions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCondition(branchIndex, i)}
                              className="absolute -top-2 -right-2 h-6 w-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center transition-all shadow-sm z-10"
                            >
                              <TrashIcon className="w-3 h-3" />
                            </button>
                          )}

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5 w-full">
                              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Field</Label>
                              <Select value={c.field} onValueChange={v => setField(branchIndex, i, v)}>
                                <SelectTrigger className="h-8 text-xs dark:bg-slate-900/50 w-full">
                                  <SelectValue placeholder="Select field">
                                    {CONDITION_FIELDS.find(f => f.id === c.field)?.label}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="text-xs">
                                  {CONDITION_FIELDS.map(f => <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1.5 w-full">
                              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Operator</Label>
                              <Select value={c.operator} onValueChange={v => setOperator(branchIndex, i, v)}>
                                <SelectTrigger className="h-8 text-xs dark:bg-slate-900/50 w-full">
                                  <SelectValue placeholder="Select operator">
                                    {OPERATORS.find(o => o.id === c.operator)?.label}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent className="text-xs">
                                  {OPERATORS.map(o => <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {c.operator !== 'is_empty' && c.operator !== 'is_not_empty' && (
                            <div className="space-y-1.5 w-full">
                              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Value</Label>
                              <Input
                                className="h-8 text-xs dark:bg-slate-900/50 w-full"
                                value={c.value || ''}
                                onChange={e => setValue(branchIndex, i, e.target.value)}
                                placeholder="Value to compare..."
                              />
                            </div>
                          )}
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          );
        })}
      </div>

      <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10 space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-bold text-primary">
          <ArrowsRightLeftIcon className="w-4 h-4" />
          Fallback path
        </div>
        <div className="space-y-1">
          <span className="text-[9px] uppercase font-bold text-slate-400 pl-1">Fallback Label</span>
          <Input
            className="h-8 text-xs bg-white dark:bg-slate-900"
            value={elseLabel}
            onChange={e => updateBranches(branches, e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
