import { Label, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components"

const COMPANY_FIELDS = [
  { id: 'name', label: 'Company Name' },
  { id: 'website', label: 'Website URL' },
  { id: 'industry', label: 'Industry' },
  { id: 'size', label: 'Employee Count' },
  { id: 'address', label: 'Address' },
];

export const UpdateCompanyConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const updateField = (key: string, val: any) => {
    const next = { ...data, [key]: val };
    
    if (key === 'field') {
      const fieldLabel = COMPANY_FIELDS.find(f => f.id === val)?.label;
      next.subtitle = fieldLabel ? `Update ${fieldLabel}` : 'Update Company Field';
    }

    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Select Field</Label>
        <Select value={data.field} onValueChange={(val) => updateField('field', val)}>
          <SelectTrigger className="h-8 text-[13px] dark:bg-slate-900/50 hover:border-primary transition-colors w-full rounded-lg">
            <SelectValue placeholder="Choose a field...">
              {COMPANY_FIELDS.find(f => f.id === data.field)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {COMPANY_FIELDS.map(f => (
              <SelectItem key={f.id} value={f.id} className="text-xs">{f.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">New Value</Label>
        <Input
          className="h-8 text-[13px] dark:bg-slate-900/50 hover:border-primary transition-colors w-full"
          value={data.value || ''}
          onChange={e => updateField('value', e.target.value)}
          placeholder="Enter new value..."
        />
      </div>
    </div>
  );
};
