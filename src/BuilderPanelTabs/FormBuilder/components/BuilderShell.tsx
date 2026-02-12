import React, { useState } from "react";

import { TopBar } from "./TopBar/TopBar";
import { Canvas } from "./Canvas/Canvas";
import { ConfigPanel } from "./ConfigPanel/ConfigPanel";
import FieldRenderer from "./FormRenderer/FieldRenderer";
import BuilderFieldControls from "./FormRenderer/elements/BuilderFieldControls";
import { DndProvider } from "./dnd";
import { useFormBuilder } from "../context";

export const BuilderShell: React.FC = () => {
  const { jsonContent, addField, reorderFields, activeBreakpoint } = useFormBuilder();
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  const handleClearSelection = () => {
    setSelectedFieldId(null);
  };

  // Reset selection if the selected field is deleted
  React.useEffect(() => {
    if (selectedFieldId && jsonContent.fields) {
      const fieldExists = jsonContent.fields.some((field) => field.id === selectedFieldId);
      if (!fieldExists) {
        setSelectedFieldId(null);
      }
    }
  }, [jsonContent.fields, selectedFieldId]);

  return (
    <DndProvider
      onFieldAdd={addField}
      onFieldReorder={reorderFields}
      fields={jsonContent.fields ?? []}
      activeBreakpoint={activeBreakpoint}
      renderPreview={(field) => (
        <BuilderFieldControls field={field} forceHover={true}>
          <FieldRenderer field={field} />
        </BuilderFieldControls>
      )}
    >
      {(dragOverId: string | null) => (
        <div className="flex bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 h-full w-[80vw] overflow-auto">
          {/* Config Panel - Left Sidebar */}
          <ConfigPanel selectedFieldId={selectedFieldId} onClearSelection={handleClearSelection} />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-w-0">
            {/* Top Navigation Bar */}
            <TopBar />

            {/* Canvas Area */}
            <Canvas
              dragOverId={dragOverId}
              selectedFieldId={selectedFieldId}
              onSelectField={setSelectedFieldId}
            />
          </main>
        </div>
      )}
    </DndProvider>
  );
};
