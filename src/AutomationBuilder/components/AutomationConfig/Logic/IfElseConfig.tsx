import { useState } from "react"
import type { Node } from "reactflow"
import { Button } from "@/components/Button"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline"

export const IfElseConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void, edges: any[], node: Node }) => {
  const [conditions, setConditions] = useState<any[]>(data.conditions || [{ field: 'tag', operator: 'contains', value: '' }]);

  const updateConditions = (next: any[]) => {
    setConditions(next);
    onChange({ ...data, conditions: next, subtitle: `${next.length} Condition(s)` });
  };

  const addCondition = () => updateConditions([...conditions, { field: 'tag', operator: 'contains', value: '' }]);
  const removeCondition = (idx: number) => updateConditions(conditions.filter((_, i) => i !== idx));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-0.5">
        <div>
          <Label className="text-[12px] font-bold text-slate-700 dark:text-slate-200 leading-none">Logical Rules</Label>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">Define execution paths</p>
        </div>
        <Button variant="ghost" size="sm" onClick={addCondition} className="h-7 text-xs font-bold text-primary hover:text-primary hover:bg-primary/5 rounded-lg border border-primary/20"><PlusIcon className="w-3 h-3 mr-1" /> Add Rule</Button>
      </div>

      <div className="space-y-4">
        {conditions.map((c, i) => (
          <div key={i} className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl space-y-4 relative group/rule">
            {conditions.length > 1 && <button onClick={() => removeCondition(i)} className="absolute -top-2 -right-2 h-6 w-6 bg-white dark:bg-slate-800 border-2 border-red-100 dark:border-red-900/30 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover/rule:opacity-100 transition-all shadow-sm hover:bg-red-50" title="Remove branch"><TrashIcon className="w-3 h-3" /></button>}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 flex flex-col items-start w-full">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Field</Label>
                <Select value={c.field} onValueChange={v => { const next = [...conditions]; next[i].field = v; updateConditions(next); }}>
                  <SelectTrigger className="h-8 text-xs dark:bg-slate-900/50 w-full"><SelectValue placeholder="Select Field" /></SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="tag" className="py-1.5">Tag</SelectItem>
                    <SelectItem value="email_opened" className="py-1.5">Email Opened</SelectItem>
                    <SelectItem value="form_submitted" className="py-1.5">Form Submitted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 flex flex-col items-start w-full">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Operator</Label>
                <Select value={c.operator} onValueChange={v => { const next = [...conditions]; next[i].operator = v; updateConditions(next); }}>
                  <SelectTrigger className="h-8 text-xs dark:bg-slate-900/50 w-full"><SelectValue placeholder="Operator" /></SelectTrigger>
                  <SelectContent className="text-xs">
                    <SelectItem value="contains" className="py-1.5">Contains</SelectItem>
                    <SelectItem value="not_contains" className="py-1.5">Doesn't contain</SelectItem>
                    <SelectItem value="is_empty" className="py-1.5">Is empty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5 flex flex-col items-start w-full">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Value</Label>
              <Input className="h-8 text-xs dark:bg-slate-900/50 w-full" value={c.value} onChange={e => { const next = [...conditions]; next[i].value = e.target.value; updateConditions(next); }} placeholder="Enter value..." />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
