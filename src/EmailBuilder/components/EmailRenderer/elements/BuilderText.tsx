import { TextBlock } from "../../../types";
import BuilderBlockWrapper from "./BuilderBlockWrapper";
import { getBlockContentStyles } from "../../../utils/styleUtils";
import { useEmailBuilder } from "../../../context";

interface BuilderTextProps {
  block: TextBlock;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderText({ block, isSelected, activeSubElement }: Readonly<BuilderTextProps>) {
  const { activeBreakpoint } = useEmailBuilder();

  return (
    <BuilderBlockWrapper block={block} isSelected={isSelected} activeSubElement={activeSubElement}>
      <div
        dangerouslySetInnerHTML={{ __html: block.content }}
        style={getBlockContentStyles(block.style, activeBreakpoint)}
        className={`transition-all duration-200 text-gray-700 dark:text-gray-300 ${isSelected && activeSubElement === 'content' ? 'ring-1 ring-primary ring-offset-1 rounded px-1' : ''}`}
      />
    </BuilderBlockWrapper>
  );
}
