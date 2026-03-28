import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from "@/components"
import { cn } from "@/lib/utils"

const CAMPAIGNS = [
  { id: 'c1', name: 'Google Review Request' },
  { id: 'c2', name: 'Facebook Review Request' },
  { id: 'c3', name: 'Trustpilot Campaign' },
];

export const ReviewAutopilotConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const isEnabled = data.enabled !== false;

  const updateField = (key: string, val: any) => {
    const next = { ...data, [key]: val };
    
    if (key === 'campaignId' || key === 'enabled') {
      const enabled = key === 'enabled' ? val : (next.enabled !== false);
      const campaignName = CAMPAIGNS.find(c => c.id === next.campaignId)?.name;
      
      if (!enabled) {
        next.subtitle = 'Disabled';
      } else {
        next.subtitle = campaignName ? `Campaign: ${campaignName}` : 'Review Autopilot';
      }
    }

    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <Label className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">Enable Autopilot</Label>
          <p className="text-[11px] text-slate-400 leading-tight">Automatically request reviews for this contact.</p>
        </div>
        <Switch 
          checked={isEnabled} 
          onCheckedChange={(val) => updateField('enabled', val)} 
        />
      </div>

      <div className={cn(
        "space-y-1.5 flex flex-col items-start w-full transition-opacity",
        isEnabled ? "opacity-100" : "opacity-40 pointer-events-none"
      )}>
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Select Campaign</Label>
        <Select value={data.campaignId} onValueChange={(val) => updateField('campaignId', val)}>
          <SelectTrigger className="h-8 text-[13px] dark:bg-slate-900/50 hover:border-primary transition-colors w-full rounded-lg">
            <SelectValue placeholder="Choose campaign..." />
          </SelectTrigger>
          <SelectContent>
            {CAMPAIGNS.map(c => (
              <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
