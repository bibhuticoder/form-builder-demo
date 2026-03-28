import { Label, Input } from "@/components"
import { InformationCircleIcon, ArrowPathIcon } from "@heroicons/react/24/outline"
import { useReactFlow } from "reactflow"

export const LoopBackConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const { getNodes, getEdges } = useReactFlow();
  
  // Try to find what this node is connected to
  const allEdges = getEdges();
  const outgoingEdge = allEdges.find(e => e.source === data.id && e.data?.isLoopBack);
  const targetNode = outgoingEdge ? getNodes().find(n => n.id === outgoingEdge.target) : null;

  return (
    <div className="space-y-6">
      <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl flex gap-3 animate-in slide-in-from-top-2 duration-500">
        <InformationCircleIcon className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
            Recurring loops allow you to repeat actions.
          </p>
          {targetNode ? (
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-2 bg-amber-100/50 dark:bg-amber-900/30 px-2 py-1 rounded w-fit">
              <ArrowPathIcon className="w-3 h-3" />
              Loops back to: {targetNode.data?.label || 'Previous Step'}
            </div>
          ) : (
            <p className="text-[10px] text-amber-600/70 dark:text-amber-400/70 italic">
              Connect the circular handle to a previous step to set a target.
            </p>
          )}
        </div>
      </div>
      
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Max Loops (Safety)</Label>
        <Input 
          type="number" 
          min={1} 
          max={10} 
          className="h-9 text-[13px] dark:bg-slate-900/50 w-full" 
          value={data.maxLoops || 1} 
          onChange={e => onChange({ ...data, maxLoops: e.target.value })} 
        />
        <p className="text-[10px] text-slate-400 mt-2 italic pl-0.5 leading-relaxed">
          The automation will stop after this many cycles to prevent infinite loops.
        </p>
      </div>
    </div>
  );
};
