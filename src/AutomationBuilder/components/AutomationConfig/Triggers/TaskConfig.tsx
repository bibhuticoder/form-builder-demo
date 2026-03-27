
import { Label } from "@/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { Button } from "@/components/Button"
import { USERS } from "../helpers"
import { cn } from "@/lib/utils"

export const TaskConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const triggerType = data.triggerType || 'added';
  const taskTypeOptions = [
    { id: 'all', label: 'Any Type' },
    { id: 'call', label: 'Call' },
    { id: 'email', label: 'Email' },
    { id: 'todo', label: 'To-do' },
    { id: 'meeting', label: 'Meeting' },
  ];
  const priorityOptions = [
    { id: 'all', label: 'Any Priority' },
    { id: 'high', label: 'High' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' },
  ];

  const updateField = (key: string, val: any) => {
    const newData = { ...data, [key]: val };
    let sub = `Task ${triggerType === 'added' ? 'Added' : triggerType === 'updated' ? 'Updated' : 'Completed'}`;
    if (newData.taskType && newData.taskType !== 'all') sub += ` (${newData.taskType})`;
    onChange({ ...newData, subtitle: sub });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Trigger Condition</Label>
        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg w-full border border-slate-200 dark:border-slate-800">
          {['added', 'updated', 'completed'].map(t => (
            <Button
              key={t}
              variant={triggerType === t ? 'primary' : 'ghost'}
              size="sm"
              className={cn("flex-1 h-7 text-[11px] px-3.5 rounded-md capitalize", triggerType === t ? "shadow-sm" : "text-slate-500")}
              onClick={() => updateField('triggerType', t)}
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 flex flex-col items-start">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Task Type</Label>
          <Select value={data.taskType || 'all'} onValueChange={v => updateField('taskType', v)}>
            <SelectTrigger className="h-8 text-[13px] hover:border-primary/50 transition-colors w-full"><SelectValue placeholder={taskTypeOptions.find(o => o.id === (data.taskType || 'all'))?.label} /></SelectTrigger>
            <SelectContent className="w-full">{taskTypeOptions.map(o => <SelectItem key={o.id} value={o.id} className="text-xs py-1.5">{o.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 flex flex-col items-start">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Priority</Label>
          <Select value={data.priority || 'all'} onValueChange={v => updateField('priority', v)}>
            <SelectTrigger className="h-8 text-[13px] hover:border-primary/50 transition-colors w-full"><SelectValue placeholder={priorityOptions.find(o => o.id === (data.priority || 'all'))?.label} /></SelectTrigger>
            <SelectContent className="w-full">{priorityOptions.map(o => <SelectItem key={o.id} value={o.id} className="text-xs py-1.5">{o.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Assigned Users</Label>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 p-4 border rounded-lg dark:bg-slate-900/50 dark:border-slate-800 w-full">
          {USERS.map(u => (
            <label key={u.id} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer hover:text-primary transition-colors group">
              <input
                type="checkbox"
                className="rounded text-primary focus:ring-primary h-4 w-4 border-slate-300 dark:border-slate-700"
                checked={(data.assignedUsers || []).includes(u.id)}
                onChange={(e) => {
                  const current = data.assignedUsers || [];
                  const next = e.target.checked ? [...current, u.id] : current.filter((id: string) => id !== u.id);
                  updateField('assignedUsers', next);
                }}
              />
              <span className="truncate">{u.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
