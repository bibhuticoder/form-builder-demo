
import { Label } from "@/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { Input } from "@/components/input"

export const WaitConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const units = [
    { id: 'minutes', label: 'Minutes' },
    { id: 'hours', label: 'Hours' },
    { id: 'days', label: 'Days' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 transition-all">
        <div className="space-y-1.5 flex flex-col items-start w-full">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Duration</Label>
          <Input type="number" min="1" className="h-10 text-[13px] bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl shadow-sm" value={data.duration || 1} onChange={e => {
            const next = { ...data, duration: e.target.value };
            next.subtitle = `Wait ${next.duration} ${next.unit || 'minutes'}`;
            onChange(next);
          }} />
        </div>
        <div className="space-y-1.5 flex flex-col items-start w-full">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Time Unit</Label>
          <Select value={data.unit || 'minutes'} onValueChange={(val) => {
            const next = { ...data, unit: val };
            next.subtitle = `Wait ${next.duration || 1} ${val}`;
            onChange(next);
          }}>
            <SelectTrigger className="h-10 text-[13px] hover:border-primary/50 transition-all w-full border-slate-200 rounded-xl shadow-sm"><SelectValue /></SelectTrigger>
            <SelectContent className="w-full">{units.map(u => <SelectItem key={u.id} value={u.id} className="text-xs py-2">{u.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
