import React from "react"
import { EmailBlock } from "../../../../../types"
import { BlockStyleCapabilities } from "../../../../../types/block-capabilities"
import { ColorControl } from "../../../components/ColorControl"
import { FONT_OPTIONS, FONT_WEIGHT_LABELS } from "../../../../../constants"

interface TypographySectionProps {
  block: EmailBlock
  capabilities: BlockStyleCapabilities
  getStyleValue: (key: string, defaultValue?: string | number) => string | number | undefined
  handleStyleUpdate: (key: string, value: string | number | undefined) => void
  handleStyleBatchUpdate: (updates: Record<string, string | number | undefined>) => void
  setActiveSubElement: (element: string | null) => void
}

export const TypographySection: React.FC<TypographySectionProps> = ({ block: _block, capabilities, getStyleValue, handleStyleUpdate, handleStyleBatchUpdate, setActiveSubElement: _setActiveSubElement }) => {
  if (!capabilities.supportsTypography) return null

  const isItalic = String(getStyleValue("fontStyle", "normal")) === "italic"
  const isUnderline = String(getStyleValue("textDecoration", "none")) === "underline"

  const selectedFontValue = String(getStyleValue("fontFamily", FONT_OPTIONS[0].value))
  const selectedFontOption = FONT_OPTIONS.find(o => o.value === selectedFontValue) || FONT_OPTIONS[0]
  const availableWeights = selectedFontOption.weights

  // Normalize 'normal' and 'bold' from old JSON configs so the select continues matching existing values correctly
  const rawFontWeight = getStyleValue("fontWeight")
  let normalizedWeight = availableWeights[0]
  if (rawFontWeight !== undefined) {
    if (rawFontWeight === "normal") normalizedWeight = 400
    else if (rawFontWeight === "bold") normalizedWeight = 700
    else if (!isNaN(Number(rawFontWeight))) normalizedWeight = Number(rawFontWeight)
  }
  
  // If the currently normalized weight isn't in the newly available weights (e.g. changing from system-ui to Arial) 
  // we fallback to the closest or default weight natively while rendering, although the JSON still holds the old value until changed.
  const displayWeight = availableWeights.includes(normalizedWeight) ? normalizedWeight : availableWeights[0]
  const isBold = displayWeight >= 600

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Typography</h4>

      <div className="space-y-4">
        {/* Font Family */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Font Family</label>
          <select 
            value={selectedFontValue} 
            onChange={(e) => {
              const newValue = e.target.value
              const newFontOption = FONT_OPTIONS.find(o => o.value === newValue) || FONT_OPTIONS[0]
              
              if (rawFontWeight === undefined) {
                handleStyleBatchUpdate({
                  fontFamily: newValue,
                  fontWeight: newFontOption.weights[0]
                })
              } else {
                handleStyleUpdate("fontFamily", newValue)
              }
            }} 
            className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary">
            {FONT_OPTIONS.map(opt => (
              <option key={opt.label} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Font Size and Weight */}
        <div className="grid grid-cols-2 gap-1 w-full">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Size</label>
            <div className="flex">
              <input type="number" value={getStyleValue("fontSize", 14)} onChange={(e) => handleStyleUpdate("fontSize", e.target.value)} className="shadow flex-1 px-2 py-1.5 w-[75px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-l-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary border-r-0" placeholder="14" />
              <select value={String(getStyleValue("fontSizeUnit", "px"))} onChange={(e) => handleStyleUpdate("fontSizeUnit", e.target.value)} className="shadow w-12 px-1 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-r-md text-[10px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="px">px</option>
                <option value="rem">rem</option>
                <option value="em">em</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Weight</label>
            <select value={displayWeight} onChange={(e) => handleStyleUpdate("fontWeight", Number(e.target.value))} className="shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary">
              {availableWeights.map((weight) => (
                <option key={weight} value={weight}>
                  {FONT_WEIGHT_LABELS[weight] || `Weight ${weight}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Text Style</label>
          <div className="grid grid-cols-3 gap-1">
            <button type="button" onClick={() => {
              const boldWeight = availableWeights.includes(700) ? 700 : availableWeights[availableWeights.length - 1];
              const normalWeight = availableWeights[0];
              handleStyleUpdate("fontWeight", isBold ? normalWeight : boldWeight)
            }} className={`px-2 py-1.5 rounded-md border text-xs font-semibold transition-colors ${isBold ? "bg-primary text-white border-primary" : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"}`}>
              B
            </button>
            <button type="button" onClick={() => handleStyleUpdate("fontStyle", isItalic ? "normal" : "italic")} className={`px-2 py-1.5 rounded-md border text-xs italic transition-colors ${isItalic ? "bg-primary text-white border-primary" : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"}`}>
              I
            </button>
            <button type="button" onClick={() => handleStyleUpdate("textDecoration", isUnderline ? "none" : "underline")} className={`px-2 py-1.5 rounded-md border text-xs underline transition-colors ${isUnderline ? "bg-primary text-white border-primary" : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"}`}>
              U
            </button>
          </div>
        </div>

        {/* Text Alignment */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Text Align</label>
          <div className="grid grid-cols-3 gap-1">
            {["left", "center", "right"].map((align) => (
              <button key={align} type="button" onClick={() => handleStyleUpdate("textAlign", align)} className={`px-2 py-1.5 rounded-md border text-xs font-medium transition-colors capitalize ${getStyleValue("textAlign", "left") === align ? "bg-primary text-white border-primary" : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"}`}>
                {align}
              </button>
            ))}
          </div>
        </div>

        {/* Line Height */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Line Height</label>
          <div className="flex w-full">
            <input type="number" step="0.1" value={getStyleValue("lineHeight", 1.5)} onChange={(e) => handleStyleUpdate("lineHeight", e.target.value)} className="shadow flex-1 px-2 py-1.5 w-[75px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-l-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary border-r-0" placeholder="1.5" />
            <select value={String(getStyleValue("lineHeightUnit", "px"))} onChange={(e) => handleStyleUpdate("lineHeightUnit", e.target.value)} className="shadow w-16 px-1 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-r-md text-[10px] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="px">px</option>
              <option value="em">em</option>
              <option value="rem">rem</option>
            </select>
          </div>
        </div>

        {/* Text Color */}
        <ColorControl label="Color" value={String(getStyleValue("color", "#333333"))} onChange={(c) => handleStyleUpdate("color", c)} />
      </div>
    </div>
  )
}
