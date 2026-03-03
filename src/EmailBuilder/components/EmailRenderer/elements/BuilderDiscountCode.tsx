import { DiscountCodeBlock } from "../../../types";
import BuilderBlockWrapper from "./BuilderBlockWrapper";
import { getBlockContentStyles } from "../../../utils/styleUtils";
import { useEmailBuilder } from "../../../context";

interface BuilderDiscountCodeProps {
  block: DiscountCodeBlock;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderDiscountCode({ block, isSelected, activeSubElement }: Readonly<BuilderDiscountCodeProps>) {
  const { activeBreakpoint } = useEmailBuilder();

  return (
    <BuilderBlockWrapper block={block} isSelected={isSelected} activeSubElement={activeSubElement}>
      <div className="text-center" style={getBlockContentStyles(block.style, activeBreakpoint)}>
        {block.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{block.description}</p>
        )}
        <div className={`inline-block px-6 py-3 border-2 border-dashed border-gray-400 dark:border-gray-500 rounded-lg bg-gray-50 dark:bg-gray-800 ${isSelected && activeSubElement === 'content' ? 'ring-1 ring-primary ring-offset-1' : ''}`}>
          <span className="font-mono text-lg font-bold text-gray-900 dark:text-white tracking-wider">
            {block.code}
          </span>
        </div>
      </div>
    </BuilderBlockWrapper>
  );
}
