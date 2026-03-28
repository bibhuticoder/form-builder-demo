import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Input } from "@/components"
import { MOCK_TAGS } from "../helpers"
import { cn } from "@/lib/utils"

export const TagConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const type = data.type || 'add';

  const updateField = (key: string, val: any) => {
    const next = { ...data, [key]: val };
    
    const ops = next.type || 'add';
    if (ops === 'add') {
      next.subtitle = next.tagName ? `Add Tag: ${next.tagName}` : 'Add Tag';
    } else {
      const tagLabel = MOCK_TAGS.find(t => t.id === next.tagId)?.label;
      next.subtitle = tagLabel ? `Remove Tag: ${tagLabel}` : 'Remove Tag';
    }

    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Operation Type</Label>
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg w-full border border-slate-200 dark:border-slate-800 shadow-sm">
          {[
            { id: 'add', label: 'Add Tag' },
            { id: 'remove', label: 'Remove Tag' }
          ].map(t => (
            <button
              key={t.id}
              className={cn(
                "flex-1 h-7 text-[12px] px-1 rounded-md capitalize font-medium transition-all outline-none",
                type === t.id
                  ? "bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-700/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50 dark:hover:bg-slate-800/50"
              )}
              onClick={() => updateField('type', t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Tag Name</Label>
        {type === 'add' ? (
          <Input 
            className="h-8 text-[13px] dark:bg-slate-900/50 hover:border-primary transition-colors w-full rounded-lg"
            value={data.tagName || ''}
            onChange={(e: any) => updateField('tagName', e.target.value)}
            placeholder="Enter tag name..."
          />
        ) : (
          <Select value={data.tagId} onValueChange={(val) => updateField('tagId', val)}>
            <SelectTrigger className="h-8 text-[13px] dark:bg-slate-900/50 hover:border-primary transition-colors w-full rounded-lg">
              <SelectValue placeholder="Select a tag..." />
            </SelectTrigger>
            <SelectContent>
              {MOCK_TAGS.map(t => (
                <SelectItem key={t.id} value={t.id} className="text-xs group">
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};
