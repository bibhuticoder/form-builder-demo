import { ReactNode } from "react";
import { BaseBlock } from "../../../types";
import { getBlockContainerStyles } from "../../../utils/styleUtils";
import { useEmailBuilder } from "../../../context";

interface BlockWrapperProps {
  block: BaseBlock;
  children: ReactNode;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderBlockWrapper({
  block,
  children,
  isSelected,
  activeSubElement,
}: Readonly<BlockWrapperProps>) {
  const { activeBreakpoint } = useEmailBuilder();

  const highlightClass = isSelected && activeSubElement === 'container'
    ? 'ring-1 ring-primary ring-offset-1'
    : '';

  return (
    <div
      className={`block-wrapper h-fit block-type-${block.type} transition-all duration-200 ${highlightClass}`}
      style={getBlockContainerStyles(block.style, activeBreakpoint)}
    >
      {children}
    </div>
  );
}
