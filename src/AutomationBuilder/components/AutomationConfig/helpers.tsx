import type { ReactNode } from "react"
import type { Node } from "reactflow"
import {
  TagIcon,
  EnvelopeIcon,
  UserCircleIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  ClipboardDocumentIcon,
  CakeIcon,
  BellIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowPathIcon,
  FunnelIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  BoltIcon
} from "@heroicons/react/24/outline"
import { TOOLBOX_ITEMS } from "../../constants"

// --- Icons ---

export const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
  </svg>
)

export const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
)

export const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.248h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

export const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31 0 2.568.32 3.67.89a9.6 9.6 0 0 0-1.34 3.65 9.6 9.6 0 0 0-3.65 1.34 9.6 9.6 0 0 1-.89-3.67c0-.13-.01-.26-.01-.39v.03z"></path>
    <path d="M9 0h4v16a3 3 0 1 1-3-3v4a1 1 0 1 0 1 1V0z"></path>
    <path d="M13 0c0 4.5 3.5 8 8 8v-4c-2.2 0-4-1.8-4-4h-4z"></path>
  </svg>
)

// --- Mock Data ---

export const USERS = [
  { id: 'u1', name: 'John Doe', email: 'john@example.com' },
  { id: 'u2', name: 'Jane Smith', email: 'jane@example.com' },
  { id: 'u3', name: 'Harry Potter', email: 'harry@potter.com' },
];

export const TEAMS = [
  { id: 't1', name: 'Sales Team' },
  { id: 't2', name: 'Marketing Team' },
  { id: 't3', name: 'Customer Success' },
];

export const AUTOMATIONS = [
  { id: 'a1', name: 'Onboarding Sequence' },
  { id: 'a2', name: 'Re-engagement Campaign' },
  { id: 'a3', name: 'Webinar Follow-up' },
];

export const MOCK_TAGS = [
  { id: 'tag1', label: 'new-lead' },
  { id: 'tag2', label: 'customer' },
  { id: 'tag3', label: 'vip' },
  { id: 'tag4', label: 'churned' },
  { id: 'tag5', label: 'interested' },
];

export const CHANNELS = [
  { id: 'sms', name: 'SMS' },
  { id: 'email', name: 'Email' },
  { id: 'call', name: 'Calls' },
  { id: 'fb', name: 'Facebook' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'tiktok', name: 'TikTok' },
];

export const INSTAGRAM_ACCOUNTS = [
  { id: 'ig1', handle: 'cleave_official' },
  { id: 'ig2', handle: 'bibhuti_p' },
];

// --- Helper Functions ---

export const restoreIconIfMissing = (node: Node) => {
  if (!node) return null
  const data = node.data || {}
  if (data.icon) return data.icon

  const label = data.label || ""

  // 1. Direct match
  for (const group of TOOLBOX_ITEMS) {
    const found = group.items.find(i => i.label === label)
    if (found) return found.icon
  }

  // 2. Fuzzy match (keyword based)
  const lowerLabel = label.toLowerCase()
  if (lowerLabel.includes("tag")) return TagIcon
  if (lowerLabel.includes("email")) return EnvelopeIcon
  if (lowerLabel.includes("sms")) return PhoneIcon
  if (lowerLabel.includes("notification")) return BellIcon
  if (lowerLabel.includes("contact")) return UserCircleIcon
  if (lowerLabel.includes("company")) return BuildingOffice2Icon
  if (lowerLabel.includes("task")) return CheckCircleIcon
  if (lowerLabel.includes("note")) return ClipboardDocumentIcon
  if (lowerLabel.includes("birthday")) return CakeIcon
  if (lowerLabel.includes("dnd") || lowerLabel.includes("disturb")) return BellIcon
  if (lowerLabel.includes("dm") || lowerLabel.includes("message")) return PaperAirplaneIcon
  if (lowerLabel.includes("comment")) return DocumentTextIcon
  if (lowerLabel.includes("call")) return PhoneIcon
  if (lowerLabel.includes("score")) return ChartBarIcon
  if (lowerLabel.includes("wait") || lowerLabel.includes("delay")) return ClockIcon
  if (lowerLabel.includes("split") || lowerLabel.includes("test")) return ArrowPathIcon
  if (lowerLabel.includes("if") || lowerLabel.includes("else")) return FunnelIcon
  if (lowerLabel.includes("loop")) return ArrowPathIcon
  if (lowerLabel.includes("slack") || lowerLabel.includes("teams")) return ChatBubbleLeftRightIcon
  if (lowerLabel.includes("deal") || lowerLabel.includes("pipeline")) return BriefcaseIcon
  if (lowerLabel.includes("invoice") || lowerLabel.includes("estimate") || lowerLabel.includes("contract")) return DocumentTextIcon

  return BoltIcon // Standard fallback
}

export const ScrollWrapper = ({ children }: { children: ReactNode }) => (
  <div className="max-h-[min(70vh,500px)] overflow-y-auto pr-2 -mr-2 scrollbar-thin">
    {children}
  </div>
)
