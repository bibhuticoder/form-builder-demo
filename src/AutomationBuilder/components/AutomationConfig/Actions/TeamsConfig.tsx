import { Label, RichText, Combobox, type ComboboxOption } from "@/components"

const TEAMS_CHANNELS: ComboboxOption[] = [
  { id: 'general', label: 'General' },
  { id: 'marketing', label: 'Marketing Team' },
  { id: 'support', label: 'Customer Support' },
  { id: 'legal', label: 'Legal & HR' },
];

export const TeamsConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const updateField = (key: string, val: any) => {
    const next = { ...data, [key]: val };
    
    if (key === 'channelId') {
      const channelLabel = TEAMS_CHANNELS.find(c => c.id === val)?.label;
      next.subtitle = channelLabel ? `Teams: ${channelLabel}` : 'Send To Teams';
    }

    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Teams Channel Name</Label>
        <Combobox
          options={TEAMS_CHANNELS}
          value={data.channelId}
          onValueChange={(val) => updateField('channelId', val)}
          placeholder="Search for a channel..."
          className="w-full"
        />
      </div>

      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5 mb-1">Message Body</Label>
        <RichText
          content={data.message || ''}
          onChange={(html) => updateField('message', html)}
          className="w-full min-h-[150px]"
          placeholder="What should be sent to Teams?"
        />
      </div>
    </div>
  );
};
