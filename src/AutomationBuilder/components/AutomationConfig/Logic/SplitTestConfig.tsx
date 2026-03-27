import { Label } from "@/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"

export const SplitTestConfig = ({ data, onChange, edges }: { data: any, onChange: (d: any) => void, node: any, edges: any[] }) => {
  const siblings = edges.filter(e => e.source === data.id && e.sourceHandle !== 'right-source');
  const count = Math.max(2, siblings.length);

  const updateWeights = (idx: number, val: string) => {
    const weights = data.weights || Array(count).fill(Math.floor(100 / count));
    weights[idx] = parseInt(val) || 0;
    onChange({ ...data, weights: [...weights] });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Test Strategy</Label>
        <Select value={data.strategy || 'even'} onValueChange={v => onChange({ ...data, strategy: v })}>
          <SelectTrigger className="h-8 text-[13px] dark:bg-slate-900/50 hover:border-primary/50 transition-colors w-full"><SelectValue placeholder="Even Split" /></SelectTrigger>
          <SelectContent className="w-full text-xs text-xs"><SelectItem value="even" className="py-1.5">Even Split</SelectItem><SelectItem value="weighted" className="py-1.5">Weighted Split</SelectItem></SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Branch Distribution</Label>
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="h-6 w-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold ring-1 ring-primary/20">
                {String.fromCharCode(65 + i)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1.5 pr-1">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Branch {i + 1}</span>
                  <span className="text-[11px] font-bold text-primary">{(data.weights || [])[i] || Math.floor(100 / count)}%</span>
                </div>
                <input
                  type="range"
                  className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                  value={(data.weights || [])[i] || Math.floor(100 / count)}
                  onChange={e => updateWeights(i, e.target.value)}
                  disabled={data.strategy !== 'weighted'}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
