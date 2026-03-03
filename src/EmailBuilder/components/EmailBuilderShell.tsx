import React, { useState } from "react";

import { TopBar } from "./TopBar/TopBar";
import { Canvas } from "./Canvas/Canvas";
import { CodeBracketIcon } from "@heroicons/react/24/outline";
import { ConfigPanel } from "./ConfigPanel/ConfigPanel";
import BlockRenderer from "./EmailRenderer/BlockRenderer";
import BuilderBlockControls from "./EmailRenderer/elements/BuilderBlockControls";
import { DndProvider } from "./dnd";
import { useEmailBuilder } from "../context";
import { EditorView } from "../types/enums";
import { JsonEditorPanel } from "./JsonEditorPanel/JsonEditorPanel";
import { jsonToHtml } from "../utils/json-to-html";

export const EmailBuilderShell: React.FC = () => {
  const { jsonContent, addBlock, reorderBlocks, activeBreakpoint, activeView } = useEmailBuilder();
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
        <>
          <div className="flex bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 h-full w-[80vw] overflow-auto transition-all duration-300">
            {activeView === EditorView.DESIGN && (
              <ConfigPanel selectedBlockId={selectedBlockId} onClearSelection={handleClearSelection} />
            )}

            <main className="flex-1 flex flex-col min-w-0">
              <TopBar />
              {activeView === EditorView.DESIGN ? (
                <Canvas
                  dragOverId={dragOverId}
                  selectedBlockId={selectedBlockId}
                  onSelectBlock={setSelectedBlockId}
                />
              ) : (
                <div className="flex-1 p-4 overflow-auto bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                  <div className="max-w-5xl mx-auto h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4 border-b pb-2">
                      <div className="flex items-center gap-2">
                        <CodeBracketIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">HTML SOURCE</span>
                      </div>
                      <div className="text-[10px] text-gray-500 italic">Read-only generated source</div>
                    </div>
                    <div className="flex-1 min-h-0 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <textarea
                        readOnly
                        value={jsonToHtml(jsonContent)}
                        className="w-full h-full p-4 font-mono text-xs text-green-600 dark:text-green-400 bg-transparent resize-none outline-none overflow-y-auto"
                        spellCheck={false}
                      />
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
          <JsonEditorPanel />
        </>
      )}
    </DndProvider>
  );
};
