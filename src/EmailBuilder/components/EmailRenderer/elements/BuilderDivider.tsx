import { DividerBlock } from "../../../types";
import BuilderBlockWrapper from "./BuilderBlockWrapper";
import { getBlockContainerStyles } from "../../../utils/styleUtils";
import { useEmailBuilder } from "../../../context";

interface BuilderDividerProps {
  block: DividerBlock;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderDivider({ block, isSelected, activeSubElement }: Readonly<BuilderDividerProps>) {
  const { activeBreakpoint } = useEmailBuilder();

  const containerStyle = getBlockContainerStyles(block.style, activeBreakpoint);
  const borderColor = containerStyle.borderColor || '#cccccc';

  return (
    <BuilderBlockWrapper block={block} isSelected={isSelected} activeSubElement={activeSubElement}>
      <hr style={{ borderColor, borderWidth: '1px' }} className="w-full" />
    </BuilderBlockWrapper>
  );
}
