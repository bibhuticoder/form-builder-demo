import { ElementType } from "react";
import { HeadingBlock } from "../../../types";
import BuilderBlockWrapper from "./BuilderBlockWrapper";
import { getBlockContentStyles } from "../../../utils/styleUtils";
import { useEmailBuilder } from "../../../context";

interface BuilderHeadingProps {
  block: HeadingBlock;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderHeading({ block, isSelected, activeSubElement }: Readonly<BuilderHeadingProps>) {
  const { activeBreakpoint } = useEmailBuilder();
  const Tag = (block.headingLevel || "h2") as ElementType;

  return (
    <BuilderBlockWrapper block={block} isSelected={isSelected} activeSubElement={activeSubElement}>
      <Tag
        dangerouslySetInnerHTML={{ __html: block.content }}
        style={getBlockContentStyles(block.style, activeBreakpoint)}
        className={`block transition-all duration-200 text-gray-900 dark:text-white ${isSelected && activeSubElement === 'content' ? 'ring-1 ring-primary ring-offset-1 rounded px-1' : ''}`}
      />
    </BuilderBlockWrapper>
  );
}
