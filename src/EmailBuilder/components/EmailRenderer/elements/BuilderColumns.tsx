import { ColumnsBlock } from "../../../types";
import { useDroppable } from "@dnd-kit/core";
import BuilderBlockWrapper from "./BuilderBlockWrapper";
import BlockRenderer from "../BlockRenderer";
import BuilderBlockControls from "./BuilderBlockControls";
import { useEmailBuilder } from "../../../context";

interface BuilderColumnsProps {
  block: ColumnsBlock;
  isSelected?: boolean;
  activeSubElement?: string | null;
  selectedBlockId?: string | null;
  onSelectBlock?: (id: string) => void;
}

export const getColumnDroppableId = (columnsBlockId: string, columnId: string) => `email-column:${columnsBlockId}:${columnId}`;

function ColumnDropZone({
  columnsBlockId,
  column,
  selectedBlockId,
  onSelectBlock,
  activeSubElement,
}: Readonly<{
  columnsBlockId: string;
  column: ColumnsBlock["columns"][number];
  selectedBlockId?: string | null;
  onSelectBlock?: (id: string) => void;
  activeSubElement?: string | null;
}>) {
  const { deleteBlock } = useEmailBuilder();
  const { setNodeRef, isOver } = useDroppable({ id: getColumnDroppableId(columnsBlockId, column.id) });

  return (
    <div
      ref={setNodeRef}
      className={`border border-dashed rounded p-2 min-h-[120px] transition-colors ${isOver ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-gray-300 dark:border-gray-600'}`}
      style={{ width: column.width }}
    >
      {column.blocks.length === 0 ? (
        <div className="h-full min-h-[44px] flex items-center justify-center">
          <span className="text-xs text-gray-400 dark:text-gray-500">Drop blocks here</span>
        </div>
      ) : (
        <div className="w-full space-y-1">
          {column.blocks.map((b) => (
            <BuilderBlockControls key={b.id} block={b} onDelete={deleteBlock} selected={selectedBlockId === b.id} onSelect={onSelectBlock}>
              <BlockRenderer
                block={b}
                isSelected={selectedBlockId === b.id}
                activeSubElement={activeSubElement}
                selectedBlockId={selectedBlockId}
                onSelectBlock={onSelectBlock}
              />
            </BuilderBlockControls>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BuilderColumns({ block, isSelected, activeSubElement, selectedBlockId, onSelectBlock }: Readonly<BuilderColumnsProps>) {
  return (
    <BuilderBlockWrapper block={block} isSelected={isSelected} activeSubElement={activeSubElement}>
      <div className="flex gap-2">
        {block.columns.map((col) => (
          <ColumnDropZone
            key={col.id}
            columnsBlockId={block.id}
            column={col}
            selectedBlockId={selectedBlockId}
            onSelectBlock={onSelectBlock}
            activeSubElement={activeSubElement}
          />
        ))}
      </div>
    </BuilderBlockWrapper>
  );
}
