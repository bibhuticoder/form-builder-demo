import React from "react"

import { EmailTemplate } from "../../types"
import BlockRenderer from "./BlockRenderer"
import BuilderBlockControls from "./elements/BuilderBlockControls"
import type { DragData } from "../../types/dnd"
import { CANVAS_DROPPABLE_ID } from "../../types/dnd"
import { useEmailBuilder } from "../../context"
import { SortableList, SortableItem, DropIndicator } from "../dnd"
import { getTemplateSettingsStyles } from "../../utils/styleUtils"

interface EmailRendererProps {
  templateData: EmailTemplate
  dragOverId?: string | null
  selectedBlockId?: string | null
  onSelectBlock?: (id: string) => void
  canvasWidth: number
}

export default function EmailRenderer({ templateData, dragOverId, selectedBlockId, onSelectBlock, canvasWidth: _canvasWidth }: Readonly<EmailRendererProps>) {
  const { deleteBlock, activeSubElement } = useEmailBuilder()
  const { blocks, templateSettings } = templateData

  const onDelete = (blockId: string) => {
    deleteBlock(blockId)
  }

  const templateSettingsStyles = getTemplateSettingsStyles(templateSettings.settings as unknown as Record<string, unknown>)
  const backgroundColor = (templateSettings.settings as any)?.backgroundColor || "#ffffff"
  const fontFamily = (templateSettings.settings as any)?.fontFamily

  return (
    <SortableList items={blocks}>
      <div className="mx-auto w-full h-full" style={{ maxWidth: templateSettingsStyles.maxWidth }}>
        <div className="flex flex-col gap-0 mx-auto overflow-auto h-full" style={{ ...templateSettingsStyles, backgroundColor, fontFamily }}>
          {blocks.map((block) => (
            <React.Fragment key={block.id}>
              {dragOverId === block.id && <DropIndicator />}

              <SortableItem id={block.id} dragData={{ kind: "canvas-block", blockId: block.id } as DragData}>
                {(dragHandleProps) => (
                  <BuilderBlockControls block={block} onDelete={onDelete} dragHandleProps={dragHandleProps} selected={selectedBlockId === block.id} onSelect={onSelectBlock}>
                    <BlockRenderer block={block} isSelected={selectedBlockId === block.id} activeSubElement={activeSubElement} selectedBlockId={selectedBlockId} onSelectBlock={onSelectBlock} />
                  </BuilderBlockControls>
                )}
              </SortableItem>
            </React.Fragment>
          ))}
          {dragOverId === CANVAS_DROPPABLE_ID && blocks.length > 0 && <DropIndicator />}
        </div>
      </div>
    </SortableList>
  )
}
