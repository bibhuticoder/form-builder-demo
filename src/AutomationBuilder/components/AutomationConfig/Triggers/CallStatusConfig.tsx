import { useEffect } from "react"
import { Label } from "@/components/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Combobox } from "@/components"

const CALL_STATUSES = [
  { id: 'any_status', label: 'Any status' },
  { id: 'completed', label: 'Call Completed' },
  { id: 'missed', label: 'No Answer' },
  { id: 'voicemail', label: 'Voicemail' },
  { id: 'busy', label: 'Busy' },
  { id: 'failed', label: 'Failed' },
];

const DIRECTIONS = [
  { id: 'all', label: 'Any Direction' },
  { id: 'inbound', label: 'Incoming' },
  { id: 'outbound', label: 'Outgoing' },
];

export const CallStatusConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  useEffect(() => {
    // Initialize with "any_status" if nothing is set
    if (!data.statuses) {
      if (data.status && data.status !== 'all') {
        const initialStatus = data.status === 'any' ? 'any_status' : data.status;
        onChange({ ...data, statuses: [initialStatus], direction: data.direction || 'all', subtitle: 'Call Status' });
      } else {
        onChange({ ...data, statuses: ['any_status'], direction: 'all', subtitle: 'Any Status' });
      }
    }
  }, []);

  const handleStatusChange = (val: (string | number)[]) => {
    let nextStatuses = val as string[];
    const currentStatuses = data.statuses || [];

    const hadAll = currentStatuses.includes('any_status');
    const hasAll = nextStatuses.includes('any_status');

    // Logic: If 'any_status' was newly added, clear others.
    // If others are added while 'any_status' was there, remove 'any_status'.
    if (hasAll && !hadAll) {
      nextStatuses = ['any_status'];
    } else if (hasAll && nextStatuses.length > 1) {
      nextStatuses = nextStatuses.filter(id => id !== 'any_status');
    }

    const directionLabel = DIRECTIONS.find(d => d.id === (data.direction || 'all'))?.label;
    const selectedCount = nextStatuses.length;
    
    let statusText = '';
    if (nextStatuses.includes('any_status')) {
      statusText = 'Any Status';
    } else if (selectedCount === 0) {
      statusText = 'No Status';
    } else if (selectedCount === 1) {
      statusText = CALL_STATUSES.find(s => s.id === nextStatuses[0])?.label || 'Call';
    } else {
      statusText = `${selectedCount} Statuses`;
    }

    const sub = (data.direction && data.direction !== 'all') 
      ? `${directionLabel} ${statusText}` 
      : statusText;

    onChange({ ...data, statuses: nextStatuses, subtitle: sub });
  };

  const handleDirectionChange = (val: string) => {
    const nextStatuses = data.statuses || [];
    const directionLabel = DIRECTIONS.find(d => d.id === val)?.label;
    const selectedCount = nextStatuses.length;
    
    let statusText = '';
    if (nextStatuses.includes('any_status')) statusText = 'Any Status';
    else if (selectedCount === 0) statusText = 'No Status';
    else if (selectedCount === 1) statusText = CALL_STATUSES.find(s => s.id === nextStatuses[0])?.label || 'Call';
    else statusText = `${selectedCount} Statuses`;

    const sub = (val !== 'all') ? `${directionLabel} ${statusText}` : statusText;
    onChange({ ...data, direction: val, subtitle: sub });
  };

  const currentStatuses = data.statuses || [];
  const currentDirection = data.direction || 'all';

  const statusTextDescription = currentStatuses.includes('any_status')
    ? 'any status'
    : (currentStatuses.length > 0 
        ? currentStatuses.map((s: string) => CALL_STATUSES.find(cs => cs.id === s)?.label).join(', ') 
        : 'no status (please select)');

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Call Status</Label>
        <Combobox
          multiple={true}
          options={CALL_STATUSES}
          value={currentStatuses}
          onValueChange={handleStatusChange}
          placeholder="Select call statuses..."
          className="w-full"
        />
      </div>

      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Call Direction</Label>
        <Select value={currentDirection} onValueChange={handleDirectionChange}>
          <SelectTrigger className="h-8 text-[13px] hover:border-primary/50 transition-colors w-full">
            <SelectValue placeholder={DIRECTIONS.find(d => d.id === currentDirection)?.label} />
          </SelectTrigger>
          <SelectContent className="w-full">
            {DIRECTIONS.map(d => (
              <SelectItem key={d.id} value={d.id} className="text-xs py-1.5">{d.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl">
        <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          Trigger automation when a call results in <span className="text-primary font-bold">"{statusTextDescription}"</span>
          {currentDirection !== 'all' && (
            <span> in <span className="text-primary font-bold">{DIRECTIONS.find(d => d.id === currentDirection)?.label}</span> direction</span>
          )}.
        </p>
      </div>
    </div>
  );
};
