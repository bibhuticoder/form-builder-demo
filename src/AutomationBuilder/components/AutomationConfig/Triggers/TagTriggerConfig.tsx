import { Label } from "@/components/label"
import { Button } from "@/components/Button"
import { MOCK_TAGS } from "../helpers"
import { cn } from "@/lib/utils"
import { Combobox } from "@/components/Combobox"

export const TagTriggerConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const triggerType = data.triggerType || 'added';
  const tagId = data.tagId || (data.tags && data.tags[0]?.id) || ''; // Fallback for data migration
  const currentTag = MOCK_TAGS.find(t => t.id === tagId);

  const updateTag = (id: string | number) => {
    const tag = MOCK_TAGS.find(t => t.id === id);
    if (!tag) return;
    
    onChange({ 
      ...data, 
      tagId: tag.id, 
      tagName: tag.label,
      tags: [tag], // Maintaining internal array for legacy compatibility
      subtitle: `Tag: ${tag.label}`,
      label: triggerType === 'added' ? 'Tag Added' : 'Tag Removed'
    });
  };

  const updateType = (type: 'added' | 'removed') => {
    const label = type === 'added' ? 'Tag Added' : 'Tag Removed';
    onChange({ ...data, triggerType: type, label });
  };

  const actionText = triggerType === 'added' ? 'added to' : 'removed from';

  return (
    <div className="space-y-6">
      {/* Trigger Type Toggle */}
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Action</Label>
        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg w-full border border-slate-200 dark:border-slate-800">
          <Button
            variant={triggerType === 'added' ? 'primary' : 'ghost'}
            size="sm"
            className={cn("flex-1 h-7 px-3.5 rounded-md text-[12px]", triggerType === 'added' ? "shadow-sm" : "text-slate-500")}
            onClick={() => updateType('added')}
          >
            Added
          </Button>
          <Button
            variant={triggerType === 'removed' ? 'primary' : 'ghost'}
            size="sm"
            className={cn("flex-1 h-7 px-3.5 rounded-md text-[12px]", triggerType === 'removed' ? "shadow-sm" : "text-slate-500")}
            onClick={() => updateType('removed')}
          >
            Removed
          </Button>
        </div>
      </div>

      {/* Tag Selector */}
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Select Tag</Label>
        <Combobox 
          options={MOCK_TAGS} 
          value={tagId}
          onValueChange={(val) => updateTag(val)}
          placeholder="Search and select a tag..."
          className="w-full"
        />
      </div>

      {/* Info Box */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl">
        <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
          Trigger automation when the tag <span className={cn("font-bold text-slate-900 dark:text-slate-100", currentTag ? "text-primary" : "text-slate-400")}>{currentTag ? `"${currentTag.label}"` : '.........'}</span> is {actionText} a contact.
        </p>
      </div>
    </div>
  );
};
