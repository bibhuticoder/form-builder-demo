import { ReactFlowProvider } from "reactflow"
import { FlowBuilder } from "../components/FlowBuilder/FlowBuilder"
import { BuilderShell } from "../components/BuilderShell"
import { AutomationBuilderProvider } from "../context/AutomationBuilderContext"

export function AutomationBuilder({ automationId }: { automationId: string }) {
  return (
    <AutomationBuilderProvider automationId={automationId}>
      <ReactFlowProvider>
        <BuilderShell>
          <FlowBuilder automationId={automationId} />
        </BuilderShell>
      </ReactFlowProvider>
    </AutomationBuilderProvider>
  )
}
