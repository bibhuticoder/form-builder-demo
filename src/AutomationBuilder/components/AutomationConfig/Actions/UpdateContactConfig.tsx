import { Label, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components"

const CONTACT_FIELDS = [
  { id: 'firstName', label: 'First Name' },
  { id: 'lastName', label: 'Last Name' },
  { id: 'email', label: 'Email Address' },
  { id: 'phone', label: 'Phone Number' },
  { id: 'address', label: 'Address' },
  { id: 'city', label: 'City' },
  { id: 'zip', label: 'Zip Code' },
  { id: 'birthday', label: 'Birthday' },
];

export const UpdateContactConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const updateField = (key: string, val: any) => {
    const next = { ...data, [key]: val };
    
    if (key === 'field') {
      const fieldLabel = CONTACT_FIELDS.find(f => f.id === val)?.label;
      next.subtitle = fieldLabel ? `Update ${fieldLabel}` : 'Update Contact Field';
    }

    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Select Field</Label>
        <Select value={data.field} onValueChange={(val) => updateField('field', val)}>
          <SelectTrigger className="h-8 text-[13px] dark:bg-slate-900/50 hover:border-primary transition-colors w-full rounded-lg">
            <SelectValue placeholder="Choose a field..." />
          </SelectTrigger>
          <SelectContent>
            {CONTACT_FIELDS.map(f => (
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
