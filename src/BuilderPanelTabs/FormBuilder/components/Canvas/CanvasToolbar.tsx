import React from "react"
import { Button, Card } from "../../../../components"
import { LinkIcon } from "@heroicons/react/24/outline"
import { SCREEN_SIZES, MAX_CANVAS_WIDTH } from "../../../../constants"

export interface CanvasToolbarProps {
  canvasWidth: number
  onCanvasWidthChange: (width: number) => void
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ canvasWidth, onCanvasWidthChange }) => {
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
    <div className="flex justify-center bg-gray-100 dark:bg-gray-800 shrink-0">
      <div className="flex items-center gap-4">
        {/* Breakpoint Size Buttons */}
        <Card className="flex items-center gap-2 !p-2">
          {SCREEN_SIZES.map((size) => (
            <Button key={size.id} variant={activeDevice === size.id ? "primary" : "secondary"} className={`p-1 text-xs rounded-sm flex items-center justify-center`} onClick={() => onCanvasWidthChange(size.width)} title={size.title}>
              {size.label}
            </Button>
          ))}
        </Card>

        {/* Width Display */}
        <Card className="px-4 py-1">
          <span className="text-sm font-medium text-gray-900 dark:text-white">{Math.round(canvasWidth)}px</span>
        </Card>

        {/* Link Button */}
        <Button variant="secondary" title="Link Styles">
          <LinkIcon className="h-6 w-6 text-gray-900 dark:text-white" />
        </Button>
      </div>
    </div>
  )
}
