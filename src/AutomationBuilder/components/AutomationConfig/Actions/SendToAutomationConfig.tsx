
import { Label } from "@/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { AUTOMATIONS } from "../helpers"

export const SendToAutomationConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const currentAutomation = AUTOMATIONS.find(a => a.id === data.automationId);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 flex flex-col items-start w-full transition-all">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Select Automation</Label>
        <Select value={data.automationId} onValueChange={(val) => {
          const a = AUTOMATIONS.find(x => x.id === val);
          onChange({ ...data, automationId: val, subtitle: a ? `Sequence: ${a.name}` : undefined });
        }}>
          <SelectTrigger className="h-10 text-[13px] hover:border-primary/50 transition-all w-full border-slate-200 rounded-xl shadow-sm">
            <SelectValue placeholder={currentAutomation?.name || "Select Automation"} />
          </SelectTrigger>
          <SelectContent className="w-full">
            {AUTOMATIONS.map(a => (
              <SelectItem key={a.id} value={a.id} className="text-xs py-2 group">
                <div className="flex items-center gap-2">
                  <span className="truncate group-hover:text-primary transition-colors">{a.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
