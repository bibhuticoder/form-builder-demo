import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components";
import { PropertyEditor } from "../PropertyEditor/PropertyEditor";
import { ElementPalette } from "../ElementPalette/ElementPalette";

import { BottomActionBar } from "./BottomActionBar";

interface ConfigPanelProps {
  selectedBlockId?: string | null;
  onClearSelection?: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ selectedBlockId, onClearSelection }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (selectedBlockId && onClearSelection) {
    return (
      <aside className="sticky top-0 w-[280px] flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shrink-0 z-20 shadow-xl">
        <PropertyEditor selectedBlockId={selectedBlockId} onBack={onClearSelection} />
        <BottomActionBar isCollapsed={isCollapsed} parent="property-editor" />
      </aside>
    );
  }

  return (
    <aside className={`sticky top-0 ${isCollapsed ? "w-[50px]" : "w-[280px]"} flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shrink-0 z-20 shadow-xl transition-all duration-300 ease-in-out relative`}>
      <div className={`p-2 flex items-center ${isCollapsed ? "justify-center" : "justify-between px-2"} bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700`}>
        {!isCollapsed && <span className="font-semibold text-gray-900 dark:text-white text-xs">Email Blocks</span>}

        <Button variant="transparent" onClick={() => setIsCollapsed(!isCollapsed)} title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} className="focus:ring-0 border-none !p-1.5">
          {isCollapsed ? <ChevronRightIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" /> : <ChevronLeftIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />}
        </Button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <ElementPalette isCollapsed={isCollapsed} />
        <BottomActionBar isCollapsed={isCollapsed} parent="element-palette" />
      </div>
    </aside>
  );
};
