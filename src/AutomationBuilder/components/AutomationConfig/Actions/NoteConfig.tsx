import { Label, RichText } from "@/components"

export const NoteConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const updateField = (key: string, val: any) => {
    const next = { ...data, [key]: val };
    
    if (key === 'content') {
      const plainText = val ? val.replace(/<[^>]*>/g, '').substring(0, 30) : '';
      next.subtitle = plainText ? `Note: ${plainText}...` : 'Add Note to Contact';
    }

    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5 mb-1">Note Content</Label>
        <RichText
          content={data.content || ''}
          onChange={(html) => updateField('content', html)}
          className="w-full min-h-[150px]"
          placeholder="Enter note details..."
        />
      </div>
    </div>
  );
};
