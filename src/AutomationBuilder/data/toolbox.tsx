import type { ComponentType } from "react"
import { ArrowPathIcon, ArrowTrendingUpIcon, BellIcon, BoltIcon, BuildingOffice2Icon, CakeIcon, CalendarIcon, ChartBarIcon, CheckCircleIcon, ClipboardDocumentIcon, DocumentTextIcon, EnvelopeIcon, FunnelIcon, LinkIcon, PaperAirplaneIcon, PhoneIcon, ShareIcon, Square2StackIcon, StarIcon, TagIcon, UserCircleIcon, UserPlusIcon } from "@heroicons/react/24/outline"
import { BriefcaseIcon, CalculatorIcon, ClockIcon, ShieldCheckIcon, StopCircleIcon } from "@heroicons/react/24/solid"
import type { Edge, Node } from "reactflow"

export const SlackIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="3" height="8" x="13" y="2" rx="1.5" />
    <path d="M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5" />
    <rect width="3" height="8" x="8" y="14" rx="1.5" />
    <path d="M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5" />
    <rect width="8" height="3" x="14" y="13" rx="1.5" />
    <path d="M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5" />
    <rect width="8" height="3" x="2" y="8" rx="1.5" />
    <path d="M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5" />
  </svg>
)

export const TeamsIcon = (props: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 15.5a3.5 3.5 0 0 1 3.5-3.5h.5" />
    <rect width="13" height="13" x="8" y="7" rx="2" />
    <path d="M11 11.5v3" />
    <path d="M14 11.5v3" />
    <path d="M3 17.5V6.5a1.5 1.5 0 0 1 1.5-1.5H8" />
  </svg>
)

export type ToolboxItem = {
  type: string
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
      { type: "trigger", label: "Form Submitted", icon: DocumentTextIcon, iconName: "DocumentTextIcon", color: "text-blue-500" },
      { type: "trigger", label: "Tags", icon: TagIcon, iconName: "TagIcon", color: "text-blue-500" },
      { type: "trigger", label: "Contacts", icon: UserPlusIcon, iconName: "UserPlusIcon", color: "text-blue-500" },
      { type: "trigger", label: "Companies", icon: BuildingOffice2Icon, iconName: "BuildingOffice2Icon", color: "text-blue-500" },
      { type: "trigger", label: "Birthday", icon: CakeIcon, iconName: "CakeIcon", color: "text-blue-500" },
      { type: "trigger", label: "Notes", icon: ClipboardDocumentIcon, iconName: "ClipboardDocumentIcon", color: "text-blue-500" },
      { type: "trigger", label: "Engagement Score", icon: ChartBarIcon, iconName: "ChartBarIcon", color: "text-blue-500" },
      { type: "trigger", label: "Do Not Disturb", icon: BellIcon, iconName: "BellIcon", color: "text-blue-500" },
      { type: "trigger", label: "Direct Messages", icon: PaperAirplaneIcon, iconName: "PaperAirplaneIcon", color: "text-blue-500" },
      { type: "trigger", label: "Comments", icon: DocumentTextIcon, iconName: "DocumentTextIcon", color: "text-blue-500" },
      { type: "trigger", label: "Call Status", icon: PhoneIcon, iconName: "PhoneIcon", color: "text-blue-500" },
      { type: "trigger", label: "Calendar Appointment", icon: CalendarIcon, iconName: "CalendarIcon", color: "text-blue-500", comingSoon: true },
      { type: "trigger", label: "Pipelines", icon: ArrowTrendingUpIcon, iconName: "ArrowTrendingUpIcon", color: "text-blue-500", comingSoon: true },
      { type: "trigger", label: "Tasks", icon: CheckCircleIcon, iconName: "CheckCircleIcon", color: "text-blue-500", comingSoon: true },
      { type: "trigger", label: "Webhooks", icon: LinkIcon, iconName: "LinkIcon", color: "text-blue-500", comingSoon: true },
    ],
  },
  {
    category: "Actions",
    value: "actions",
    items: [
      { type: "action", label: "Send Email", icon: EnvelopeIcon, iconName: "EnvelopeIcon", color: "text-emerald-500" },
      { type: "action", label: "Send SMS", icon: PhoneIcon, iconName: "PhoneIcon", color: "text-emerald-500" },
      { type: "action", label: "Send Notification", icon: BellIcon, iconName: "BellIcon", color: "text-emerald-500" },
      { type: "action", label: "Update Contact", icon: UserCircleIcon, iconName: "UserCircleIcon", color: "text-emerald-500" },
      { type: "action", label: "Update Company", icon: BuildingOffice2Icon, iconName: "BuildingOffice2Icon", color: "text-emerald-500" },
      { type: "action", label: "Add / Remove Task", icon: CheckCircleIcon, iconName: "CheckCircleIcon", color: "text-emerald-500" },
      { type: "action", label: "Add Note", icon: ClipboardDocumentIcon, iconName: "ClipboardDocumentIcon", color: "text-emerald-500" },
      { type: "action", label: "Add / Remove Tag", icon: TagIcon, iconName: "TagIcon", color: "text-emerald-500" },
      { type: "action", label: "Add to Review Autopilot", icon: StarIcon, iconName: "StarIcon", color: "text-emerald-500" },
      { type: "action", label: "Send To Slack", icon: SlackIcon as any, iconName: "SlackIcon", color: "text-emerald-500" },
      { type: "action", label: "Send To Teams", icon: TeamsIcon as any, iconName: "TeamsIcon", color: "text-emerald-500" },
      { type: "action", label: "End Automation", icon: StopCircleIcon as any, iconName: "StopCircleIcon", color: "text-emerald-500" },
      { type: "action", label: "Send To Automation", icon: ShareIcon, iconName: "ShareIcon", color: "text-emerald-500" },

      { type: "action", label: "Update Deal", icon: BriefcaseIcon as any, iconName: "BriefcaseIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", label: "Update Pipeline Stage", icon: ArrowTrendingUpIcon, iconName: "ArrowTrendingUpIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", label: "Calendar Appointment", icon: CalendarIcon, iconName: "CalendarIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", label: "Validate Phone Number", icon: PhoneIcon, iconName: "PhoneIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", label: "Validate Email", icon: ShieldCheckIcon as any, iconName: "ShieldCheckIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", label: "Send Contract", icon: DocumentTextIcon, iconName: "DocumentTextIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", label: "Update Contract", icon: DocumentTextIcon, iconName: "DocumentTextIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", label: "Send Invoice", icon: Square2StackIcon, iconName: "Square2StackIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", label: "Update Invoice", icon: Square2StackIcon, iconName: "Square2StackIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", label: "Send Estimate", icon: CalculatorIcon as any, iconName: "CalculatorIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", label: "Update Estimate", icon: CalculatorIcon as any, iconName: "CalculatorIcon", color: "text-emerald-500", comingSoon: true },
      { type: "action", label: "Webhooks", icon: LinkIcon, iconName: "LinkIcon", color: "text-emerald-500", comingSoon: true },
    ],
  },
  {
    category: "Logic",
    value: "logic",
    items: [
      { type: "condition", label: "If / Else", icon: FunnelIcon, iconName: "FunnelIcon", color: "text-amber-500" },
      { type: "condition", label: "Split Test (A/B)", icon: ArrowPathIcon, iconName: "ArrowPathIcon", color: "text-amber-500" },
      { type: "delay", label: "Wait", icon: ClockIcon as any, iconName: "ClockIcon", color: "text-amber-500" },
      { type: "loopBack", label: "Loop Back To", icon: ArrowPathIcon, iconName: "ArrowPathIcon", color: "text-amber-500" },
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
