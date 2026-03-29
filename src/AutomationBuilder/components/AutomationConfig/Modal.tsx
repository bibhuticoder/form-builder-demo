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
import {
  EmailConfig,
  NotificationConfig,
  SendToAutomationConfig,
  SMSConfig,
  UpdateContactConfig,
  UpdateCompanyConfig,
  AddRemoveTaskConfig,
  NoteConfig,
  TagConfig,
  ReviewAutopilotConfig,
  SlackConfig,
  TeamsConfig,
  EndAutomationConfig
} from "./Actions"

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

  const label = node.data?.label || 'Step Config'
  const subTitle = node.data?.subtitle || 'Step Settings'
  const Icon = restoreIconIfMissing(node)

  const renderContent = () => {
    if (!node) return null

    // --- Triggers ---
    if (node.type === 'trigger') {
      if (label === 'Form Submitted') return <FormSubmittedConfig data={formData} onChange={setFormData} />
      if (label.includes('Tag')) return <TagTriggerConfig data={formData} onChange={setFormData} />
      if (label.includes('Task')) return <TaskConfig data={formData} onChange={setFormData} />
      if (label.includes('Contact ') || label === 'Contacts') return <EntityTriggerConfig data={formData} onChange={setFormData} entityName="Contact" />
      if (label.includes('Company ') || label === 'Companies') return <EntityTriggerConfig data={formData} onChange={setFormData} entityName="Company" />
      if (label.includes('Note ') || label === 'Notes') return <EntityTriggerConfig data={formData} onChange={setFormData} entityName="Note" />
      if (label === 'Birthday') return <BirthdayConfig data={formData} onChange={setFormData} />
      if (label.includes('DND') || label.includes('Do Not Disturb')) return <DNDConfig data={formData} onChange={setFormData} />
      if (label.includes('DM') || label.includes('Direct Message')) return <SocialMessageConfig data={formData} onChange={setFormData} type="dm" />
      if (label.includes('Comment')) return <SocialMessageConfig data={formData} onChange={setFormData} type="comment" />
      if (label === 'Call Status') return <CallStatusConfig data={formData} onChange={setFormData} />
      if (label === 'Engagement Score') return <EngagementScoreConfig data={formData} onChange={setFormData} />
    }

    // --- Actions ---
    if (node.type === 'action') {
      if (label === 'Send Email') return <EmailConfig data={formData} onChange={setFormData} />
      if (label === 'Send SMS') return <SMSConfig data={formData} onChange={setFormData} />
      if (label === 'Send Notification') return <NotificationConfig data={formData} onChange={setFormData} />
      if (label === 'Update Contact') return <UpdateContactConfig data={formData} onChange={setFormData} />
      if (label === 'Update Company') return <UpdateCompanyConfig data={formData} onChange={setFormData} />
      if (label === 'Add / Remove Task') return <AddRemoveTaskConfig data={formData} onChange={setFormData} />
      if (label === 'Add Note') return <NoteConfig data={formData} onChange={setFormData} />
      if (label === 'Add / Remove Tag') return <TagConfig data={formData} onChange={setFormData} />
      if (label === 'Add to Review Autopilot') return <ReviewAutopilotConfig data={formData} onChange={setFormData} />
      if (label === 'Send To Slack') return <SlackConfig data={formData} onChange={setFormData} />
      if (label === 'Send To Teams') return <TeamsConfig data={formData} onChange={setFormData} />
      if (label === 'End Automation') return <EndAutomationConfig data={formData} onChange={setFormData} />
      if (label === 'Send To Automation') return <SendToAutomationConfig data={formData} onChange={setFormData} />
    }

    // --- Logic ---
    if (label === 'Wait' || label === 'Delay') return <WaitConfig data={formData} onChange={setFormData} />
    if (label === 'If / Else') return <IfElseConfig data={formData} onChange={setFormData} edges={edges} node={node} />
    if (label === 'Split Test (A/B)') return <SplitTestConfig data={formData} onChange={setFormData} node={node} edges={edges} />
    if (node.type === 'loopBack') return <LoopBackConfig data={formData} onChange={setFormData} />

    return <div className="p-4 text-center italic text-slate-500">Generic settings for {label}</div>
  }

  const footer = (
    <div className="flex justify-between items-center w-full px-1">
      <Button variant="ghost" className="h-9 px-6 text-[12px] font-bold tracking-tight rounded-lg text-slate-500 hover:text-slate-900 transition-colors" onClick={onClose} size={"sm"}>Cancel</Button>
      <Button variant="primary" className="h-9 px-8 text-[12px] font-bold tracking-tight rounded-lg shadow-sm hover:shadow-md transition-all" size={"sm"} onClick={() => { if (!node) return; onSave(node.id, formData); onClose() }}>Save</Button>
    </div>
  )

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      header={
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2.5 rounded-xl border shadow-sm shrink-0",
            node?.type === 'trigger' ? "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20" :
              node?.type === 'action' ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20" :
                "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20"
          )}>
            {Icon && <Icon className="w-5 h-5" />}
          </div>

          <div className="overflow-hidden">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-slate-100 leading-none truncate mb-1">{label}</h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{subTitle}</p>
          </div>
        </div>
      }
      body={
        <div className="p-2 min-h-[120px] px-0.5 overflow-visible">
          {renderContent()}
        </div>
      }
      footer={footer}
      className="max-w-md w-full sm:rounded-2xl"
    />
  )
}
