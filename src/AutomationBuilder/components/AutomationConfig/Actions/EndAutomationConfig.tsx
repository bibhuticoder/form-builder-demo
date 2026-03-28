import { Label } from "@/components"

export const EndAutomationConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  // End automation usually doesn't need data, but we can set a flag and subtitle
  if (!data.subtitle) {
    onChange({ ...data, subtitle: 'Automation ends here' });
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl space-y-2">
        <Label className="text-[12px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest pl-0.5">End Automation</Label>
        <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
          This action will immediately terminate the automation workflow for the contact that reaches this step. No further actions will be executed.
        </p>
      </div>
      
      <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
          </svg>
        </div>
        <p className="text-[11px] text-slate-400">Stop flow for this contact</p>
      </div>
    </div>
  );
};
