import { Link, useParams } from "react-router-dom"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { AutomationBuilder } from "@/AutomationBuilder"

export default function AutomationBuilderPage() {
  const { id } = useParams()

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex items-center space-x-4">
        <Link to="/automations" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Editing Automation: {id === "new" ? "New Automation" : id}</h2>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <AutomationBuilder automationId={id || "new"} />
      </div>
    </div>
  )
}
