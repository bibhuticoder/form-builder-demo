import { useParams } from "react-router-dom"
import { AutomationBuilder } from "@/AutomationBuilder"

export default function AutomationBuilderPage() {
  const { id } = useParams()
  const automationId = id || "new"

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AutomationBuilder automationId={automationId} />
      </div>
    </div>
  )
}
