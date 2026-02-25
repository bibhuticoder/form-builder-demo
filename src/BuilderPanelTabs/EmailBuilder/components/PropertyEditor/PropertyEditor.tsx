import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../../components";
import { useEmailBuilder } from "../../context";
import { ContentTab } from "./tabs/ContentTab/index";
import { StyleTab } from "./tabs/StyleTab/index";

interface PropertyEditorProps {
  selectedBlockId: string;
  onBack: () => void;
}

export const PropertyEditor: React.FC<PropertyEditorProps> = ({ selectedBlockId, onBack }) => {
  const { jsonContent } = useEmailBuilder();
  const [activeTab, setActiveTab] = React.useState("content");

  const selectedBlock = jsonContent.blocks.find((b) => b.id === selectedBlockId);

  if (!selectedBlock) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-gray-500 dark:text-gray-400">
        <p className="text-sm">Block not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Button variant="transparent" onClick={onBack} className="gap-2 text-xs">
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </Button>
        <span className="font-semibold text-gray-900 dark:text-white text-xs">Edit Block</span>
      </div>

      <div className="px-2 pt-2 border-b border-gray-200 dark:border-gray-700">
        <div className="w-full grid grid-cols-2 mb-2 bg-gray-100 dark:bg-gray-900 p-1 border border-gray-200 dark:border-gray-700 rounded-md">
          <button
            onClick={() => setActiveTab("content")}
            className={`text-xs py-2 px-3 rounded transition-colors ${activeTab === "content"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab("style")}
            className={`text-xs py-2 px-3 rounded transition-colors ${activeTab === "style"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            Style
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        <div className="p-2 space-y-3">
          {activeTab === "content" && <ContentTab block={selectedBlock} />}
          {activeTab === "style" && <StyleTab block={selectedBlock} />}
        </div>
      </div>
    </div>
  );
};
