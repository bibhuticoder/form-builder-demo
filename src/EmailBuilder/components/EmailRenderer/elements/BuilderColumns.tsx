import { ColumnsBlock } from "../../../types";
import BuilderBlockWrapper from "./BuilderBlockWrapper";

interface BuilderColumnsProps {
  block: ColumnsBlock;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderColumns({ block, isSelected, activeSubElement }: Readonly<BuilderColumnsProps>) {
  return (
    <BuilderBlockWrapper block={block} isSelected={isSelected} activeSubElement={activeSubElement}>
      <div className="flex gap-2">
        {block.columns.map((col) => (
          <div
            key={col.id}
            className="border border-dashed border-gray-300 dark:border-gray-600 rounded p-2 min-h-[60px] flex items-center justify-center"
            style={{ width: col.width }}
          >
            {col.blocks.length === 0 ? (
              <span className="text-xs text-gray-400 dark:text-gray-500">Drop blocks here</span>
            ) : (
              <div className="w-full space-y-1">
                {col.blocks.map((b) => (
                  <div key={b.id} className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-1 rounded">
                    {b.type}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </BuilderBlockWrapper>
  );
}
