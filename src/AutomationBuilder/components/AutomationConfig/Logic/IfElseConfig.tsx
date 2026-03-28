import { useState } from "react"
import type { Node } from "reactflow"
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components"
import { PlusIcon, TrashIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/outline"
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

export const IfElseConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void, edges: any[], node: Node }) => {
  const [conditions, setConditions] = useState<any[]>(data.conditions || [{ field: 'tag', operator: 'contains', value: '' }]);
  const [logicalOperator, setLogicalOperator] = useState<'and' | 'or'>(data.logicalOperator || 'and');

  const updateConditions = (next: any[], nextOp = logicalOperator) => {
    setConditions(next);
    setLogicalOperator(nextOp);
    
    // Generate a good subtitle
    let subtitle = 'Define execution paths';
    if (next.length > 0) {
      const first = next[0];
      const fieldLabel = CONDITION_FIELDS.find(f => f.id === first.field)?.label || first.field;
      if (next.length === 1) {
        subtitle = `If ${fieldLabel} ${first.operator.replace('_', ' ')}`;
      } else {
        subtitle = `${next.length} Conditions (${nextOp.toUpperCase()})`;
      }
    }

    onChange({ 
      ...data, 
      conditions: next, 
      logicalOperator: nextOp,
      subtitle 
    });
  };

  const addCondition = () => updateConditions([...conditions, { field: 'tag', operator: 'contains', value: '' }]);
  const removeCondition = (idx: number) => updateConditions(conditions.filter((_, i) => i !== idx));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-0.5">
        <div>
          <Label className="text-[12px] font-bold text-slate-700 dark:text-slate-200 leading-none">Logical Rules</Label>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">Segment flow based on data</p>
        </div>
        <Button variant="ghost" size="sm" onClick={addCondition} className="h-7 text-xs font-bold text-primary hover:text-primary hover:bg-primary/5 rounded-lg border border-primary/20">
          <PlusIcon className="w-3 h-3 mr-1" /> Add Rule
        </Button>
      </div>

      {conditions.length > 1 && (
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-lg w-fit border border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => updateConditions(conditions, 'and')}
            className={cn(
              "px-3 py-1 rounded-md text-[10px] font-bold transition-all",
              logicalOperator === 'and' ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            AND
          </button>
          <button 
            onClick={() => updateConditions(conditions, 'or')}
            className={cn(
              "px-3 py-1 rounded-md text-[10px] font-bold transition-all",
              logicalOperator === 'or' ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            OR
          </button>
        </div>
      )}

      <div className="space-y-3">
        {conditions.map((c, i) => (
          <div key={i} className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl space-y-4 relative group/rule">
            {conditions.length > 1 && (
              <button 
                onClick={() => removeCondition(i)} 
                className="absolute -top-2 -right-2 h-6 w-6 bg-white dark:bg-slate-800 border mirror- border-slate-200 dark:border-slate-700 text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center transition-all shadow-sm z-10"
              >
                <TrashIcon className="w-3 h-3" />
              </button>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 w-full">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Field</Label>
                <Select value={c.field} onValueChange={v => { const next = [...conditions]; next[i].field = v; updateConditions(next); }}>
                  <SelectTrigger className="h-8 text-xs dark:bg-slate-900/50 w-full"><SelectValue /></SelectTrigger>
                  <SelectContent className="text-xs">
                    {CONDITION_FIELDS.map(f => <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 w-full">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Operator</Label>
                <Select value={c.operator} onValueChange={v => { const next = [...conditions]; next[i].operator = v; updateConditions(next); }}>
                  <SelectTrigger className="h-8 text-xs dark:bg-slate-900/50 w-full"><SelectValue /></SelectTrigger>
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
                  value={c.value} 
                  onChange={e => { const next = [...conditions]; next[i].value = e.target.value; updateConditions(next); }} 
                  placeholder="Value to compare..." 
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10 space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-bold text-primary">
          <ArrowsRightLeftIcon className="w-4 h-4" />
          Branch Names
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-slate-400 pl-1">True Path</span>
            <Input className="h-8 text-xs bg-white dark:bg-slate-900" value={data.trueLabel || 'YES'} onChange={e => onChange({...data, trueLabel: e.target.value})} />
          </div>
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-slate-400 pl-1">False Path</span>
            <Input className="h-8 text-xs bg-white dark:bg-slate-900" value={data.falseLabel || 'NO'} onChange={e => onChange({...data, falseLabel: e.target.value})} />
          </div>
        </div>
      </div>
    </div>
  );
};
