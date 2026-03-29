import { ReactFlowProvider } from "reactflow"
import { FlowBuilder } from "./components/FlowBuilder"
import { BuilderShell } from "./components/BuilderShell"
import { AutomationBuilderProvider } from "./context/AutomationBuilderContext"
import { Link } from "react-router-dom"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"

export function AutomationBuilder({ automationId }: { automationId: string }) {
  return (
    <AutomationBuilderProvider automationId={automationId}>
      <div className="fkex flex-col h-full">

        {/* Edit/New automation */}
        <div className="mb-4 flex items-center space-x-4">
          <Link to="/automations" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Editing Automation: {automationId === 'new' ? 'New Automation' : automationId}
          </h2>
        </div>

        <ReactFlowProvider>
          <BuilderShell>
            <FlowBuilder automationId={automationId} />
          </BuilderShell>
        </ReactFlowProvider>
      </div>
    </AutomationBuilderProvider>
  )
}
