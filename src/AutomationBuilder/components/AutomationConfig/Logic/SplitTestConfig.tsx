import { useEffect } from "react"
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button } from "@/components"
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"

export const SplitTestConfig = ({ data, onChange, edges }: { data: any, onChange: (d: any) => void, node: any, edges: any[] }) => {
  const siblings = edges.filter(e => e.source === data.id && e.sourceHandle !== 'right-source');
  const count = Math.max(2, siblings.length);

  // Initialize weights if missing or count changed
  useEffect(() => {
    if (!data.weights || data.weights.length !== count) {
      const evenValue = Math.floor(100 / count);
      const newWeights = Array(count).fill(evenValue);
      // Adjust last one to fit 100%
      newWeights[count - 1] = 100 - (evenValue * (count - 1));
      onChange({ ...data, weights: newWeights });
    }
  }, [count]);

  const updateWeight = (idx: number, val: number) => {
    const weights = [...(data.weights || [])];
    weights[idx] = val;
    onChange({ ...data, weights });
  };

  const resetToEven = () => {
    const evenValue = Math.floor(100 / count);
    const newWeights = Array(count).fill(evenValue);
    newWeights[count - 1] = 100 - (evenValue * (count - 1));
    onChange({ ...data, weights: newWeights, strategy: 'even' });
  };

  const total = (data.weights || []).reduce((acc: number, curr: number) => acc + curr, 0);
  const isImbalanced = total !== 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-0.5">
        <div>
          <Label className="text-[12px] font-bold text-slate-700 dark:text-slate-200 leading-none">A/B Testing</Label>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tight">Distribute traffic by percentage</p>
        </div>
        <Button variant="ghost" size="sm" onClick={resetToEven} className="h-7 text-xs font-bold text-primary hover:text-primary hover:bg-primary/5 rounded-lg border border-primary/20">
          Reset Evenly
        </Button>
      </div>

      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Split Strategy</Label>
        <Select value={data.strategy || 'even'} onValueChange={v => {
          if (v === 'even') resetToEven();
          else onChange({ ...data, strategy: v });
        }}>
          <SelectTrigger className="h-9 text-[13px] dark:bg-slate-900/50 hover:border-primary/50 transition-colors w-full rounded-lg">
            <SelectValue placeholder="Even Split" />
          </SelectTrigger>
          <SelectContent className="w-full">
            <SelectItem value="even">Evenly Distributed</SelectItem>
            <SelectItem value="weighted">Custom Weighted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Distribution</Label>
          {isImbalanced && data.strategy === 'weighted' && (
            <span className="text-[10px] font-bold text-red-500 animate-pulse">Total: {total}% (Must be 100%)</span>
          )}
        </div>
        
        <div className="space-y-2.5">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition-all hover:border-slate-200 dark:hover:border-slate-700">
              <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold ring-1 ring-primary/20 shadow-sm shrink-0">
                {String.fromCharCode(65 + i)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1.5 pr-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Branch {i + 1}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-primary">{(data.weights || [])[i]}%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className={cn(
                    "w-full h-1.5 rounded-lg appearance-none cursor-pointer transition-all",
                    data.strategy === 'weighted' ? "bg-slate-200 dark:bg-slate-800 accent-primary" : "bg-slate-100 dark:bg-slate-900 accent-slate-300 opacity-50"
                  )}
                  value={(data.weights || [])[i] || 0}
                  onChange={e => updateWeight(i, parseInt(e.target.value))}
                  disabled={data.strategy !== 'weighted'}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl flex gap-3 animate-in fade-in duration-500">
        <ArrowsRightLeftIcon className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-[12px] text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
          Traffic will be randomly assigned to paths when reaching this node, respecting the percentages above.
        </p>
      </div>
    </div>
  );
};
