import { Label, RichText, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Checkbox } from "@/components"
import { USERS, TEAMS } from "../helpers"
import { cn } from "@/lib/utils"

export const NotificationConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const recipientType = data.recipientType || 'user';

  const updateField = (key: string, val: any) => {
    const next = { ...data, [key]: val };

    // Subtitle generation logic
    const recipient = recipientType === 'user'
      ? USERS.find(u => u.id === next.recipientId)?.name
      : TEAMS.find(t => t.id === next.recipientId)?.name;

    next.subtitle = `To: ${recipient || 'Select Recipient'}`;
    onChange(next);
  };

  const handleChannelToggle = (channel: string, visited: boolean) => {
    const channels = { ...(data.channels || { email: true, inApp: true }), [channel]: visited };
    onChange({ ...data, channels });
  };

  const channels = data.channels || { email: true, inApp: true };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Recipients</Label>
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg w-full border border-slate-200 dark:border-slate-800 shadow-sm">
          {[
            { id: 'user', label: 'Specific User' },
            { id: 'team', label: 'Whole Team' }
          ].map(t => (
            <button
              key={t.id}
              className={cn(
                "flex-1 h-7 text-[12px] px-1 rounded-md capitalize font-medium transition-all outline-none",
                recipientType === t.id
                  ? "bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-700/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50 dark:hover:bg-slate-800/50"
              )}
              onClick={() => {
                onChange({ ...data, recipientType: t.id, recipientId: undefined, subtitle: `To: Select ${t.label}` });
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <Select
          value={data.recipientId}
          onValueChange={(val: string) => updateField('recipientId', val)}
        >
          <SelectTrigger className="h-9 text-[13px] dark:bg-slate-900/50 hover:border-primary transition-colors w-full rounded-lg">
            <SelectValue placeholder={`Select ${recipientType === 'user' ? 'User' : 'Team'}...`}>
              {(recipientType === 'user' ? USERS : TEAMS).find(i => i.id === data.recipientId)?.name}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="w-full">
            {(recipientType === 'user' ? USERS : TEAMS).map(item => (
              <SelectItem key={item.id} value={item.id} className="text-xs py-2 group">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold group-hover:bg-primary/10 transition-colors">
                    {item.name.charAt(0)}
                  </div>
                  {item.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Notification Channels</Label>
        <div className="grid grid-cols-3 gap-3">
          <Checkbox
            label="Email"
            checked={channels.email}
            onCheckedChange={(c: boolean) => handleChannelToggle('email', c)}
          />
          <Checkbox
            label="SMS"
            checked={channels.sms}
            onCheckedChange={(c: boolean) => handleChannelToggle('sms', c)}
          />
          <Checkbox
            label="In-App"
            checked={channels.inApp}
            onCheckedChange={(c: boolean) => handleChannelToggle('inApp', c)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Notification Message</Label>
        <RichText
          content={data.message || ''}
          onChange={(html: string) => updateField('message', html)}
          className="w-full min-h-[160px]"
          placeholder="Briefly describe the event..."
          editable={true}
        />
      </div>
    </div>
  );
};
