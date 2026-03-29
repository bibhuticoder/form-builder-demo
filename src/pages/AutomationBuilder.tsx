import { useParams } from "react-router-dom"
import { AutomationBuilder } from "@/AutomationBuilder/AutomationBuilder"

export default function AutomationBuilderPage() {
  const { id } = useParams()
  const automationId = id || "new"

  return (
    <div className="relative flex h-full min-h-0 flex-col h-[90vh] overflow-hidden">
      <AutomationBuilder automationId={automationId} />
    </div>
  )
}
