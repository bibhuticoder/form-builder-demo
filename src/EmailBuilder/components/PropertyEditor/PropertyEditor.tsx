import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components";
import { useEmailBuilder } from "../../context";
import { ContentTab } from "./tabs/ContentTab/index";
import { StyleTab } from "./tabs/StyleTab/index";

import { findBlockById } from "../../utils/blockUtils";

interface PropertyEditorProps {
  selectedBlockId: string;
  onBack: () => void;
}

export const PropertyEditor: React.FC<PropertyEditorProps> = ({ selectedBlockId, onBack }) => {
  const { jsonContent } = useEmailBuilder();

  const selectedBlock = findBlockById(jsonContent.blocks, selectedBlockId);

  if (!selectedBlock) {
    return (
      <div className="flex items-center justify-center h-full p-4 text-gray-500 dark:text-gray-400">
        <p className="text-xs">Block not found</p>
      </div>
    );
  }

  const formatBlockType = (type: string) => {
    if (type === "html") return "HTML";
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Button variant="transparent" onClick={onBack} className="gap-2 text-xs">
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </Button>
        <span className="font-semibold text-gray-900 dark:text-white text-xs">
          {formatBlockType(selectedBlock.type)}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        <div className="p-2 space-y-3">
          <ContentTab block={selectedBlock} />
          <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
          <StyleTab block={selectedBlock} />
        </div>
      </div>
    </div>
  );
};
