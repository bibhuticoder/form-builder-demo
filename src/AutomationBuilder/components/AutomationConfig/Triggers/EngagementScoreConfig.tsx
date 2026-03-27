
import { Label } from "@/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { Input } from "@/components/input"

export const EngagementScoreConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const operators = [
    { id: 'above', label: 'Goes Above' },
    { id: 'below', label: 'Falls Below' },
    { id: 'exactly', label: 'Is Exactly' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 flex flex-col items-start w-full">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Condition</Label>
          <Select value={data.operator || 'above'} onValueChange={(val) => onChange({ ...data, operator: val, subtitle: `Score ${val} ${data.score || 0}` })}>
            <SelectTrigger className="h-8 text-[13px] hover:border-primary/50 transition-colors w-full"><SelectValue /></SelectTrigger>
            <SelectContent className="w-full">{operators.map(o => <SelectItem key={o.id} value={o.id} className="text-xs py-1.5">{o.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 flex flex-col items-start w-full">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Score Threshold</Label>
          <Input type="number" min="0" max="100" className="h-8 text-[13px]" value={data.score || 0} onChange={e => onChange({ ...data, score: e.target.value, subtitle: `Score ${data.operator || 'above'} ${e.target.value}` })} />
        </div>
      </div>
    </div>
  );
};
