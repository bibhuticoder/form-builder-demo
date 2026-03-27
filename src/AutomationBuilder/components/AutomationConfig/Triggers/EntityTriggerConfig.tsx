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
    const next = [...(data.conditions || []), { field: fields[0].id, operator: 'has_changed', value: '' }];
    onChange({ ...data, conditions: next });
  };

  const updateCondition = (idx: number, key: string, val: any) => {
    const next = [...(data.conditions || [])];
    next[idx] = { ...next[idx], [key]: val };

    // If operator is has_changed, clear value
    if (key === 'operator' && val === 'has_changed') {
      next[idx].value = '';
    }

    const count = next.length;
    onChange({ ...data, conditions: next, subtitle: `${count} field${count !== 1 ? 's' : ''} monitored` });
  };

  const conditions = data.conditions || [];
  const fieldLabels = conditions.map((c: any) => fields.find(f => f.id === c.field)?.label || c.field);
  const fieldsText = fieldLabels.length > 0 ? fieldLabels.join(', ') : '.........';

  const entitySingular = entityName.endsWith('s') ? entityName.slice(0, -1) : entityName;

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Trigger condition</Label>
        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg w-full border border-slate-200 dark:border-slate-800">
          {['added', 'removed', 'updated'].map(t => (
            <Button
              key={t}
              variant={triggerType === t ? 'primary' : 'ghost'}
              size="sm"
              className={cn("flex-1 h-7 text-[12px] px-2 rounded-md capitalize transition-all", triggerType === t ? "shadow-sm" : "text-slate-500")}
              onClick={() => onChange({ ...data, triggerType: t, label: `${entityName} ${t.charAt(0).toUpperCase() + t.slice(1)}` })}
            >
              {entityName} {t}
            </Button>
          ))}
        </div>
      </div>

      {triggerType === 'updated' && (
        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5 block mb-1">Monitor Fields</Label>
          <div className="space-y-2">
            {conditions.map((c: any, i: number) => (
              <div key={i} className="p-1.5 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800 rounded-xl space-y-3 relative group">
                <div className="flex gap-2 items-center w-full">
                  <Select value={c.field} onValueChange={v => updateCondition(i, 'field', v)}>
                    <SelectTrigger className="flex-1 h-8 text-xs bg-white dark:bg-slate-900"><SelectValue placeholder={fields.find(f => f.id === c.field)?.label} /></SelectTrigger>
                    <SelectContent>{fields.map(f => <SelectItem key={f.id} value={f.id} className="text-xs py-1.5">{f.label}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={c.operator} onValueChange={v => updateCondition(i, 'operator', v)}>
                    <SelectTrigger className="flex-1 h-8 text-xs font-medium capitalize bg-white dark:bg-slate-900">
                      <SelectValue placeholder={(c.operator || '').replace(/_/g, ' ')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="has_changed" className="text-xs py-1.5">Has changed</SelectItem>
                      <SelectItem value="has_changed_to" className="text-xs py-1.5">Has changed to</SelectItem>
                      <SelectItem value="includes" className="text-xs py-1.5">Includes</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-slate-400 hover:text-red-500" onClick={() => {
                    const next = conditions.filter((_: any, idx: number) => idx !== i);
                    onChange({ ...data, conditions: next });
                  }}>
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
                {c.operator !== 'has_changed' && (
                  <div className="w-full animate-in fade-in slide-in-from-top-1 duration-200">
                    <Input
                      className="w-full h-8 text-[13px] bg-white dark:bg-slate-900 shadow-sm"
                      value={c.value}
                      onChange={e => updateCondition(i, 'value', e.target.value)}
                      placeholder="Enter value to match..."
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-xs text-primary hover:text-primary hover:bg-primary/5 rounded-lg border border-primary/20 bg-white dark:bg-slate-900 shadow-sm" onClick={addCondition}>
            <PlusIcon className="w-4 h-4 mr-1.5" /> Add Field to Watch
          </Button>
        </div>
      )}

      {/* Info Box */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl">
        <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
          {triggerType === 'updated' ? (
            <>Trigger when <span className={cn("font-bold text-slate-900 dark:text-slate-100", conditions.length > 0 ? "text-primary" : "text-slate-400")}>{fieldsText}</span> field(s) are updated on a {entitySingular}.</>
          ) : (
            <>Trigger when a {entitySingular} is {triggerType === 'added' ? 'added to' : 'removed from'} your system.</>
          )}
        </p>
      </div>
    </div>
  );
};
