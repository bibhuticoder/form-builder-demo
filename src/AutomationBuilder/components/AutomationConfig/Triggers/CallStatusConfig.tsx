
import { Label } from "@/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"

export const CallStatusConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const statuses = [
    { id: 'all', label: 'Any Status' },
    { id: 'missed', label: 'Missed Call' },
    { id: 'completed', label: 'Completed Call' },
    { id: 'voicemail', label: 'Left Voicemail' },
    { id: 'no-answer', label: 'No Answer' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Call Result</Label>
        <Select value={data.status || 'all'} onValueChange={(val) => onChange({ ...data, status: val, subtitle: statuses.find(s => s.id === val)?.label })}>
          <SelectTrigger className="h-8 text-[13px] hover:border-primary/50 transition-colors w-full">
            <SelectValue placeholder={statuses.find(s => s.id === (data.status || 'all'))?.label} />
          </SelectTrigger>
          <SelectContent className="w-full">
            {statuses.map(s => (
              <SelectItem key={s.id} value={s.id} className="text-xs py-1.5">{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
