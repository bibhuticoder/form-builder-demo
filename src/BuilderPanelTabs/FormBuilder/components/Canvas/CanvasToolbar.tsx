import React from "react"
import { Button, Card } from "../../../../components"
import { SCREEN_SIZES, MAX_CANVAS_WIDTH } from "../../constants"
import { AddLinkButton } from "./AddLinkButton"

export interface CanvasToolbarProps {
  canvasWidth: number
  onCanvasWidthChange: (width: number) => void
  selectedFieldId?: string | null
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ canvasWidth, onCanvasWidthChange, selectedFieldId }) => {
  // Determine active breakpoint based on canvas width
  const activeDevice = (() => {
    if (canvasWidth < SCREEN_SIZES[1].width) return "xs"
    if (canvasWidth < SCREEN_SIZES[2].width) return "sm"
    if (canvasWidth < SCREEN_SIZES[3].width) return "md"
    if (canvasWidth < SCREEN_SIZES[4].width) return "lg"
    if (canvasWidth < MAX_CANVAS_WIDTH) return "xl"
    return "2xl"
  })()

  return (
    <div className="flex justify-center shrink-0">
      <div className="flex items-center gap-4">
        {/* Breakpoint Size Buttons */}
        <Card className="flex items-center gap-2 !p-1.5 rounded">
          {SCREEN_SIZES.map((size) => (
            <Button key={size.id} variant={activeDevice === size.id ? "primary" : "secondary"} className={`!p-1 !px-2 text-xs rounded-md flex items-center justify-center`} onClick={() => onCanvasWidthChange(size.width)} title={size.title}>
              {size.label}
            </Button>
          ))}
        </Card>

        {/* Width Display */}
        <Card className="px-4 py-1">
          <span className="text-xs font-medium text-gray-900 dark:text-white">{Math.round(canvasWidth)}px</span>
        </Card>

        {/* Link Button */}
        <AddLinkButton selectedFieldId={selectedFieldId} />
      </div>
    </div>
  )
}
