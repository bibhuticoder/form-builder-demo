
import { Label } from "@/components/label"
import { Input } from "@/components/input"
import { InformationCircleIcon } from "@heroicons/react/24/outline"

export const LoopBackConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => (
  <div className="space-y-6">
    <div className="p-4 bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-xl flex gap-3">
      <InformationCircleIcon className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
      <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium">Connect this node back to a previous step in the flow to create a recurring sequence.</p>
    </div>
    <div className="space-y-1.5 flex flex-col items-start w-full">
      <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Max Loops (Safety)</Label>
      <Input type="number" min={1} max={5} className="h-8 text-[13px] dark:bg-slate-900/50 w-full" value={data.maxLoops || 1} onChange={e => onChange({ ...data, maxLoops: e.target.value })} />
      <p className="text-[10px] text-slate-400 mt-1 italic pl-0.5">Limits to 5 to prevent infinite cycles.</p>
    </div>
  </div>
);
