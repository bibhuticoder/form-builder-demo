import React from "react"
import { EmailBlock, EmailBreakpointId } from "../../../../../types"
import { BlockStyleCapabilities } from "../../../../../types/block-capabilities"
import { StyleSwitcher } from "./StyleSwitcher"


interface LayoutSectionProps {
  block: EmailBlock
  capabilities: BlockStyleCapabilities
  activeBreakpoint: EmailBreakpointId
  updateBlock: (blockId: string, updates: Partial<EmailBlock>) => void
  getStyleValue: (key: string, defaultValue?: string | number) => string | number | undefined
  handleStyleUpdate: (key: string, value: string | number | undefined) => void
}

export const LayoutSection: React.FC<LayoutSectionProps> = ({ block, capabilities, getStyleValue, handleStyleUpdate, activeBreakpoint, updateBlock }) => {
  const alignment = String(getStyleValue("alignment", "left"))



  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Layout</h4>

      <div className="space-y-1">
        {/* Breakpoint / Copy From Control */}
        <StyleSwitcher block={block} activeBreakpoint={activeBreakpoint} updateBlock={updateBlock} />
      </div>

      <div className="space-y-1">
        <label htmlFor="width-select" className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">
          Width
        </label>
        <select id="width-select" value={getStyleValue("width", "full")} onChange={(e) => handleStyleUpdate("width", e.target.value)} className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary">
          <option value="full">Full Width (100%)</option>
          <option value="three-quarters">Three Quarters (75%)</option>
          <option value="half">Half Width (50%)</option>
          <option value="third">One Third (33%)</option>
          <option value="quarter">One Quarter (25%)</option>
        </select>
      </div>

      {capabilities.supportsAlignment && (
        <div className="space-y-1">
          <label htmlFor="alignment-select" className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">
            Alignment
          </label>
          <div id="alignment-select" className="grid grid-cols-3 gap-1">
            {["left", "center", "right"].map((value) => (
              <button key={value} type="button" onClick={() => handleStyleUpdate("alignment", value)} className={`px-2 py-1.5 rounded-md border text-xs font-medium transition-colors ${alignment === value ? "bg-gray-400 text-white" : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"}`}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
