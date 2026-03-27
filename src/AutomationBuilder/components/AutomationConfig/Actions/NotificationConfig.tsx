
import { Label } from "@/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { Textarea } from "@/components/textarea"
import { USERS, TEAMS, CHANNELS } from "../helpers"

export const NotificationConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const updateField = (key: string, val: any) => {
    const next = { ...data, [key]: val };
    const c = CHANNELS.find(x => x.id === next.channel)?.name || 'App';
    next.subtitle = `Notify via ${c}`;
    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 flex flex-col items-start w-full">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Channel</Label>
          <Select value={data.channel || 'app'} onValueChange={v => updateField('channel', v)}>
            <SelectTrigger className="h-8 text-[13px] hover:border-primary/50 transition-colors w-full"><SelectValue /></SelectTrigger>
            <SelectContent className="w-full">{CHANNELS.map(c => <SelectItem key={c.id} value={c.id} className="text-xs py-1.5">{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 flex flex-col items-start w-full">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Priority</Label>
          <Select value={data.priority || 'medium'} onValueChange={v => updateField('priority', v)}>
            <SelectTrigger className="h-8 text-[13px] hover:border-primary/50 transition-colors w-full"><SelectValue /></SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="high" className="text-xs py-1.5 text-red-500 font-bold">High</SelectItem>
              <SelectItem value="medium" className="text-xs py-1.5 font-bold">Medium</SelectItem>
              <SelectItem value="low" className="text-xs py-1.5 text-slate-400">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Recipients</Label>
        <div className="grid grid-cols-1 gap-4 p-4 border rounded-xl dark:bg-slate-900/50 dark:border-slate-800 w-full transition-all">
          <div className="space-y-3">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-2">Individual Users</p>
            <div className="grid grid-cols-2 gap-2">
              {USERS.map(u => (
                <label key={u.id} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer hover:text-primary transition-colors">
                  <input type="checkbox" className="rounded text-primary h-4 w-4 border-slate-300 dark:border-slate-700" checked={(data.userIds || []).includes(u.id)} onChange={e => {
                    const current = data.userIds || [];
                    const next = e.target.checked ? [...current, u.id] : current.filter((id: string) => id !== u.id);
                    updateField('userIds', next);
                  }} />
                  <span className="truncate">{u.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-3">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-2">Teams</p>
            <div className="grid grid-cols-2 gap-2">
              {TEAMS.map(t => (
                <label key={t.id} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer hover:text-primary transition-colors">
                  <input type="checkbox" className="rounded text-primary h-4 w-4 border-slate-300 dark:border-slate-700" checked={(data.teamIds || []).includes(t.id)} onChange={e => {
                    const current = data.teamIds || [];
                    const next = e.target.checked ? [...current, t.id] : current.filter((id: string) => id !== t.id);
                    updateField('teamIds', next);
                  }} />
                  <span className="truncate">{t.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Notification Message</Label>
        <Textarea className="h-24 text-[13px] bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl p-3 shadow-inner leading-relaxed" placeholder="Write the notification message here..." value={data.message || ''} onChange={e => updateField('message', e.target.value)} />
      </div>
    </div>
  );
};
