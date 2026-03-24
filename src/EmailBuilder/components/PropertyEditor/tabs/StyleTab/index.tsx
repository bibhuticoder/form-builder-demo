import React, { useMemo } from "react"
import { EmailBlock, EmailBlockType, HeadingBlock } from "../../../../types"
import { getBlockCapabilities } from "../../../../types/block-capabilities"
import { useEmailBuilder } from "../../../../context"
import { resolveBreakpointStyle } from "../../../../utils/styleUtils"
import { HEADING_LEVEL_STYLE_DEFAULTS } from "../../../../constants"
import { LayoutSection } from "./components/LayoutSection"
import { TypographySection } from "./components/TypographySection"
import { DecorationSection } from "./components/DecorationSection"


interface StyleTabProps {
  block: EmailBlock
}


export const StyleTab: React.FC<StyleTabProps> = ({ block }) => {
  const { updateBlock, updateBlockStyleBatch, setActiveSubElement, activeBreakpoint, jsonContent } = useEmailBuilder()

  const capabilities = useMemo(() => getBlockCapabilities(block.type), [block.type])

  const handleStyleUpdate = (key: string, value: string | number | undefined) => {
    updateBlockStyleBatch(block.id, { [key]: value })
  }

  const handleStyleBatchUpdate = (updates: Record<string, string | number | undefined>) => {
    updateBlockStyleBatch(block.id, updates)
  }

  const getStyleValue = (key: string, defaultValue: string | number | undefined = "") => {
    const resolvedStyle = resolveBreakpointStyle(block.style, activeBreakpoint)
    const storedValue = (resolvedStyle as Record<string, string | number | undefined>)?.[key]
    if (storedValue !== undefined && storedValue !== null && storedValue !== "") return storedValue

    // For heading blocks, fall back to level-specific defaults before the generic default
    if (block.type === EmailBlockType.HEADING) {
      const level = (block as HeadingBlock).headingLevel || "h2"
      const levelDefaults = HEADING_LEVEL_STYLE_DEFAULTS[level]
      if (levelDefaults?.[key as keyof typeof levelDefaults] !== undefined) return levelDefaults[key as keyof typeof levelDefaults]
    }

    return defaultValue
  }


  const defaultBgColor = jsonContent.templateSettings?.settings?.backgroundColor || "#f4f4f4"

  return (
    <div className="space-y-6 pb-5">
      {/* Layout Section */}
      <LayoutSection block={block} activeBreakpoint={activeBreakpoint} updateBlock={updateBlock} />

      <div className="border-t border-gray-200 dark:border-gray-700" />

      {/* Typography Section */}
      <TypographySection block={block} capabilities={capabilities} getStyleValue={getStyleValue} handleStyleUpdate={handleStyleUpdate} handleStyleBatchUpdate={handleStyleBatchUpdate} setActiveSubElement={setActiveSubElement} />

      {capabilities.supportsTypography && <div className="border-t border-gray-200 dark:border-gray-700" />}

      {/* Decoration Section */}
      <DecorationSection block={block} capabilities={capabilities} getStyleValue={getStyleValue} handleStyleUpdate={handleStyleUpdate} handleStyleBatchUpdate={handleStyleBatchUpdate} setActiveSubElement={setActiveSubElement} defaultBgColor={defaultBgColor} />
    </div>
  )
}
