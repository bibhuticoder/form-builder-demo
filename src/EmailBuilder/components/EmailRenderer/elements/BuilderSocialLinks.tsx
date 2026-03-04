import { SocialLinksBlock } from "../../../types"
import BuilderBlockWrapper from "./BuilderBlockWrapper"

interface BuilderSocialLinksProps {
  block: SocialLinksBlock
  isSelected?: boolean
  activeSubElement?: string | null
}

const getSocialIcon = (platform: string) => {
  const iconClassName = "w-4 h-4 text-white"

  switch (platform) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className={iconClassName} fill="currentColor" aria-hidden="true">
          <path d="M13.5 21v-7h2.3l.5-3H13.5V9.2c0-.9.3-1.5 1.6-1.5h1.3V5c-.2 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.7V11H8.5v3h2.3v7h2.7Z" />
        </svg>
      )
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" className={iconClassName} fill="currentColor" aria-hidden="true">
          <path d="M18.9 3h2.9l-6.4 7.3L23 21h-6l-4.7-6.2L6.8 21H3.9l6.8-7.8L1 3h6.1l4.2 5.7L18.9 3Zm-1 16.3h1.7L6.2 4.6H4.4l13.5 14.7Z" />
        </svg>
      )
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={iconClassName} fill="currentColor" aria-hidden="true">
          <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 1.9A3.9 3.9 0 0 0 3.9 7.8v8.4a3.9 3.9 0 0 0 3.9 3.9h8.4a3.9 3.9 0 0 0 3.9-3.9V7.8a3.9 3.9 0 0 0-3.9-3.9H7.8Zm9.3 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.9a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Z" />
        </svg>
      )
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className={iconClassName} fill="currentColor" aria-hidden="true">
          <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5 2.5 2.5 0 0 1 4.98 3.5ZM3.5 9h3V21h-3V9Zm5.5 0h2.9v1.7h.1c.4-.8 1.4-1.9 3-1.9 3.2 0 3.8 2.1 3.8 4.8V21h-3v-6.1c0-1.5 0-3.4-2.1-3.4s-2.4 1.6-2.4 3.3V21H9V9Z" />
        </svg>
      )
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className={iconClassName} fill="currentColor" aria-hidden="true">
          <path d="M21.6 7.2a2.9 2.9 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.9 2.9 0 0 0-2 2C2 9 2 12 2 12s0 3 .4 4.8a2.9 2.9 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.9 2.9 0 0 0 2-2c.4-1.8.4-4.8.4-4.8s0-3-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
        </svg>
      )
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className={iconClassName} fill="currentColor" aria-hidden="true">
          <path d="M14.4 3h2.3c.2 1.8 1.2 3.4 2.9 4.2v2.4a7.1 7.1 0 0 1-2.8-.8v5.2a5.9 5.9 0 1 1-5.1-5.8v2.5a3.4 3.4 0 1 0 2.7 3.3V3Z" />
        </svg>
      )
    case "pinterest":
      return (
        <svg viewBox="0 0 24 24" className={iconClassName} fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-3.7 19.3l1.3-4.8c-.3-.7-.6-1.8-.6-2.9 0-2.6 1.5-4.6 3.5-4.6 1.6 0 2.4 1.2 2.4 2.7 0 1.6-1 4.1-1.5 6.4-.4 1.9 1 3.5 2.9 3.5 3.5 0 5.8-4.5 5.8-9.8 0-4.1-2.8-7.1-7.9-7.1-5.8 0-9.5 4.4-9.5 9.1 0 1.7.5 2.9 1.2 3.8.3.4.3.6.2 1l-.4 1.6c-.1.5-.5.7-1 .5-2.7-1.1-3.9-4.1-3.9-7.4C1 7 5.5 2 12 2Z" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" className={iconClassName} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14.5 14.5 0 0 1 0 18" />
          <path d="M12 3a14.5 14.5 0 0 0 0 18" />
        </svg>
      )
  }
}

export default function BuilderSocialLinks({ block, isSelected, activeSubElement }: Readonly<BuilderSocialLinksProps>) {
  return (
    <BuilderBlockWrapper block={block} isSelected={isSelected} activeSubElement={activeSubElement}>
      <div className={`flex items-center justify-center gap-3 ${isSelected && activeSubElement === "content" ? "ring-1 ring-primary ring-offset-1 rounded p-1" : ""}`}>
        {block.links.map((link) => (
          <div key={link.id} className="w-8 h-8 rounded-full bg-gray-600 dark:bg-gray-500 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity" title={link.platform}>
            {getSocialIcon(link.platform)}
          </div>
        ))}
      </div>
    </BuilderBlockWrapper>
  )
}
