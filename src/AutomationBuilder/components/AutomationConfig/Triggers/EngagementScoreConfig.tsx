import { Label } from "@/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Slider } from "@/components"

export const EngagementScoreConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const operators = [
    { id: 'gt', label: 'Greater than' },
    { id: 'gte', label: 'Greater than or equal to' },
    { id: 'lt', label: 'Less than' },
    { id: 'lte', label: 'Less than or equal to' },
    { id: 'eq', label: 'Equal to' },
  ];

  const currentScore = data.score !== undefined ? Number(data.score) : 50;
  const currentOperator = data.operator || 'gt';

  const updateConfig = (updates: any) => {
    const next = { ...data, ...updates };
    const op = operators.find(o => o.id === (next.operator || currentOperator));
    const subtitle = op ? `${op.label}: ${next.score ?? currentScore}` : 'Engagement Tracker';
    onChange({ ...next, subtitle });
  };

  const selectedOp = operators.find(o => o.id === currentOperator);
  const opLabel = selectedOp?.label.toLowerCase() || 'greater than';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Condition Selector */}
      <div className="space-y-2.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Condition</Label>
        <Select
          value={currentOperator}
          onValueChange={(val) => updateConfig({ operator: val })}
        >
          <SelectTrigger className="h-9 text-[13px] bg-white dark:bg-slate-900/50 hover:border-primary dark:hover:border-primary/50 transition-all w-full rounded-lg border-slate-200 shadow-sm pr-3">
            <SelectValue placeholder={selectedOp?.label || "Select condition"} />
          </SelectTrigger>
          <SelectContent className="w-full">
            {operators.map(o => (
              <SelectItem key={o.id} value={o.id} className="text-xs py-2 transition-colors">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Score Slider */}
      <div className="space-y-3 flex flex-col items-start w-full">
        <div className="flex justify-between items-center w-full px-0.5">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score Threshold</Label>
          <span className="text-[12px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg min-w-[36px] text-center border border-primary/20 shadow-sm transition-all animate-in zoom-in-95 duration-200">
            {currentScore}
          </span>
        </div>

        <div className="w-full px-1 py-1 group">
          <Slider
            value={currentScore}
            min={0}
            max={100}
            step={1}
            onValueChange={(val) => updateConfig({ score: val })}
            className="w-full"
          />
        </div>
      </div>

      {/* Helper Info */}
      <div className="p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl transition-all hover:bg-primary/10">
        <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
          Trigger automation when a contact's engagement score is <strong>{opLabel}</strong> <span className="text-primary font-bold decoration-primary/30 underline-offset-4 decoration-2">{currentScore}</span>.
        </p>
      </div>
    </div>
  );
};
