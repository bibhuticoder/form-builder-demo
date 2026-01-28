import React, { useState } from "react";

import { TopBar } from "./TopBar/TopBar";
import { Canvas } from "./Canvas/Canvas";
import { ConfigPanel } from "./ConfigPanel/ConfigPanel";
import FieldRenderer from "./FormRenderer/FieldRenderer";
import { DndProvider } from "./dnd";
import { useFormBuilder } from "../context";

export const BuilderShell: React.FC = () => {
  const { jsonContent, addField, reorderFields } = useFormBuilder();
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

  return (
    <DndProvider
      onFieldAdd={addField}
      onFieldReorder={reorderFields}
      fields={jsonContent.fields ?? []}
      renderPreview={(field) => <FieldRenderer field={field} />}
    >
      {(dragOverId: string | null) => (
        <div className="flex bg-gray-50 dark:bg-gray-900">
          {/* Config Panel - Left Sidebar */}
          <ConfigPanel />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-w-0 bg-gray-100 dark:bg-gray-800 relative">
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
