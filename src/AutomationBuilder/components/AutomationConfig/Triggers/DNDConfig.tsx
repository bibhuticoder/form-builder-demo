import { Label } from "@/components/label"
import { Button } from "@/components/Button"
import { Combobox, ComboboxOption } from "@/components/Combobox"
import { cn } from "@/lib/utils"

export const DNDConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const triggerType = data.triggerType || 'dnd_on';

  const allChannels: ComboboxOption[] = [
    { id: 'all', label: 'All Channels' },
    { id: 'sms', label: 'SMS' },
    { id: 'email', label: 'Email' },
    { id: 'call', label: 'Calls' },
    { id: 'fb', label: 'Facebook / Messenger' },
    { id: 'gmb', label: 'Google Business' },
    { id: 'instagram', label: 'Instagram' },
    { id: 'tiktok', label: 'TikTok' },
  ];

  const dndChannels = data.dndChannels || [];

  const handleChannelChange = (val: (string | number)[]) => {
    // If 'all' was just added, clear others. If other was added while 'all' exists, remove 'all'.
    let nextChannels = val as string[];

    const hadAll = dndChannels.includes('all');
    const hasAll = nextChannels.includes('all');

    if (hasAll && !hadAll) {
      nextChannels = ['all'];
    } else if (hasAll && nextChannels.length > 1) {
      nextChannels = nextChannels.filter(id => id !== 'all');
    }

    const count = nextChannels.length;
    const statusLabel = triggerType === 'dnd_on' ? 'Silenced' : 'Reactivated';

    let subtitle = '';
    if (nextChannels.includes('all')) {
      subtitle = `${statusLabel}: All Channels`;
    } else {
      subtitle = `${statusLabel}: ${count} channel${count !== 1 ? 's' : ''}`;
    }

    onChange({ ...data, dndChannels: nextChannels, subtitle });
  };

  const channelText = dndChannels.includes('all')
    ? 'all channels'
    : (dndChannels.length > 0
      ? dndChannels.map((id: string) => allChannels.find(c => c.id === id)?.label || id.toUpperCase()).join(', ')
      : '.........');

  return (
    <div className="space-y-6">
      {/* Trigger Condition (Segmented Control) */}
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">DND Status</Label>
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg w-full border border-slate-200 dark:border-slate-800 shadow-sm">
          {[
            { id: 'dnd_on', label: 'Silenced' },
            { id: 'dnd_off', label: 'Reactivated' }
          ].map(t => (
            <Button
              key={t.id}
              variant={triggerType === t.id ? 'primary' : 'ghost'}
              size="sm"
              className={cn("flex-1 h-7 text-[12px] px-1 rounded-md capitalize transition-all", triggerType === t.id ? "shadow-sm" : "text-slate-500 hover:text-slate-700")}
              onClick={() => {
                const status = t.id === 'dnd_on' ? 'Silenced' : 'Reactivated';
                const countText = dndChannels.includes('all') ? 'All Channels' : `${dndChannels.length} channels`;
                onChange({
                  ...data,
                  triggerType: t.id,
                  label: `DND ${t.label}`,
                  subtitle: `DND ${status}: ${countText}`
                });
              }}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Monitor Channels Section (Multi-select Combobox) */}
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Monitor Channels</Label>
        <Combobox
          multiple={true}
          options={allChannels}
          value={dndChannels}
          onValueChange={handleChannelChange}
          placeholder="Select channels..."
          className="w-full"
        />
        <p className="text-[11px] text-slate-400 pl-0.5 italic mt-1">Pick specific channels or select "All Channels" to monitor entire contact.</p>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl transition-all hover:bg-primary/10">
        <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          {triggerType === 'dnd_on' ? (
            <>
              Trigger when a contact's communication channel is <span className="text-primary font-bold">silenced</span> (they opt-in or DND is disabled) for <span className={cn("font-bold", dndChannels.length > 0 ? "text-primary" : "text-slate-400")}>{channelText}</span>.</>
          ) : (
            <>Trigger when communication is <span className="text-primary font-bold">reactivated</span> (they opt-out or DND is enabled) for <span className={cn("font-bold", dndChannels.length > 0 ? "text-primary" : "text-slate-400")}>{channelText}</span>.</>
          )}
        </p>
      </div>
    </div>
  );
};
