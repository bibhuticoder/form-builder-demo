import { useEffect, useState } from "react"
import type { Edge, Node } from "reactflow"
import { Dialog } from "@/components/Dialog"
import { Button } from "@/components/Button"
import { cn } from "@/lib/utils"

// Helpers
import { restoreIconIfMissing } from "./helpers"

// Triggers
import { FormSubmittedConfig } from "./Triggers/FormSubmittedConfig"
import { TagTriggerConfig } from "./Triggers/TagTriggerConfig"
import { TaskConfig } from "./Triggers/TaskConfig"
import { EntityTriggerConfig } from "./Triggers/EntityTriggerConfig"
import { BirthdayConfig } from "./Triggers/BirthdayConfig"
import { DNDConfig } from "./Triggers/DNDConfig"
import { SocialMessageConfig } from "./Triggers/SocialMessageConfig"
import { CallStatusConfig } from "./Triggers/CallStatusConfig"
import { EngagementScoreConfig } from "./Triggers/EngagementScoreConfig"

// Actions
import { EmailConfig, NotificationConfig, SendToAutomationConfig, SMSConfig, UpdateContactConfig, UpdateCompanyConfig, AddRemoveTaskConfig, NoteConfig, TagConfig, ReviewAutopilotConfig, SlackConfig, TeamsConfig, EndAutomationConfig } from "./Actions"

// Logic
import { IfElseConfig } from "./Logic/IfElseConfig"
import { SplitTestConfig } from "./Logic/SplitTestConfig"
import { WaitConfig } from "./Logic/WaitConfig"
import { LoopBackConfig } from "./Logic/LoopBackConfig"

type Props = {
  isOpen: boolean
  onClose: () => void
  node: Node | null
  edges: Edge[]
  onSave: (nodeId: string, data: any) => void
}

export const AutomationConfigModal = ({ isOpen, onClose, node, edges, onSave }: Props) => {
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    if (node) {
      const { config, ...rest } = node.data || {}
      setFormData({ ...rest, ...(config || {}) })
    }
  }, [node])

  if (!node) return null

  const label = node.data?.label || "Step Config"
  const subTitle = node.data?.subtitle || "Step Settings"
  const Icon = restoreIconIfMissing(node)

  const renderContent = () => {
    if (!node) return null
    const nodeType = node.data?.nodeType

    if (!nodeType) return null

    // --- Triggers ---
    if (nodeType === "form_submitted") return <FormSubmittedConfig data={formData} onChange={setFormData} />
    if (nodeType === "tags") return <TagTriggerConfig data={formData} onChange={setFormData} />
    if (nodeType === "tasks") return <TaskConfig data={formData} onChange={setFormData} />
    if (nodeType === "contacts") return <EntityTriggerConfig data={formData} onChange={setFormData} entityName="Contact" />
    if (nodeType === "companies") return <EntityTriggerConfig data={formData} onChange={setFormData} entityName="Company" />
    if (nodeType === "notes") return <EntityTriggerConfig data={formData} onChange={setFormData} entityName="Note" />
    if (nodeType === "birthday") return <BirthdayConfig data={formData} onChange={setFormData} />
    if (nodeType === "dnd") return <DNDConfig data={formData} onChange={setFormData} />
    if (nodeType === "direct_messages") return <SocialMessageConfig data={formData} onChange={setFormData} type="dm" />
    if (nodeType === "comments") return <SocialMessageConfig data={formData} onChange={setFormData} type="comment" />
    if (nodeType === "call_status") return <CallStatusConfig data={formData} onChange={setFormData} />
    if (nodeType === "engagement_score") return <EngagementScoreConfig data={formData} onChange={setFormData} />

    // --- Actions ---
    if (nodeType === "send_email") return <EmailConfig data={formData} onChange={setFormData} />
    if (nodeType === "send_sms") return <SMSConfig data={formData} onChange={setFormData} />
    if (nodeType === "send_notification") return <NotificationConfig data={formData} onChange={setFormData} />
    if (nodeType === "update_contact") return <UpdateContactConfig data={formData} onChange={setFormData} />
    if (nodeType === "update_company") return <UpdateCompanyConfig data={formData} onChange={setFormData} />
    if (nodeType === "add_task") return <AddRemoveTaskConfig data={formData} onChange={setFormData} />
    if (nodeType === "add_note") return <NoteConfig data={formData} onChange={setFormData} />
    if (nodeType === "tag") return <TagConfig data={formData} onChange={setFormData} />
    if (nodeType === "review_autopilot") return <ReviewAutopilotConfig data={formData} onChange={setFormData} />
    if (nodeType === "slack") return <SlackConfig data={formData} onChange={setFormData} />
    if (nodeType === "teams") return <TeamsConfig data={formData} onChange={setFormData} />
    if (nodeType === "end_automation") return <EndAutomationConfig data={formData} onChange={setFormData} />
    if (nodeType === "send_to_automation") return <SendToAutomationConfig data={formData} onChange={setFormData} />

    // --- Logic ---
    if (nodeType === "wait") return <WaitConfig data={formData} onChange={setFormData} />
    if (nodeType === "if_else") return <IfElseConfig data={formData} onChange={setFormData} edges={edges} node={node} />
    if (nodeType === "split_test") return <SplitTestConfig data={formData} onChange={setFormData} node={node} edges={edges} />
    if (nodeType === "loop_back") return <LoopBackConfig data={formData} onChange={setFormData} />

    return null
  }

  const footer = (
    <div className="flex justify-between items-center w-full px-1">
      <Button variant="ghost" className="h-9 px-6 text-[12px] font-bold tracking-tight rounded-lg text-slate-500 hover:text-slate-900 transition-colors" onClick={onClose} size={"sm"}>
        Cancel
      </Button>
      <Button
        variant="primary"
        className="h-9 px-8 text-[12px] font-bold tracking-tight rounded-lg shadow-sm hover:shadow-md transition-all"
        size={"sm"}
        onClick={() => {
          if (!node) return
          onSave(node.id, formData)
          onClose()
        }}
      >
        Save
      </Button>
    </div>
  )

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      closeOnBackdropClick={false}
      isCloseable={false}
      header={
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 rounded-xl border shadow-sm shrink-0", node?.type === "trigger" ? "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20" : node?.type === "action" ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20" : "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20")}>{Icon && <Icon className="w-5 h-5" />}</div>

          <div className="overflow-hidden">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-slate-100 leading-none truncate mb-1">{label}</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{subTitle}</p>
          </div>
        </div>
      }
      body={<div className="p-2 min-h-[120px] px-0.5 overflow-visible">{renderContent()}</div>}
      footer={footer}
      className="max-w-md w-full sm:rounded-2xl"
    />
  )
}
