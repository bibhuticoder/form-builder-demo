import React from "react";
import { Button } from "@/components";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useEmailBuilder } from "../../context";

export const TopBar: React.FC = () => {
  const { jsonContent, updateTemplateName } = useEmailBuilder();
  const templateName = jsonContent?.templateSettings?.name || "Untitled Email";

  const handlePreview = () => {
    alert("Preview feature is coming soon");
  };

  return (
    <div className="sticky top-0 z-20">
      <header className="p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-3 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-2">
          <input
            value={templateName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateTemplateName(e.target.value)}
            className="shadow border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:border-primary dark:focus:border-primary focus:outline-none font-semibold w-[200px] px-2 h-7 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md transition-colors"
            placeholder="Email Name"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handlePreview} className="flex items-center gap-2 text-xs">
            <EyeIcon className="w-4 h-4" />
            Preview
          </Button>

          <Button variant="primary" onClick={() => alert("Send feature coming soon")} className="flex items-center gap-2 text-xs">
            Send
          </Button>
        </div>
      </header>
    </div>
  );
};
