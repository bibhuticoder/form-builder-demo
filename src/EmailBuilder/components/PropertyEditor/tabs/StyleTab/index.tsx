import React, { useMemo } from "react"
import { EmailBlock } from "../../../../types"
import { getBlockCapabilities } from "../../../../types/block-capabilities"
import { useEmailBuilder } from "../../../../context"
import { resolveBreakpointStyle } from "../../../../utils/styleUtils"
import { LayoutSection } from "./components/LayoutSection"
import { TypographySection } from "./components/TypographySection"
import { DecorationSection } from "./components/DecorationSection"

interface StyleTabProps {
  block: EmailBlock
}

export const StyleTab: React.FC<StyleTabProps> = ({ block }) => {
  const { updateBlock, updateBlockStyleBatch, setActiveSubElement, activeBreakpoint } = useEmailBuilder()

  const capabilities = useMemo(() => getBlockCapabilities(block.type), [block.type])

  const handleStyleUpdate = (key: string, value: string | number | undefined) => {
    updateBlockStyleBatch(block.id, { [key]: value })
  }

  const handleStyleBatchUpdate = (updates: Record<string, string | number | undefined>) => {
    updateBlockStyleBatch(block.id, updates)
  }

  const getStyleValue = (key: string, defaultValue: string | number | undefined = "") => {
    const resolvedStyle = resolveBreakpointStyle(block.style, activeBreakpoint)
    return (resolvedStyle as Record<string, string | number | undefined>)?.[key] ?? defaultValue
  }

  return (
    <div className="space-y-6 pb-5">
      {/* Layout Section */}
      <LayoutSection block={block} activeBreakpoint={activeBreakpoint} updateBlock={updateBlock} />

      <div className="border-t border-gray-200 dark:border-gray-700" />

      {/* Typography Section */}
      <TypographySection block={block} capabilities={capabilities} getStyleValue={getStyleValue} handleStyleUpdate={handleStyleUpdate} setActiveSubElement={setActiveSubElement} />

      {capabilities.supportsTypography && <div className="border-t border-gray-200 dark:border-gray-700" />}

      {/* Decoration Section */}
      <DecorationSection block={block} capabilities={capabilities} getStyleValue={getStyleValue} handleStyleUpdate={handleStyleUpdate} handleStyleBatchUpdate={handleStyleBatchUpdate} setActiveSubElement={setActiveSubElement} />
    </div>
  )
}
