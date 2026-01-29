import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import { JsonEditor } from "../../JsonEditor";
import { useFormBuilder } from "../../context";

export const JsonEditorPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { jsonContent, setJsonContent } = useFormBuilder();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isExpanded ? (
        // Expanded state - show full editor
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 w-[500px] max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <CodeBracketIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">JSON Editor</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Minimize"
            >
              <ChevronDownIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Editor Content */}
          <div className="flex-1 overflow-auto p-4">
            <JsonEditor value={jsonContent} onChange={setJsonContent} />
          </div>
        </div>
      ) : (
        // Collapsed state - show small button
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-primary hover:bg-primary-dark text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          title="Open JSON Editor"
        >
          <CodeBracketIcon className="w-5 h-5" />
          <ChevronUpIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
