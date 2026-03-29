import { useParams } from "react-router-dom"
import { AutomationBuilder } from "@/AutomationBuilder/AutomationBuilder"

export default function AutomationBuilderPage() {
  const { id } = useParams()
  const automationId = id || "new"

  return (
    <div className="relative flex flex-col h-[90vh] min-h-0 overflow-hidden">
      <AutomationBuilder automationId={automationId} />
    </div>
  )
}
