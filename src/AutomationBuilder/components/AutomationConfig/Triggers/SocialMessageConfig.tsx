import { Label } from "@/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { INSTAGRAM_ACCOUNTS } from "../helpers"

export const SocialMessageConfig = ({ data, onChange, type }: { data: any, onChange: (d: any) => void, type: 'dm' | 'comment' }) => {
  const updateField = (key: string, val: any) => {
    const next = { ...data, [key]: val };
    const account = INSTAGRAM_ACCOUNTS.find(a => a.id === next.accountId)?.handle || 'Account';
    next.subtitle = `${type === 'dm' ? 'DM' : 'Comment'} from ${account}`;
    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Instagram Account</Label>
        <Select value={data.accountId} onValueChange={v => updateField('accountId', v)}>
          <SelectTrigger className="h-8 text-[13px] dark:bg-slate-900/50 hover:border-primary/50 transition-colors w-full"><SelectValue placeholder="Select Account..." /></SelectTrigger>
          <SelectContent className="w-full text-xs">
            {INSTAGRAM_ACCOUNTS.map(a => <SelectItem key={a.id} value={a.id} className="py-1.5"><div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[1px]"><div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-[10px] font-bold">@</div></div>{a.handle}</div></SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4 pt-4 border-t dark:border-slate-800">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Conditional Keywords</Label>
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-xl space-y-3">
          <div className="flex flex-wrap gap-2">
            {(data.keywords || ['order', 'price', 'help']).map((k: string) => <span key={k} className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[10px] font-bold uppercase tracking-tight ring-1 ring-primary/20">{k}</span>)}
          </div>
          <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">Triggers when the {type === 'dm' ? 'message' : 'comment'} contains any of these keywords.</p>
        </div>
      </div>
    </div>
  );
};
