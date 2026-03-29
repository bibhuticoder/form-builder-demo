import React, { useMemo, useState } from "react"
import { ChevronDownIcon, ChevronUpIcon, CodeBracketIcon } from "@heroicons/react/24/outline"
import type { Edge, Node } from "reactflow"
import { buildPayloadFromBuilder } from "../../utils/payload"
import { JsonViewer } from "./JsonViewer"
import { useAutomationBuilderContext } from "../../context/AutomationBuilderContext"

export interface JsonViewerPanelProps {
  automationId: string
  nodes: Node[]
  edges: Edge[]
}

export const JsonViewerPanel: React.FC<JsonViewerPanelProps> = ({ automationId, nodes, edges }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const { name, status, settings, savedAt } = useAutomationBuilderContext()

  const payload = useMemo(() => {
    return buildPayloadFromBuilder({
      automationId,
      name,
      status,
      settings,
      version: 1,
      nodes,
      edges,
      savedAt: savedAt || undefined,
    })
  }, [automationId, nodes, edges, name, status, settings, savedAt])

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {isExpanded ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 w-[520px] max-h-[600px] flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <CodeBracketIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">RAW JSON</span>
            </div>
            <button onClick={() => setIsExpanded(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="Minimize" type="button">
              <ChevronDownIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <JsonViewer value={payload} />
          </div>
        </div>
      ) : (
        <button onClick={() => setIsExpanded(true)} className="bg-primary hover:bg-primary-hover text-white rounded-full p-2.5 shadow-lg hover:shadow-xl transition-all flex items-center gap-1.5" title="Open JSON Viewer" type="button">
          <CodeBracketIcon className="w-4 h-4" />
          <ChevronUpIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
