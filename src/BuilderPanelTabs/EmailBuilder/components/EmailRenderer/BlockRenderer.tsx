import { EmailBlock } from "../../types";
import { blockRegistry } from "../../utils/blockRegistry";

interface BlockRendererProps {
  block: EmailBlock;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

export default function BlockRenderer({ block, isSelected, activeSubElement }: Readonly<BlockRendererProps>) {
  const BlockComponent = blockRegistry[block.type];

  if (!BlockComponent) {
    return null;
  }

  return <BlockComponent block={block} isSelected={isSelected} activeSubElement={activeSubElement} />;
}
