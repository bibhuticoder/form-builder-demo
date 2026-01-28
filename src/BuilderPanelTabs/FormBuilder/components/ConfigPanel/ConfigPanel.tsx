import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button } from "../../../../components";
import { PropertyEditor } from "../PropertyEditor/PropertyEditor";
import { ElementPalette } from "../ElementPalette/ElementPalette";

interface ConfigPanelProps {
  selectedFieldId?: string | null;
  onClearSelection?: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ selectedFieldId, onClearSelection }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // If a field is selected, show the property editor
  if (selectedFieldId && onClearSelection) {
    return (
      <aside className="w-[350px] flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shrink-0 z-20 shadow-xl">
        <PropertyEditor selectedFieldId={selectedFieldId} onBack={onClearSelection} />
      </aside>
    );
  }

  // Otherwise, show the element palette
  return (
    <aside className={`${isCollapsed ? "w-[60px]" : "w-[350px]"} flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shrink-0 z-20 shadow-xl transition-all duration-300 ease-in-out relative`}>
      <div className={`p-4 flex items-center ${isCollapsed ? "justify-center" : "justify-between px-3"} bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700`}>
        {!isCollapsed && <span className="font-semibold text-gray-900 dark:text-white">Form Elements</span>}

        <Button variant="secondary" onClick={() => setIsCollapsed(!isCollapsed)} title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {isCollapsed ? <ChevronRightIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" /> : <ChevronLeftIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />}
        </Button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <ElementPalette isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
};
