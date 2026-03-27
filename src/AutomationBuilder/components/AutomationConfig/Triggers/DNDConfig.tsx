import { Label } from "@/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"

export const DNDConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const updateField = (key: string, val: any) => {
    const next = { ...data, [key]: val };
    const status = next.status === 'on' ? 'ON' : 'OFF';
    next.subtitle = `DND: ${status}`;
    onChange(next);
  };
  return (
    <div className="space-y-6">
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Status</Label>
        <Select value={data.status || 'on'} onValueChange={v => updateField('status', v)}>
          <SelectTrigger className="h-8 text-[13px] dark:bg-slate-900/50 hover:border-primary/50 transition-colors w-full"><SelectValue placeholder={data.status === 'off' ? 'Disabled (OFF)' : 'Enabled (ON)'} /></SelectTrigger>
          <SelectContent className="w-full text-xs">
            <SelectItem value="on" className="py-1.5">Enabled (ON)</SelectItem>
            <SelectItem value="off" className="py-1.5">Disabled (OFF)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl space-y-2">
        <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">"When DND is enabled, no communication (SMS/Email) will be sent to the contact via this automation."</p>
      </div>
    </div>
  );
};
