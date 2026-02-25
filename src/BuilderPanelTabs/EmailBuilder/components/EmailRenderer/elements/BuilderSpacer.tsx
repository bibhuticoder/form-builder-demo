import { SpacerBlock } from "../../../types";
import BuilderBlockWrapper from "./BuilderBlockWrapper";

interface BuilderSpacerProps {
  block: SpacerBlock;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BuilderSpacer({ block, isSelected, activeSubElement }: Readonly<BuilderSpacerProps>) {
  return (
    <BuilderBlockWrapper block={block} isSelected={isSelected} activeSubElement={activeSubElement}>
      <div
        className={`w-full bg-transparent ${isSelected ? 'bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600' : ''}`}
        style={{ height: `${block.height || 20}px` }}
      />
    </BuilderBlockWrapper>
  );
}
