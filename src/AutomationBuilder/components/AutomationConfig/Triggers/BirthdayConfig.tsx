import { useEffect } from "react"
import { CalendarDaysIcon } from "@heroicons/react/24/outline"

export const BirthdayConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  useEffect(() => {
    if (!data.label) {
      onChange({ ...data, label: 'Birthday', subtitle: "Triggers on contact's birthday" });
    }
  }, []);

  return (
    <div className="p-4 border rounded-md bg-blue-50/50 dark:bg-blue-500/5 text-slate-600 dark:text-slate-400 text-sm space-y-2">
      <div className="flex gap-2">
        <CalendarDaysIcon className="w-5 h-5 text-blue-500 shrink-0" />
        <p>This automation will trigger based on the <strong>birthday field</strong> in the contact's profile.</p>
      </div>
      <p className="text-xs opacity-75">Ensure your contacts have valid birthdays to trigger this correctly.</p>
    </div>
  );
};
