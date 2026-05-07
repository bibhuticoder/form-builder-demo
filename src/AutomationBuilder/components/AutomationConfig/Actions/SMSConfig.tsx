import { Label, RichText } from "@/components"

export const SMSConfig = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => {
  const updateField = (key: string, val: any) => {
    const next = { ...data, [key]: val }

    if (key === "message") {
      const plainText = val ? val.replace(/<[^>]*>/g, "").substring(0, 30) : ""
      next.subtitle = plainText ? `SMS: ${plainText}...` : "Draft SMS"
    }

    onChange(next)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 flex flex-col items-start w-full">
        <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5 mb-1">SMS Message</Label>
        <RichText content={data.message || ""} onChange={(html) => updateField("message", html)} className="w-full min-h-[150px]" placeholder="Type your SMS message..." />
      </div>
    </div>
  )
}
