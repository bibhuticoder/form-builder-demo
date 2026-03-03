import { SocialLinksBlock } from "../../../types";
import BuilderBlockWrapper from "./BuilderBlockWrapper";

interface BuilderSocialLinksProps {
  block: SocialLinksBlock;
  isSelected?: boolean;
  activeSubElement?: string | null;
}

const SOCIAL_ICONS: Record<string, string> = {
  facebook: 'FB',
  twitter: 'X',
  instagram: 'IG',
  linkedin: 'IN',
  youtube: 'YT',
  tiktok: 'TT',
  pinterest: 'PT',
};

export default function BuilderSocialLinks({ block, isSelected, activeSubElement }: Readonly<BuilderSocialLinksProps>) {
  return (
    <BuilderBlockWrapper block={block} isSelected={isSelected} activeSubElement={activeSubElement}>
      <div className={`flex items-center justify-center gap-3 ${isSelected && activeSubElement === 'content' ? 'ring-1 ring-primary ring-offset-1 rounded p-1' : ''}`}>
        {block.links.map((link) => (
          <div
            key={link.id}
            className="w-8 h-8 rounded-full bg-gray-600 dark:bg-gray-500 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
            title={link.platform}
          >
            <span className="text-white text-[10px] font-bold">
              {SOCIAL_ICONS[link.platform] || link.platform.charAt(0).toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </BuilderBlockWrapper>
  );
}
