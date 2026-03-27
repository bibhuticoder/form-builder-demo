
import { Label } from "@/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { Button } from "@/components/Button"
import { Input } from "@/components/input"
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"

export const EntityTriggerConfig = ({ data, onChange, entityName }: { data: any, onChange: (d: any) => void, entityName: string }) => {
  const triggerType = data.triggerType || 'added';
  const fields = [
    { id: 'first_name', label: 'First Name' },
    { id: 'last_name', label: 'Last Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'city', label: 'City' },
    { id: 'tags', label: 'Tags' },
  ];

  const addCondition = () => {
    const next = [...(data.conditions || []), { field: fields[0].id, operator: 'changed', value: '' }];
    onChange({ ...data, conditions: next });
  };

  const updateCondition = (idx: number, key: string, val: any) => {
    const next = [...(data.conditions || [])];
    next[idx] = { ...next[idx], [key]: val };
    onChange({ ...data, conditions: next, subtitle: `${next.length} fields monitored` });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Action</Label>
        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg w-full border border-slate-200 dark:border-slate-800">
          {['added', 'removed', 'updated'].map(t => (
            <Button
              key={t}
              variant={triggerType === t ? 'primary' : 'ghost'}
              size="sm"
              className={cn("flex-1 h-7 text-[11px] px-3.5 rounded-md capitalize", triggerType === t ? "shadow-sm" : "text-slate-500")}
              onClick={() => onChange({ ...data, triggerType: t, label: `${entityName} ${t.charAt(0).toUpperCase() + t.slice(1)}` })}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      {triggerType === 'updated' && (
        <div className="space-y-4">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5 block mb-1">Field Conditions</Label>
          <div className="space-y-3">
            {(data.conditions || []).map((c: any, i: number) => (
              <div key={i} className="flex gap-2 items-center group w-full">
                <Select value={c.field} onValueChange={v => updateCondition(i, 'field', v)}>
                  <SelectTrigger className="w-[140px] h-8 text-xs shrink-0"><SelectValue placeholder={fields.find(f => f.id === c.field)?.label} /></SelectTrigger>
                  <SelectContent>{fields.map(f => <SelectItem key={f.id} value={f.id} className="text-xs py-1.5">{f.label}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={c.operator} onValueChange={v => updateCondition(i, 'operator', v)}>
                  <SelectTrigger className="w-[110px] h-8 text-xs shrink-0"><SelectValue placeholder={c.operator} /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="changed" className="text-xs py-1.5">Changed</SelectItem>
                    <SelectItem value="equals" className="text-xs py-1.5">Equals</SelectItem>
                  </SelectContent>
                </Select>
                <Input className="flex-1 h-8 text-[13px]" value={c.value} onChange={e => updateCondition(i, 'value', e.target.value)} placeholder="Value..." />
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors shrink-0" onClick={() => {
                  const next = data.conditions.filter((_: any, idx: number) => idx !== i);
                  onChange({ ...data, conditions: next });
                }}>
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full h-8 text-xs border-dashed border-2 hover:border-primary hover:text-primary transition-all rounded-lg" onClick={addCondition}>
            <PlusIcon className="w-4 h-4 mr-1.5" /> Add Field to Watch
          </Button>
        </div>
      )}
    </div>
  );
};
