import { Label, RichText, Combobox, type ComboboxOption } from "@/components"

const SLACK_CHANNELS: ComboboxOption[] = [
  { id: 'general', label: '#general' },
  { id: 'random', label: '#random' },
  { id: 'notifications', label: '#notifications' },
  { id: 'sales-alerts', label: '#sales-alerts' },
  { id: 'dev-stream', label: '#dev-stream' },
];

export const SlackConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const updateField = (key: string, val: any) => {
    const next = { ...data, [key]: val };
    
    if (key === 'channelId') {
      const channelLabel = SLACK_CHANNELS.find(c => c.id === val)?.label;
      next.subtitle = channelLabel ? `Slack: ${channelLabel}` : 'Send To Slack';
    }

    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Slack Channel</Label>
        <Combobox
          options={SLACK_CHANNELS}
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
          placeholder="What should be sent to Slack?"
        />
      </div>
    </div>
  );
};
