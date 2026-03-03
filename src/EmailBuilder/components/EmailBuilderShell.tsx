import React, { useState } from "react";

import { TopBar } from "./TopBar/TopBar";
import { Canvas } from "./Canvas/Canvas";
import { ConfigPanel } from "./ConfigPanel/ConfigPanel";
import BlockRenderer from "./EmailRenderer/BlockRenderer";
import BuilderBlockControls from "./EmailRenderer/elements/BuilderBlockControls";
import { DndProvider } from "./dnd";
import { useEmailBuilder } from "../context";

export const EmailBuilderShell: React.FC = () => {
  const { jsonContent, addBlock, reorderBlocks, activeBreakpoint } = useEmailBuilder();
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const handleClearSelection = () => {
    setSelectedBlockId(null);
  };

  React.useEffect(() => {
    if (selectedBlockId && jsonContent.blocks) {
      const blockExists = jsonContent.blocks.some((block) => block.id === selectedBlockId);
      if (!blockExists) {
        setSelectedBlockId(null);
      }
    }
  }, [jsonContent.blocks, selectedBlockId]);

  return (
    <DndProvider
      onBlockAdd={addBlock}
      onBlockReorder={reorderBlocks}
      blocks={jsonContent.blocks ?? []}
      activeBreakpoint={activeBreakpoint}
      renderPreview={(block) => (
        <BuilderBlockControls block={block} forceHover={true}>
          <BlockRenderer block={block} />
        </BuilderBlockControls>
      )}
    >
      {(dragOverId: string | null) => (
        <div className="flex bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 h-full w-[80vw] overflow-auto">
          <ConfigPanel selectedBlockId={selectedBlockId} onClearSelection={handleClearSelection} />

          <main className="flex-1 flex flex-col min-w-0">
            <TopBar />
            <Canvas
              dragOverId={dragOverId}
              selectedBlockId={selectedBlockId}
              onSelectBlock={setSelectedBlockId}
            />
          </main>
        </div>
      )}
    </DndProvider>
  );
};
