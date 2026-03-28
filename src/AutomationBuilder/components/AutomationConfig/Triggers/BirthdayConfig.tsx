import { useEffect } from "react"

export const BirthdayConfig = ({ data, onChange }: { data: any, onChange: (d: any) => void }) => {
  useEffect(() => {
    if (!data.label) {
      onChange({ ...data, label: 'Birthday', subtitle: "Triggers on contact's birthday" });
    }
  }, []);

  return (
    <div className="p-4 border rounded-md bg-blue-50/50 dark:bg-blue-500/5 text-slate-600 dark:text-slate-400 text-sm space-y-2">
      <p className="inline">
        This automation will trigger based on a contact's listed <strong>birthday</strong>.
      </p>
      <p className="text-xs opacity-75">
        If a contact doesn't have a birthday listed, they won't trigger this automation.
      </p>
    </div>
  );
};
