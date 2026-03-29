import { Label } from "@/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { AUTOMATIONS } from "../helpers"
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"

export const SendToAutomationConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const updateField = (val: string) => {
    const autom = AUTOMATIONS.find(a => a.id === val);
    const subtitle = autom ? `Target: ${autom.name}` : 'Select Automation';
    onChange({ ...data, targetAutomationId: val, subtitle });
  };

  const currentAutomation = AUTOMATIONS.find(a => a.id === data.targetAutomationId);

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Destination Automation</Label>
        <Select
          value={data.targetAutomationId}
          onValueChange={updateField}
        >
          <SelectTrigger className="h-9 text-[13px] bg-white dark:bg-slate-900/50 hover:border-primary dark:hover:border-primary/50 transition-all w-full rounded-lg border-slate-200 shadow-sm pr-3">
            <SelectValue placeholder="Search or select automation..." />
          </SelectTrigger>
          <SelectContent className="w-full">
            {AUTOMATIONS.map(a => (
              <SelectItem key={a.id} value={a.id} className="text-xs py-2.5 transition-colors group">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center justify-center text-[10px] font-bold group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                      <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                    </div>
                    {a.name}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {!currentAutomation &&
          <p className="text-[11px] text-slate-400 font-medium italic pl-0.5 mt-2">
            Flow of this automaation will be sent to the <span className="text-slate-900 dark:text-slate-100 font-bold">'Start'</span> node of the selected automation.
          </p>}
      </div>

      {/* Info Box */}
      {currentAutomation && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl animate-in zoom-in-95 duration-300">
          <p className="text-[13px] text-emerald-700 dark:text-emerald-400 leading-relaxed font-medium">
            Flow of this automaation will be bridged into the
            <span className="text-emerald-900 dark:text-emerald-100 font-bold mx-1">"{currentAutomation.name}"</span>
            pipeline immediately after reaching this step.
          </p>
        </div>
      )}
    </div>
  );
};
