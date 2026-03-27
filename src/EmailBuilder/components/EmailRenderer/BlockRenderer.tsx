import { EmailBlock } from "../../types"
import { blockRegistry } from "../../utils/blockRegistry"

interface BlockRendererProps {
  block: EmailBlock
  isSelected?: boolean
  activeSubElement?: string | null
  selectedBlockId?: string | null
  onSelectBlock?: (id: string) => void
}

export default function BlockRenderer({ block, isSelected, activeSubElement, selectedBlockId, onSelectBlock }: Readonly<BlockRendererProps>) {
  const BlockComponent = blockRegistry[block.type]

  if (!BlockComponent) {
    return null
  }

  return <BlockComponent block={block} isSelected={isSelected} activeSubElement={activeSubElement} selectedBlockId={selectedBlockId} onSelectBlock={onSelectBlock} />
}
