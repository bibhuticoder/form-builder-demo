import React from "react"

export interface JsonViewerProps {
  value: unknown
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ value }) => {
  return (
    <div className="flex flex-col h-fit">
      <div className="flex-1 relative overflow-auto" style={{ maxHeight: "600px" }}>
        <textarea value={JSON.stringify(value, null, 2)} readOnly className="shadow w-full h-full min-h-[400px] p-4 font-mono text-xs text-slate-900 dark:text-slate-100 bg-neutral-50 dark:bg-slate-950 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary resize-none border border-slate-200 dark:border-slate-700" placeholder="JSON content..." rows={30} spellCheck={false} />
      </div>
    </div>
  )
}
