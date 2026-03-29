import type { ComponentType } from "react"
import { ArrowPathIcon, ArrowTrendingUpIcon, BellIcon, BoltIcon, BriefcaseIcon, BuildingOffice2Icon, CalculatorIcon, CakeIcon, CalendarIcon, ChartBarIcon, ChatBubbleLeftRightIcon, CheckCircleIcon, ClipboardDocumentIcon, ClockIcon, DocumentTextIcon, EnvelopeIcon, FunnelIcon, LinkIcon, PaperAirplaneIcon, PhoneIcon, ShareIcon, ShieldCheckIcon, Square2StackIcon, StarIcon, StopCircleIcon, TagIcon, UserCircleIcon, UserGroupIcon, UserPlusIcon } from "@heroicons/react/24/outline"
import type { Edge, Node } from "reactflow"

export type ToolboxItem = {
  type: string
  nodeType: string
  label: string
  icon: ComponentType<any>
  /** Stored in production payload (e.g. "DocumentTextIcon"). */
  iconName: string
  color: string
  comingSoon?: boolean
}

export const TOOLBOX_ITEMS: Array<{ category: string; value: string; items: ToolboxItem[] }> = [
  {
    category: "Triggers",
    value: "triggers",
    items: [
      { type: "trigger", nodeType: "form_submitted", label: "Form Submitted", icon: DocumentTextIcon, iconName: "DocumentTextIcon", color: "text-blue-500" },
      { type: "trigger", nodeType: "tags", label: "Tags", icon: TagIcon, iconName: "TagIcon", color: "text-blue-500" },
      { type: "trigger", nodeType: "contacts", label: "Contacts", icon: UserPlusIcon, iconName: "UserPlusIcon", color: "text-blue-500" },
      { type: "trigger", nodeType: "companies", label: "Companies", icon: BuildingOffice2Icon, iconName: "BuildingOffice2Icon", color: "text-blue-500" },
      { type: "trigger", nodeType: "birthday", label: "Birthday", icon: CakeIcon, iconName: "CakeIcon", color: "text-blue-500" },
      { type: "trigger", nodeType: "notes", label: "Notes", icon: ClipboardDocumentIcon, iconName: "ClipboardDocumentIcon", color: "text-blue-500" },
      { type: "trigger", nodeType: "engagement_score", label: "Engagement Score", icon: ChartBarIcon, iconName: "ChartBarIcon", color: "text-blue-500" },
      { type: "trigger", nodeType: "dnd", label: "Do Not Disturb", icon: BellIcon, iconName: "BellIcon", color: "text-blue-500" },
      { type: "trigger", nodeType: "direct_messages", label: "Direct Messages", icon: PaperAirplaneIcon, iconName: "PaperAirplaneIcon", color: "text-blue-500" },
      { type: "trigger", nodeType: "comments", label: "Comments", icon: DocumentTextIcon, iconName: "DocumentTextIcon", color: "text-blue-500" },
      { type: "trigger", nodeType: "call_status", label: "Call Status", icon: PhoneIcon, iconName: "PhoneIcon", color: "text-blue-500" },
      { type: "trigger", nodeType: "calendar_appointment", label: "Calendar Appointment", icon: CalendarIcon, iconName: "CalendarIcon", color: "text-blue-500", comingSoon: true },
      { type: "trigger", nodeType: "pipelines", label: "Pipelines", icon: ArrowTrendingUpIcon, iconName: "ArrowTrendingUpIcon", color: "text-blue-500", comingSoon: true },
      { type: "trigger", nodeType: "tasks", label: "Tasks", icon: CheckCircleIcon, iconName: "CheckCircleIcon", color: "text-blue-500", comingSoon: true },
      { type: "trigger", nodeType: "webhooks", label: "Webhooks", icon: LinkIcon, iconName: "LinkIcon", color: "text-blue-500", comingSoon: true },
    ],
  },
  {
    category: "Actions",
    value: "actions",
    items: [
      { type: "action", nodeType: "send_email", label: "Send Email", icon: EnvelopeIcon, iconName: "EnvelopeIcon", color: "text-emerald-500" },
      { type: "action", nodeType: "send_sms", label: "Send SMS", icon: PhoneIcon, iconName: "PhoneIcon", color: "text-emerald-500" },
      { type: "action", nodeType: "send_notification", label: "Send Notification", icon: BellIcon, iconName: "BellIcon", color: "text-emerald-500" },
      { type: "action", nodeType: "update_contact", label: "Update Contact", icon: UserCircleIcon, iconName: "UserCircleIcon", color: "text-emerald-500" },
      { type: "action", nodeType: "update_company", label: "Update Company", icon: BuildingOffice2Icon, iconName: "BuildingOffice2Icon", color: "text-emerald-500" },
      { type: "action", nodeType: "add_task", label: "Add / Remove Task", icon: CheckCircleIcon, iconName: "CheckCircleIcon", color: "text-emerald-500" },
      { type: "action", nodeType: "add_note", label: "Add Note", icon: ClipboardDocumentIcon, iconName: "ClipboardDocumentIcon", color: "text-emerald-500" },
      { type: "action", nodeType: "tag", label: "Add / Remove Tag", icon: TagIcon, iconName: "TagIcon", color: "text-emerald-500" },
      { type: "action", nodeType: "review_autopilot", label: "Add to Review Autopilot", icon: StarIcon, iconName: "StarIcon", color: "text-emerald-500" },
      { type: "action", nodeType: "slack", label: "Send To Slack", icon: ChatBubbleLeftRightIcon, iconName: "ChatBubbleLeftRightIcon", color: "text-emerald-500" },
      { type: "action", nodeType: "teams", label: "Send To Teams", icon: UserGroupIcon, iconName: "UserGroupIcon", color: "text-emerald-500" },
      { type: "action", nodeType: "end_automation", label: "End Automation", icon: StopCircleIcon as any, iconName: "StopCircleIcon", color: "text-emerald-500" },
      { type: "action", nodeType: "send_to_automation", label: "Send To Automation", icon: ShareIcon, iconName: "ShareIcon", color: "text-emerald-500" },

      { type: "action", nodeType: "update_deal", label: "Update Deal", icon: BriefcaseIcon as any, iconName: "BriefcaseIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", nodeType: "update_pipeline_stage", label: "Update Pipeline Stage", icon: ArrowTrendingUpIcon, iconName: "ArrowTrendingUpIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", nodeType: "calendar_appointment_action", label: "Calendar Appointment", icon: CalendarIcon, iconName: "CalendarIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", nodeType: "validate_phone", label: "Validate Phone Number", icon: PhoneIcon, iconName: "PhoneIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", nodeType: "validate_email", label: "Validate Email", icon: ShieldCheckIcon as any, iconName: "ShieldCheckIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", nodeType: "send_contract", label: "Send Contract", icon: DocumentTextIcon, iconName: "DocumentTextIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", nodeType: "update_contract", label: "Update Contract", icon: DocumentTextIcon, iconName: "DocumentTextIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", nodeType: "send_invoice", label: "Send Invoice", icon: Square2StackIcon, iconName: "Square2StackIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", nodeType: "update_invoice", label: "Update Invoice", icon: Square2StackIcon, iconName: "Square2StackIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", nodeType: "send_estimate", label: "Send Estimate", icon: CalculatorIcon as any, iconName: "CalculatorIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", nodeType: "update_estimate", label: "Update Estimate", icon: CalculatorIcon as any, iconName: "CalculatorIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", nodeType: "webhooks_action", label: "Webhooks", icon: LinkIcon, iconName: "LinkIcon", color: "text-emerald-500", comingSoon: true },
    ],
  },
  {
    category: "Logic",
    value: "logic",
    items: [
      { type: "condition", nodeType: "if_else", label: "If / Else", icon: FunnelIcon, iconName: "FunnelIcon", color: "text-amber-500" },
      { type: "condition", nodeType: "split_test", label: "Split Test (A/B)", icon: ArrowPathIcon, iconName: "ArrowPathIcon", color: "text-amber-500" },
      { type: "delay", nodeType: "wait", label: "Wait", icon: ClockIcon as any, iconName: "ClockIcon", color: "text-amber-500" },
      { type: "loopBack", nodeType: "loop_back", label: "Loop Back To", icon: ArrowPathIcon, iconName: "ArrowPathIcon", color: "text-amber-500" },
    ],
  },
]

export const PRO_TIPS = ["Drag items onto the canvas to add them to your automation.", "You can add multiple triggers to start the same automation.", "Use 'Split Test' to run A/B experiments on your audience.", "Connect actions in parallel to execute them simultaneously.", "Click on any step to edit its properties"]

export const initialNodes: Node[] = [
  {
    id: "placeholder-1",
    type: "placeholder",
    position: { x: 250, y: 100 },
    data: { label: "Start your automation", icon: BoltIcon },
    draggable: false,
    selectable: false,
  },
]

export const initialEdges: Edge[] = []
