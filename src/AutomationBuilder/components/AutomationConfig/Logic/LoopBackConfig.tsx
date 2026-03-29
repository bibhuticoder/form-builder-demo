import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Input } from "@/components"
import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { useReactFlow } from "reactflow"

export const LoopBackConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const { getNodes } = useReactFlow();

  // Potential targets: only action nodes, excluding itself and terminal/special nodes
  const nodes = getNodes().filter(n =>
    n.id !== data.id &&
    n.type?.startsWith('action') &&
    !['End Automation', 'Send To Automation', 'Loop Back To'].includes(n.data?.label || '')
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl flex gap-3">
        <InformationCircleIcon className="w-5 h-5 text-amber-500 shrink-0" />
        <p className="text-[12px] text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
          Connect this step to an earlier part of your automation to create a loop. The automation will repeat the sequence between these nodes.
        </p>
      </div>

      <div className="space-y-2 flex flex-col items-start w-full">
        <Label className="text-[12px] font-bold text-slate-700 dark:text-slate-200 pl-0.5">Loop Target</Label>
        <Select
          value={data.targetId || ""}
          onValueChange={v => onChange({ ...data, targetId: v })}
        >
          <SelectTrigger className="h-10 dark:bg-slate-900/50">
            <SelectValue placeholder={nodes.length > 0 ? "Select target step..." : "No targets available"}>
              {(() => {
                const n = nodes.find(n => n.id === data.targetId);
                return n ? `${n.data?.label || 'Untitled Step'} (${n.id.split('-')[0]})` : undefined;
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {nodes.map(n => (
              <SelectItem key={n.id} value={n.id}>
                {n.data?.label || 'Untitled Step'} ({n.id.split('-')[0]})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-[10px] text-slate-400 mt-1 pl-1">
          {data.targetId ? "The flow will redirect here." : "Drag the connection handle on the canvas or select a target above."}
        </p>
      </div>

      <div className="space-y-2 flex flex-col items-start w-full pt-2">
        <Label className="text-[12px] font-bold text-slate-700 dark:text-slate-200 pl-0.5">Maximum Loops (Safety)</Label>
        <div className="flex items-center gap-3 w-full">
          <Input
            type="number"
            min={1}
            max={5}
            className="h-10 text-[13px] dark:bg-slate-900/50 w-24"
            value={data.maxLoops || 1}
            onChange={e => {
              let val = parseInt(e.target.value);
              if (val > 5) val = 5;
              if (val < 1) val = 1;
              onChange({ ...data, maxLoops: val });
            }}
          />
          <div className="flex-1 p-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg">
            <p className="text-[10px] text-slate-500 font-medium">Cycles (Max: 5)</p>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 pl-1 leading-relaxed italic">
          Prevents infinite cycles by stopping after {data.maxLoops || 1} repetition(s).
        </p>
      </div>
    </div>
  );
};
