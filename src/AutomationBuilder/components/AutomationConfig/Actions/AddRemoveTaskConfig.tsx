import { Label, Input, RichText, Combobox, type ComboboxOption } from "@/components"
import { cn } from "@/lib/utils"

const MOCK_TASKS: ComboboxOption[] = [
  { id: 't1', label: 'Follow up on proposal' },
  { id: 't2', label: 'Schedule demo call' },
  { id: 't3', label: 'Send onboarding hardware' },
  { id: 't4', label: 'Review contract terms' },
  { id: 't5', label: 'Initial discovery call' },
  { id: 't6', label: 'Send pricing guide' },
];

export const AddRemoveTaskConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const operation = data.operation || 'add';

  const updateField = (key: string, val: any) => {
    const next = { ...data, [key]: val };

    // Update subtitle based on operation and selection
    const ops = next.operation || 'add';
    if (ops === 'add') {
      next.subtitle = next.title ? `Add Task: ${next.title}` : 'Add New Task';
    } else {
      const taskLabel = MOCK_TASKS.find(t => t.id === next.taskId)?.label;
      next.subtitle = taskLabel ? `Remove Task: ${taskLabel}` : 'Remove Task';
    }

    onChange(next);
  };

  return (
    <div className="space-y-6">

      {/* Operation Selector */}
      <div className="space-y-3">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Operation</Label>
        <div className="flex gap-2 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg w-full border border-slate-200 dark:border-slate-800 shadow-sm">
          {[
            { id: 'add', label: 'Add Task' },
            { id: 'remove', label: 'Remove Task' }
          ].map(op => (
            <button
              key={op.id}
              className={cn(
                "flex-1 h-7 text-[12px] px-1 rounded-md capitalize font-medium transition-all outline-none",
                operation === op.id
                  ? "bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-700/50"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50 dark:hover:bg-slate-800/50"
              )}
              onClick={() => updateField('operation', op.id)}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {operation === 'add' ? (
        <div className="space-y-5 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="space-y-1.5 flex flex-col items-start w-full">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Task Title</Label>
            <Input
              className="h-8 text-[13px] dark:bg-slate-900/50 hover:border-primary transition-colors w-full"
              value={data.title || ''}
              onChange={e => updateField('title', e.target.value)}
              placeholder="e.g. Follow up on proposal"
            />
          </div>

          <div className="space-y-1.5 flex flex-col items-start w-full">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5 mb-1">Description</Label>
            <RichText
              content={data.description || ''}
              onChange={(html) => updateField('description', html)}
              className="w-full min-h-[150px]"
              placeholder="Enter task details..."
            />
          </div>
        </div>
      ) : (
        <div className="space-y-5 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="space-y-1.5 flex flex-col items-start w-full">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Select Task to Remove</Label>
            <Combobox
              options={MOCK_TASKS}
              value={data.taskId}
              onValueChange={(val) => updateField('taskId', val)}
              placeholder="Search for a task..."
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <p className="text-[12px] font-medium text-red-800 dark:text-red-300 leading-tight">Remove Specific Task</p>
              <p className="text-[10px] text-red-600/70 dark:text-red-400/70 leading-tight">This specific task will be removed from the contact's task list.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
