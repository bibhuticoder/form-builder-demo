import React from "react"
import { Button } from "../../../../components"
import { EyeIcon, CodeBracketIcon } from "@heroicons/react/24/outline"
import { useFormBuilder } from "../../context"

export const TopBar: React.FC = () => {
  const { jsonContent, updateFormName, saveForm, publishForm, previewForm } = useFormBuilder();
  const formName = jsonContent?.formSettings?.name || "Untitled Form";

  return (
    <header className="p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 shadow-sm z-10 shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <input value={formName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormName(e.target.value)} className="border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-primary dark:focus:border-primary focus:outline-none font-semibold w-[200px] px-2 h-8 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md transition-colors" placeholder="Form Name" />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={saveForm} className="flex items-center gap-2">
          <CodeBracketIcon className="w-4 h-4" />
          Embed
        </Button>

        <Button variant="secondary" onClick={previewForm} className="flex items-center gap-2">
          <EyeIcon className="w-4 h-4" />
          Preview
        </Button>

        <Button variant="primary" onClick={publishForm}>
          Publish
        </Button>
      </div>
    </header>
  )
}
