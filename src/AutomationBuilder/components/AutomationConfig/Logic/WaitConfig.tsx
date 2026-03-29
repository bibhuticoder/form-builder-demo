import { useEffect } from "react"
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Input, Checkbox } from "@/components"
import { cn } from "@/lib/utils"
import { ClockIcon, SparklesIcon, InformationCircleIcon } from "@heroicons/react/24/outline"

const WAIT_EVENTS = [
  { id: 'email_opened', label: 'Email Opened' },
  { id: 'email_replied', label: 'Email Replied' },
  { id: 'link_clicked', label: 'Link Clicked' },
  { id: 'form_submitted', label: 'Form Submitted' },
  { id: 'sms_replied', label: 'SMS Replied' },
  { id: 'appointment_booked', label: 'Appointment Booked' },
  { id: 'tag_added', label: 'Tag Added' },
  { id: 'field_updated', label: 'Field Updated' },
];

const DAYS = [
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
  { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thu' },
  { id: 'fri', label: 'Fri' },
  { id: 'sat', label: 'Sat' },
  { id: 'sun', label: 'Sun' },
];

export const WaitConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  const mode = data.mode || 'time';

  useEffect(() => {
    if (!data.mode) {
      onChange({
        ...data,
        mode: 'time',
        durationVal: 1,
        durationUnit: 'hours',
        subtitle: 'Wait 1 hours'
      });
    }
  }, []);

  const updateData = (updates: any) => {
    const newData = { ...data, ...updates };

    // Generate subtitle
    let sub = '';
    if (newData.mode === 'time') {
      sub = `Wait ${newData.durationVal || 1} ${newData.durationUnit || 'hours'}`;
      if (newData.resumeWindow) sub += ' (Window)';
    } else {
      const eventLabel = WAIT_EVENTS.find(e => e.id === newData.waitEvent)?.label || 'Event';
      sub = `Wait for ${eventLabel}`;
    }

    onChange({ ...newData, subtitle: sub });
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-lg w-full border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          className={cn(
            "flex-1 h-8 flex items-center justify-center gap-2 text-[12px] px-2 rounded-md font-bold transition-all outline-none",
            mode === 'time'
              ? "bg-white dark:bg-slate-800 text-primary shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          )}
          onClick={() => updateData({ mode: 'time' })}
        >
          <ClockIcon className="w-3.5 h-3.5" />
          Time Delay
        </button>
        <button
          className={cn(
            "flex-1 h-8 flex items-center justify-center gap-2 text-[12px] px-2 rounded-md font-bold transition-all outline-none",
            mode === 'condition'
              ? "bg-white dark:bg-slate-800 text-primary shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          )}
          onClick={() => updateData({ mode: 'condition' })}
        >
          <SparklesIcon className="w-3.5 h-3.5" />
          Wait for Event
        </button>
      </div>

      {mode === 'time' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-2">
            <Label className="text-[12px] font-bold text-slate-700 dark:text-slate-200">Wait Duration</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                className="w-24 h-9 text-[13px] dark:bg-slate-900/50"
                value={data.durationVal || ''}
                onChange={(e) => updateData({ durationVal: e.target.value })}
              />
              <Select
                value={data.durationUnit || 'hours'}
                onValueChange={(val) => updateData({ durationUnit: val })}
              >
                <SelectTrigger className="flex-1 h-9 text-[13px] dark:bg-slate-900/50">
                  <SelectValue placeholder="Select unit">
                    {['minutes', 'hours', 'days', 'weeks', 'months'].find(u => u === (data.durationUnit || 'hours'))}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <Label className="text-[12px] font-bold text-slate-700 dark:text-slate-200">Resume Window</Label>
                <p className="text-[10px] text-slate-400 font-medium lowercase tracking-tight">Only resume on specific days/times</p>
              </div>
              <Checkbox
                checked={data.resumeWindow || false}
                onCheckedChange={(c) => updateData({ resumeWindow: !!c })}
              />
            </div>

            {data.resumeWindow && (
              <div className="space-y-4 pl-4 border-l-2 border-primary/20 animate-in fade-in slide-in-from-left-2">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Allowed Days</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {DAYS.map(day => {
                      const selected = (data.resumeDays || []).includes(day.id);
                      return (
                        <button
                          key={day.id}
                          onClick={() => {
                            const current = data.resumeDays || [];
                            const newDays = selected
                              ? current.filter((d: string) => d !== day.id)
                              : [...current, day.id];
                            updateData({ resumeDays: newDays });
                          }}
                          className={cn(
                            "px-2.5 py-1.5 text-[10px] font-bold rounded-md border transition-all select-none flex-1 min-w-[50px] text-center",
                            selected
                              ? "bg-primary border-primary text-white shadow-sm"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary/50"
                          )}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Start Time</Label>
                    <Input
                      type="time"
                      className="h-9 text-[13px] dark:bg-slate-900/50"
                      value={data.resumeStartTime || "09:00"}
                      onChange={(e) => updateData({ resumeStartTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">End Time</Label>
                    <Input
                      type="time"
                      className="h-9 text-[13px] dark:bg-slate-900/50"
                      value={data.resumeEndTime || "17:00"}
                      onChange={(e) => updateData({ resumeEndTime: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-5 animate-in fade-in slide-in-from-top-2">
          <div className="p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/10 flex gap-3">
            <InformationCircleIcon className="w-5 h-5 text-primary shrink-0" />
            <p className="text-[11px] text-primary/80 leading-relaxed font-medium">
              The automation will pause here until the selected event occurs for the contact.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-[12px] font-bold text-slate-700 dark:text-slate-200">Wait For Event</Label>
            <Select
              value={data.waitEvent}
              onValueChange={(val) => updateData({ waitEvent: val })}
            >
              <SelectTrigger className="h-10 dark:bg-slate-900/50">
                <SelectValue placeholder="Select event...">
                  {WAIT_EVENTS.find(e => e.id === data.waitEvent)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {WAIT_EVENTS.map(e => (
                  <SelectItem key={e.id} value={e.id}>{e.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {data.waitEvent && (
            <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-1">
              <p className="text-[10px] text-slate-400 font-medium">
                {data.waitEvent.includes('email') ? 'Applies to the most recent email sent in this automation.' :
                  data.waitEvent.includes('sms') ? 'Applies to the most recent SMS sent in this automation.' :
                    'Awaits the first occurrence of this event before proceeding.'}
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-[12px] font-bold text-slate-700 dark:text-slate-200">Timeout (Optional)</Label>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                className="w-24 h-9 text-[13px] dark:bg-slate-900/50"
                placeholder="None"
                value={data.timeoutVal || ''}
                onChange={(e) => updateData({ timeoutVal: e.target.value })}
              />
              <Select
                value={data.timeoutUnit || 'days'}
                onValueChange={(val) => updateData({ timeoutUnit: val })}
              >
                <SelectTrigger className="flex-1 h-9 text-[13px] dark:bg-slate-900/50">
                  <SelectValue placeholder="Select unit">
                    {['minutes', 'hours', 'days'].find(u => u === (data.timeoutUnit || 'days'))}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-tight">If event doesn't happen within this time, continue anyway.</p>
          </div>
        </div>
      )}
    </div>
  );
};
