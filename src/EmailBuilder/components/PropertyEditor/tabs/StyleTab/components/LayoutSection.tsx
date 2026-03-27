import React from "react"
import { EmailBlock, EmailBreakpointId } from "../../../../../types"
import { StyleSwitcher } from "./StyleSwitcher"

interface LayoutSectionProps {
  block: EmailBlock
  activeBreakpoint: EmailBreakpointId
  updateBlock: (blockId: string, updates: Partial<EmailBlock>) => void
}

export const LayoutSection: React.FC<LayoutSectionProps> = ({ block, activeBreakpoint, updateBlock }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Layout</h4>

      <div className="space-y-1">
        {/* Breakpoint / Copy From Control */}
        <StyleSwitcher block={block} activeBreakpoint={activeBreakpoint} updateBlock={updateBlock} />
      </div>
    </div>
  )
}
