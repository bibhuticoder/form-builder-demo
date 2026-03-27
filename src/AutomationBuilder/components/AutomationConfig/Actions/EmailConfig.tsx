import { Button } from "@/components/Button"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline"

export const EmailConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const updateField = (key: string, val: any) => {
    const next = { ...data, [key]: val };
    next.subtitle = `Subject: ${next.subject || '(Untitled)'}`;
    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Template</Label>
        <Select value={data.template} onValueChange={v => updateField('template', v)}>
          <SelectTrigger className="h-8 text-[13px] dark:bg-slate-900/50 hover:border-primary/50 transition-colors w-full"><SelectValue placeholder="Select Template..." /></SelectTrigger>
          <SelectContent className="w-full text-xs">
            <SelectItem value="welcome" className="py-1.5 font-medium">Welcome Sequence</SelectItem>
            <SelectItem value="follow_up" className="py-1.5 font-medium">Follow-Up (Standard)</SelectItem>
            <SelectItem value="onboarding" className="py-1.5 font-medium">Customer Onboarding</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Subject Line</Label>
        <Input placeholder="Enter email subject..." className="h-8 text-[13px] dark:bg-slate-900/50 w-full" value={data.subject || ''} onChange={e => updateField('subject', e.target.value)} />
      </div>

      <div className="space-y-4 pt-4 border-t dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-[12px] font-bold text-slate-700 dark:text-slate-200 leading-none">Attachments</Label>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight">Max 10MB total</p>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs font-bold text-primary hover:text-primary hover:bg-primary/5 rounded-lg border border-primary/20"><PlusIcon className="w-3 h-3 mr-1" /> Add File</Button>
        </div>
        {data.files?.map((f: any, i: number) => (
          <div key={i} className="flex items-center gap-3 p-2 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg border dark:border-slate-800">
            <span className="text-xs font-bold flex-1 truncate">{f.name}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => {}}><TrashIcon className="w-3.5 h-3.5" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
};
