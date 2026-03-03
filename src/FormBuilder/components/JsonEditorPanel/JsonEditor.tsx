import React from "react"
import { type FormDefinition } from "../../foundation"


export interface JsonEditorProps {
  value: FormDefinition
  onChange: (value: FormDefinition) => void
  onSave?: () => void
}

export const JsonEditor: React.FC<JsonEditorProps> = ({ value }) => {
  return (
    <div className="flex flex-col h-fit">

      {/* Editor Textarea */}
      <div className="flex-1 relative overflow-auto" style={{ maxHeight: "600px" }}>
        <textarea
          value={JSON.stringify(value, null, 2)}
          readOnly
          className="shadow w-full h-full min-h-[400px] p-4 font-mono text-xs text-slate-900 dark:text-gray-900 bg-neutral-50 dark:bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary resize-none border-none dark:border-gray-300"
          placeholder="JSON content..."
          rows={30}
          spellCheck={false}
        />
      </div>
    </div>
  )
}
