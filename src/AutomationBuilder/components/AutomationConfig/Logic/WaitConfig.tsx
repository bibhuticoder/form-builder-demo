import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Input } from "@/components"
import { cn } from "@/lib/utils"
import { ClockIcon, CalendarDaysIcon } from "@heroicons/react/24/outline"

export const WaitConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const mode = data.mode || 'duration';

  const updateField = (key: string, val: any) => {
    const next = { ...data, [key]: val };
    
    // Subtitle logic
    if (next.mode === 'until') {
      next.subtitle = next.untilTime ? `Wait until ${next.untilTime}` : 'Wait until specific time';
    } else {
      const waitDuration = next.duration || 1;
      const waitUnit = next.unit || 'minutes';
      next.subtitle = `Wait ${waitDuration} ${waitUnit}`;
    }

    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Wait Type</Label>
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg w-full border border-slate-200 dark:border-slate-800 shadow-sm">
          {[
            { id: 'duration', label: 'For Duration', icon: ClockIcon },
            { id: 'until', label: 'Until Time', icon: CalendarDaysIcon }
          ].map(m => (
            <button
              key={m.id}
              className={cn(
                "flex-1 h-8 flex items-center justify-center gap-2 text-[12px] px-2 rounded-md font-medium transition-all outline-none",
                mode === m.id
                  ? "bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-700/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50 dark:hover:bg-slate-800/50"
              )}
              onClick={() => updateField('mode', m.id)}
            >
              <m.icon className="w-3.5 h-3.5" />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {mode === 'duration' ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 flex flex-col items-start w-full">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Duration</Label>
            <Input 
              type="number" 
              min="1" 
              className="h-9 text-[13px] dark:bg-slate-900/50" 
              value={data.duration || 1} 
              onChange={e => updateField('duration', e.target.value)} 
            />
          </div>
          <div className="space-y-1.5 flex flex-col items-start w-full">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Time Unit</Label>
            <Select value={data.unit || 'minutes'} onValueChange={(val) => updateField('unit', val)}>
              <SelectTrigger className="h-9 text-[13px] dark:bg-slate-900/50 w-full rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-1.5 flex flex-col items-start w-full">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Specific Time</Label>
            <Input 
              type="time" 
              className="h-9 text-[13px] dark:bg-slate-900/50" 
              value={data.untilTime || ''} 
              onChange={e => updateField('untilTime', e.target.value)} 
            />
          </div>
          <div className="space-y-1.5 flex flex-col items-start w-full">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Days of Week</Label>
            <div className="flex gap-1.5 w-full">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                const dayId = idx + 1;
                const activeDays = data.activeDays || [1, 2, 3, 4, 5];
                const isActive = activeDays.includes(dayId);
                return (
                  <button
                    key={idx}
                    className={cn(
                      "flex-1 h-8 rounded-md text-[11px] font-bold border transition-all",
                      isActive 
                        ? "bg-primary/10 border-primary/20 text-primary" 
                        : "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-400"
                    )}
                    onClick={() => {
                      const nextDays = isActive ? activeDays.filter((d: number) => d !== dayId) : [...activeDays, dayId];
                      updateField('activeDays', nextDays);
                    }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Advanced Settings */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Respect time zones</span>
          </div>
          <span className="text-[10px] font-medium text-slate-400">Account Local</span>
        </div>
      </div>
    </div>
  );
};
