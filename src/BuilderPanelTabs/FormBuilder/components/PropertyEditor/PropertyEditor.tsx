import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../../components";
import { useFormBuilder } from "../../context";
import { ContentTab } from "./tabs/ContentTab";
import { StyleTab } from "./tabs/StyleTab";
import { LogicTab } from "./tabs/LogicTab";

interface PropertyEditorProps {
  selectedFieldId: string;
  onBack: () => void;
}

export const PropertyEditor: React.FC<PropertyEditorProps> = ({ selectedFieldId, onBack }) => {
  const { jsonContent } = useFormBuilder();
  const [activeTab, setActiveTab] = React.useState("content");

  const selectedField = jsonContent.fields.find((f) => f.id === selectedFieldId);

  if (!selectedField) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-gray-500 dark:text-gray-400">
        <p className="text-sm">Field not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-2 flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Button variant="transparent" onClick={onBack} className="gap-2 text-xs">
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </Button>
        <span className="font-semibold text-gray-900 dark:text-white text-xs">Edit Field</span>
      </div>

      {/* Tabs */}
      <div className="px-2 pt-2 border-b border-gray-200 dark:border-gray-700">
        <div className="w-full grid grid-cols-3 mb-2 bg-gray-100 dark:bg-gray-900 p-1 border border-gray-200 dark:border-gray-700 rounded-md">
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
          <button
            onClick={() => setActiveTab("logic")}
            className={`text-xs py-2 px-3 rounded transition-colors ${activeTab === "logic"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            Logic
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pb-8">
        <div className="p-2 space-y-3">
          {activeTab === "content" && <ContentTab field={selectedField} />}
          {activeTab === "style" && <StyleTab field={selectedField} />}
          {activeTab === "logic" && <LogicTab field={selectedField} />}
        </div>
      </div>
    </div>
  );
};
