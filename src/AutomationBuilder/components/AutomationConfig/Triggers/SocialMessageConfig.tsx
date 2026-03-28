import { Label } from "@/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { Input } from "@/components/input"
import { FacebookIcon, InstagramIcon, TikTokIcon } from "../helpers"
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline"

export const SocialMessageConfig = ({ data, onChange, type }: { data: any, onChange: (d: any) => void, type: 'dm' | 'comment' }) => {
  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: InstagramIcon },
    { id: 'facebook', name: 'Facebook', icon: FacebookIcon },
    { id: 'tiktok', name: 'TikTok', icon: TikTokIcon },
    { id: 'cleave', name: 'Cleave', icon: ChatBubbleLeftRightIcon },
  ];

  const updateField = (key: string, val: any) => {
    const next = { ...data, [key]: val };

    // Subtitle generation
    const p = platforms.find(pl => pl.id === next.platform);
    const platformName = p?.name || 'Social';
    let sub = `${platformName} ${type === 'dm' ? 'DM' : 'Comment'}`;
    if (next.keyword) {
      sub += ` ("${next.keyword}")`;
    }

    next.subtitle = sub;
    next.label = `${platformName} ${type === 'dm' ? 'Message' : 'Comment'}`;
    onChange(next);
  };

  const platformId = data.platform || 'instagram';

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Platform</Label>
        <Select value={platformId} onValueChange={v => updateField('platform', v)}>
          <SelectTrigger className="h-8 text-[13px] dark:bg-slate-900/50 hover:border-primary/50 transition-colors w-full">
            <SelectValue placeholder={platforms.find(p => p.id === platformId)?.name || "Select platform"} />
          </SelectTrigger>
          <SelectContent className="w-full text-xs">
            {platforms.map(p => (
              <SelectItem key={p.id} value={p.id} className="py-2">
                <div className="flex items-center gap-2">
                  <p.icon className="w-4 h-4 text-slate-500" />
                  {p.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Contains Phrase (Optional)</Label>
        <Input
          className="h-8 text-[13px] dark:bg-slate-900/50 hover:border-primary/50 transition-colors w-full"
          value={data.keyword || ''}
          onChange={e => updateField('keyword', e.target.value)}
          placeholder='e.g. "info", "price", "help"'
        />
        <p className="text-[10px] text-slate-400 pl-0.5 italic text-[9px]">Leave blank to trigger on all incoming {type === 'dm' ? 'messages' : 'comments'}.</p>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl">
        <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          Trigger automation when you receive a <span className="text-primary font-bold">{type === 'dm' ? 'direct message' : 'comment'}</span> on
          <span className="text-slate-900 dark:text-slate-100 font-bold mx-1">
            {platforms.find(p => p.id === platformId)?.name}
          </span>
          {data.keyword ? (
            <>containing <span className="text-primary font-bold">"{data.keyword}"</span></>
          ) : (
            <span className="italic opacity-60 ml-0.5">(on any message)</span>
          )}.
        </p>
      </div>
    </div>
  );
};
