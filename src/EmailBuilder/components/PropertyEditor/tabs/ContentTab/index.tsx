import React from "react";
import {
  EmailBlock,
  EmailBlockType,
  HeadingBlock,
  TextBlock,
  ImageBlock,
  VideoBlock,
  ButtonBlock,
  SpacerBlock,
  HtmlBlock,
  DiscountCodeBlock,
  MenuBlock,
  SocialLinksBlock,
  SocialPlatform,
  HeadingLevel,
} from "../../../../types";
import { useEmailBuilder } from "../../../../context";

interface ContentTabProps {
  block: EmailBlock;
}

export const ContentTab: React.FC<ContentTabProps> = ({ block }) => {
  const { updateBlock } = useEmailBuilder();

  const handleUpdate = (key: string, value: unknown) => {
    updateBlock(block.id, { [key]: value } as Partial<EmailBlock>);
  };

  const labelClass = "text-[10px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1";
  const inputClass = "shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary";
  const selectClass = "shadow w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary";
  const textareaClass = `${inputClass} resize-y min-h-[80px]`;
  const sectionTitle = "text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3";

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h4 className={sectionTitle}>Block Content</h4>
        {/* Heading */}
        {block.type === EmailBlockType.HEADING && (
          <>
            <div>
              <label className={labelClass}>Content</label>
              <input
                type="text"
                value={(block as HeadingBlock).content}
                onChange={(e) => handleUpdate("content", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Heading Level</label>
              <select
                value={(block as HeadingBlock).headingLevel || "h2"}
                onChange={(e) => handleUpdate("headingLevel", e.target.value)}
                className={selectClass}
              >
                {Object.values(HeadingLevel).map((level) => (
                  <option key={level} value={level}>{level.toUpperCase()}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Text */}
        {block.type === EmailBlockType.TEXT && (
          <div>
            <label className={labelClass}>Content</label>
            <textarea
              value={(block as TextBlock).content}
              onChange={(e) => handleUpdate("content", e.target.value)}
              className={textareaClass}
              rows={4}
            />
          </div>
        )}

        {/* Image */}
        {block.type === EmailBlockType.IMAGE && (
          <>
            <div>
              <label className={labelClass}>Image URL</label>
              <input
                type="text"
                value={(block as ImageBlock).src}
                onChange={(e) => handleUpdate("src", e.target.value)}
                className={selectClass}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className={labelClass}>Alt Text</label>
              <input
                type="text"
                value={(block as ImageBlock).alt || ""}
                onChange={(e) => handleUpdate("alt", e.target.value)}
                className={selectClass}
              />
            </div>
            <div>
              <label className={labelClass}>Link URL</label>
              <input
                type="text"
                value={(block as ImageBlock).linkUrl || ""}
                onChange={(e) => handleUpdate("linkUrl", e.target.value)}
                className={selectClass}
                placeholder="https://..."
              />
            </div>
          </>
        )}

        {/* Video */}
        {block.type === EmailBlockType.VIDEO && (
          <>
            <div>
              <label className={labelClass}>Video URL</label>
              <input
                type="text"
                value={(block as VideoBlock).url}
                onChange={(e) => handleUpdate("url", e.target.value)}
                className={selectClass}
                placeholder="YouTube or Vimeo URL"
              />
            </div>
            <div>
              <label className={labelClass}>Thumbnail URL</label>
              <input
                type="text"
                value={(block as VideoBlock).thumbnailUrl || ""}
                onChange={(e) => handleUpdate("thumbnailUrl", e.target.value)}
                className={selectClass}
                placeholder="https://..."
              />
            </div>
          </>
        )}

        {/* Button */}
        {block.type === EmailBlockType.BUTTON && (
          <>
            <div>
              <label className={labelClass}>Label</label>
              <input
                type="text"
                value={(block as ButtonBlock).label}
                onChange={(e) => handleUpdate("label", e.target.value)}
                className={selectClass}
              />
            </div>
            <div>
              <label className={labelClass}>URL</label>
              <input
                type="text"
                value={(block as ButtonBlock).url}
                onChange={(e) => handleUpdate("url", e.target.value)}
                className={selectClass}
                placeholder="https://..."
              />
            </div>
          </>
        )}

        {/* Spacer */}
        {block.type === EmailBlockType.SPACER && (
          <div>
            <label className={labelClass}>Height (px)</label>
            <input
              type="number"
              value={(block as SpacerBlock).height || 20}
              onChange={(e) => handleUpdate("height", parseInt(e.target.value) || 20)}
              className={selectClass}
              min={1}
              max={200}
            />
          </div>
        )}

        {/* HTML */}
        {block.type === EmailBlockType.HTML && (
          <div>
            <label className={labelClass}>HTML Content</label>
            <textarea
              value={(block as HtmlBlock).content}
              onChange={(e) => handleUpdate("content", e.target.value)}
              className={`${textareaClass} font-mono text-xs`}
              rows={8}
            />
          </div>
        )}

        {/* Discount Code */}
        {block.type === EmailBlockType.DISCOUNT_CODE && (
          <>
            <div>
              <label className={labelClass}>Discount Code</label>
              <input
                type="text"
                value={(block as DiscountCodeBlock).code}
                onChange={(e) => handleUpdate("code", e.target.value)}
                className={selectClass}
              />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <input
                type="text"
                value={(block as DiscountCodeBlock).description || ""}
                onChange={(e) => handleUpdate("description", e.target.value)}
                className={selectClass}
              />
            </div>
          </>
        )}

        {/* Menu */}
        {block.type === EmailBlockType.MENU && (
          <div className="space-y-3">
            <label className={labelClass}>Menu Items</label>
            {(block as MenuBlock).items.map((item, index) => (
              <div key={item.id} className="space-y-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => {
                    const newItems = [...(block as MenuBlock).items];
                    newItems[index] = { ...item, label: e.target.value };
                    handleUpdate("items", newItems);
                  }}
                  className={selectClass}
                  placeholder="Label"
                />
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => {
                    const newItems = [...(block as MenuBlock).items];
                    newItems[index] = { ...item, url: e.target.value };
                    handleUpdate("items", newItems);
                  }}
                  className={selectClass}
                  placeholder="URL"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newItems = [...(block as MenuBlock).items, { id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, label: 'Link', url: '#' }];
                handleUpdate("items", newItems);
              }}
              className="text-xs text-primary hover:underline"
            >
              + Add Item
            </button>
          </div>
        )}

        {/* Social Links */}
        {block.type === EmailBlockType.SOCIAL_LINKS && (
          <div className="space-y-3">
            <label className={labelClass}>Social Links</label>
            {(block as SocialLinksBlock).links.map((link, index) => (
              <div key={link.id} className="space-y-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <select
                  value={link.platform}
                  onChange={(e) => {
                    const newLinks = [...(block as SocialLinksBlock).links];
                    newLinks[index] = { ...link, platform: e.target.value as SocialPlatform };
                    handleUpdate("links", newLinks);
                  }}
                  className={selectClass}
                >
                  {Object.values(SocialPlatform).map((platform) => (
                    <option key={platform} value={platform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => {
                    const newLinks = [...(block as SocialLinksBlock).links];
                    newLinks[index] = { ...link, url: e.target.value };
                    handleUpdate("links", newLinks);
                  }}
                  className={inputClass}
                  placeholder="URL"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newLinks = [...(block as SocialLinksBlock).links, { id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`, platform: SocialPlatform.FACEBOOK, url: '#' }];
                handleUpdate("links", newLinks);
              }}
              className="text-xs text-primary hover:underline"
            >
              + Add Link
            </button>
          </div>
        )}

        {/* Divider - minimal content options */}
        {block.type === EmailBlockType.DIVIDER && (
          <div className="text-xs text-gray-500 dark:text-gray-400 py-4 text-center">
            Use the Style tab to customize the divider appearance.
          </div>
        )}

        {/* Columns - minimal content options */}
        {block.type === EmailBlockType.COLUMNS && (
          <div className="text-xs text-gray-500 dark:text-gray-400 py-4 text-center">
            Drag blocks into the columns on the canvas to add content.
          </div>
        )}
      </div>
    </div>
  );
};
