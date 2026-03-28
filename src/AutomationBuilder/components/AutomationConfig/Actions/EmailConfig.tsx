import { Label } from "@/components/label"
import { Input } from "@/components/input"
import { RichText } from "@/components"

export const EmailConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const updateField = (key: string, val: any) => {
    const next = { ...data, [key]: val };

    // Update subtitle based on subject
    if (key === 'subject') {
      next.subtitle = val ? `Subject: ${val}` : 'Draft Email';
    }

    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 flex flex-col items-start w-full">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">From Name</Label>
          <Input
            className="h-8 text-[13px] dark:bg-slate-900/50 hover:border-primary transition-colors"
            value={data.fromName || ''}
            onChange={e => updateField('fromName', e.target.value)}
            placeholder="e.g. Sales Team"
          />
        </div>
        <div className="space-y-1.5 flex flex-col items-start w-full">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">From Email</Label>
          <Input
            className="h-8 text-[13px] dark:bg-slate-900/50 hover:border-primary transition-colors"
            value={data.fromEmail || ''}
            onChange={e => updateField('fromEmail', e.target.value)}
            placeholder="sales@company.com"
          />
        </div>
      </div>

      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Subject Line</Label>
        <Input
          className="h-8 text-[13px] dark:bg-slate-900/50 hover:border-primary transition-colors w-full"
          value={data.subject || ''}
          onChange={e => updateField('subject', e.target.value)}
          placeholder="Enter email subject..."
        />
      </div>

      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5 mb-1">Message Body</Label>
        <RichText
          content={data.message || ''}
          onChange={(html) => updateField('message', html)}
          className="w-full min-h-[220px]"
          placeholder="Craft your message here..."
        />
      </div>
    </div>
  );
};
