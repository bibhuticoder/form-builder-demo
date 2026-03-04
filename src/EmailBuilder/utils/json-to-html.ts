import { CSSProperties } from "react";
import {
    EmailTemplate,
    EmailBlock,
    EmailBlockType,
    HeadingLevel,
    ImageBlock,
    TextBlock,
    HeadingBlock,
    ButtonBlock,
    ColumnsBlock,
    SpacerBlock,
    HtmlBlock,
    SocialLinksBlock,
    MenuBlock,
    DiscountCodeBlock
} from "../types";
import { getBlockContainerStyles, getBlockContentStyles, getTemplateSettingsStyles } from "./styleUtils";

/**
 * Converts React CSSProperties to a standard inline CSS string
 */
const cssToStyleString = (css: CSSProperties): string => {
    return Object.entries(css)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => {
            const kebabKey = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
            return `${kebabKey}: ${value}`;
        })
        .join('; ');
};

/**
 * Truncates text for use in HTML comments
 */
const truncateText = (text: string, length: number = 30): string => {
    if (!text) return "";
    const cleaned = text.replace(/\s+/g, ' ').trim();
    if (cleaned.length <= length) return cleaned;
    return cleaned.substring(0, length) + '...';
};

/**
 * Generates an HTML comment for a block
 */
const getBlockComment = (block: EmailBlock): string => {
    let info = "";

    switch (block.type) {
        case EmailBlockType.HEADING:
        case EmailBlockType.TEXT:
        case EmailBlockType.HTML:
            info = (block as any).content || "";
            break;
        case EmailBlockType.BUTTON:
            info = (block as ButtonBlock).label || "";
            break;
        case EmailBlockType.IMAGE:
            info = (block as ImageBlock).alt || (block as ImageBlock).src || "";
            break;
        case EmailBlockType.COLUMNS:
            info = `${(block as ColumnsBlock).columns?.length || 0} cols`;
            break;
        case EmailBlockType.DISCOUNT_CODE:
            info = (block as DiscountCodeBlock).code || "";
            break;
        default:
            info = block.id;
    }

    return `<!-- [Block: ${block.type.toUpperCase()}] ${truncateText(info)} -->`;
};

/**
 * Renders an individual block to HTML
 */
const renderBlock = (block: EmailBlock): string => {
    const comment = getBlockComment(block);
    const containerStyle = cssToStyleString(getBlockContainerStyles(block.style));
    const contentStyle = cssToStyleString(getBlockContentStyles(block.style));

    let contentHtml = "";

    switch (block.type) {
        case EmailBlockType.HEADING: {
            const b = block as HeadingBlock;
            const tag = b.headingLevel || HeadingLevel.H1;
            contentHtml = `<${tag} style="${contentStyle}">${b.content}</${tag}>`;
            break;
        }
        case EmailBlockType.TEXT: {
            const b = block as TextBlock;
            contentHtml = `<div style="${contentStyle}">${b.content}</div>`;
            break;
        }
        case EmailBlockType.IMAGE: {
            const b = block as ImageBlock;
            const imgHtml = `<img src="${b.src}" alt="${b.alt || ''}" style="display: block; max-width: 100%; height: auto; ${contentStyle}" />`;
            contentHtml = b.linkUrl ? `<a href="${b.linkUrl}" target="_blank">${imgHtml}</a>` : imgHtml;
            break;
        }
        case EmailBlockType.BUTTON: {
            const b = block as ButtonBlock;
            contentHtml = `<a href="${b.url}" target="_blank" style="display: inline-block; text-decoration: none; ${contentStyle}">${b.label}</a>`;
            break;
        }
        case EmailBlockType.DIVIDER: {
            contentHtml = `<hr style="border: none; border-top: 1px solid #eaeaea; width: 100%; ${contentStyle}" />`;
            break;
        }
        case EmailBlockType.SPACER: {
            const b = block as SpacerBlock;
            contentHtml = `<div style="height: ${b.height || 20}px; line-height: ${b.height || 20}px;">&nbsp;</div>`;
            break;
        }
        case EmailBlockType.HTML: {
            const b = block as HtmlBlock;
            contentHtml = b.content;
            break;
        }
        case EmailBlockType.COLUMNS: {
            const b = block as ColumnsBlock;
            const cols = (b.columns || []).map(col => {
                const colBlocks = col.blocks.map(childBlock => renderBlock(childBlock)).join('\n');
                return `<td width="${col.width}" valign="top" style="padding: 0;">${colBlocks}</td>`;
            }).join('');
            contentHtml = `<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr>${cols}</tr></table>`;
            break;
        }
        case EmailBlockType.SOCIAL_LINKS: {
            const b = block as SocialLinksBlock;
            const links = (b.links || []).map(link =>
                `<a href="${link.url}" target="_blank" style="margin: 0 5px; text-decoration: none;">${link.platform}</a>`
            ).join('');
            contentHtml = `<div style="${contentStyle}">${links}</div>`;
            break;
        }
        case EmailBlockType.MENU: {
            const b = block as MenuBlock;
            const items = (b.items || []).map(item =>
                `<a href="${item.url}" target="_blank" style="margin: 0 10px; text-decoration: none; ${contentStyle}">${item.label}</a>`
            ).join('');
            contentHtml = `<div style="text-align: center;">${items}</div>`;
            break;
        }
        case EmailBlockType.DISCOUNT_CODE: {
            const b = block as DiscountCodeBlock;
            contentHtml = `<div style="border: 2px dashed #ccc; padding: 15px; text-align: center; ${contentStyle}">
            <div style="font-size: 14px; margin-bottom: 5px;">${b.description || 'Your Discount Code'}</div>
            <div style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${b.code}</div>
        </div>`;
            break;
        }
        default:
            contentHtml = `<!-- Unsupported block type: ${block.type} -->`;
    }

    return `
${comment}
<div style="${containerStyle}">
  ${contentHtml}
</div>`;
};

/**
 * Main function to convert an EmailTemplate JSON to a full HTML snippet for email services
 */
export const jsonToHtml = (template: EmailTemplate): string => {
    const { templateSettings, blocks } = template;

    // Resolve outer body and inner content styles
    const bodyBgColor = (templateSettings.settings as any)?.bodyBg || '#ffffff';
    const contentStyle = cssToStyleString(getTemplateSettingsStyles(templateSettings.settings as any));
    const fontFamily = (templateSettings.settings as any)?.fontFamily || 'Arial, sans-serif';

    const renderedBlocks = blocks.map(block => renderBlock(block)).join('\n');

    // We use a 100% width table as the "body" wrapper to ensure background colors 
    // and fonts work even if the ESP strips <html> or <body> tags.
    return `<!-- EMAIL START -->
<table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="${bodyBgColor}" style="background-color: ${bodyBgColor}; font-family: ${fontFamily}; width: 100%; height: 100%; border-collapse: collapse; margin: 0; padding: 0;">
  <tr>
    <td align="center" valign="top" style="padding: 20px 0;">
      <!--[if (gte mso 9)|(IE)]>
      <table align="center" border="0" cellspacing="0" cellpadding="0" width="${(templateSettings.settings as any).contentWidth || 600}">
      <tr>
      <td align="center" valign="top" width="${(templateSettings.settings as any).contentWidth || 600}">
      <![endif]-->
      
      <!-- CONTENT CONTAINER -->
      <table border="0" cellspacing="0" cellpadding="0" style="${contentStyle} margin: 0 auto; width: 100%; max-width: ${(templateSettings.settings as any).contentWidth || 600}px;">
        <tr>
          <td>
            ${renderedBlocks}
          </td>
        </tr>
      </table>
      
      <!--[if (gte mso 9)|(IE)]>
      </td>
      </tr>
      </table>
      <![endif]-->
    </td>
  </tr>
</table>
<!-- EMAIL END -->`;
};
