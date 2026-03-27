/**
 * Utility functions for drag-and-drop block creation
 */

import { EmailBlockType, SocialPlatform, HeadingLevel } from "../../types/enums";
import { EmailBlock, EmailBreakpointId } from "../../types";
import { EMAIL_BREAKPOINT_IDS, DEFAULT_HEADING_CONFIG, DEFAULT_TEXT_CONFIG, DEFAULT_BUTTON_CONFIG, DEFAULT_DIVIDER_CONFIG, BASE_BLOCK_STYLES, DEFAULT_IMAGE_CONFIG, DEFAULT_VIDEO_CONFIG, DEFAULT_COLUMNS_CONFIG, DEFAULT_SPACER_CONFIG, DEFAULT_HTML_CONFIG, DEFAULT_DISCOUNT_CODE_CONFIG, DEFAULT_MENU_CONFIG, DEFAULT_SOCIAL_LINKS_CONFIG } from "../../constants";

const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const getDefaultStylesForType = (blockType: EmailBlockType) => {
  switch (blockType) {
    case EmailBlockType.HEADING:
      return DEFAULT_HEADING_CONFIG;
    case EmailBlockType.TEXT:
      return DEFAULT_TEXT_CONFIG;
    case EmailBlockType.IMAGE:
      return DEFAULT_IMAGE_CONFIG;
    case EmailBlockType.VIDEO:
      return DEFAULT_VIDEO_CONFIG;
    case EmailBlockType.BUTTON:
      return DEFAULT_BUTTON_CONFIG;
    case EmailBlockType.COLUMNS:
      return DEFAULT_COLUMNS_CONFIG;
    case EmailBlockType.DIVIDER:
      return DEFAULT_DIVIDER_CONFIG;
    case EmailBlockType.SPACER:
      return DEFAULT_SPACER_CONFIG;
    case EmailBlockType.HTML:
      return DEFAULT_HTML_CONFIG;
    case EmailBlockType.DISCOUNT_CODE:
      return DEFAULT_DISCOUNT_CODE_CONFIG;
    case EmailBlockType.MENU:
      return DEFAULT_MENU_CONFIG;
    case EmailBlockType.SOCIAL_LINKS:
      return DEFAULT_SOCIAL_LINKS_CONFIG;
    default:
      return BASE_BLOCK_STYLES;
  }
};

const createResponsiveStyle = (baseStyle: Record<string, unknown>, initialBreakpoint: EmailBreakpointId) => {
  const style: Record<string, unknown> = {};
  EMAIL_BREAKPOINT_IDS.forEach((id) => {
    if (id === initialBreakpoint) {
      style[id] = { ...baseStyle };
    } else {
      style[id] = initialBreakpoint;
    }
  });
  return style;
};

const collectAllBlocks = (blocks: EmailBlock[]): EmailBlock[] => {
  const all: EmailBlock[] = [];

  const walk = (items: EmailBlock[]) => {
    items.forEach((block) => {
      all.push(block);

      if (block.type === EmailBlockType.COLUMNS) {
        block.columns.forEach((column) => {
          walk(column.blocks ?? []);
        });
      }
    });
  };

  walk(blocks);
  return all;
};

const generateBlockId = (blockType: EmailBlockType, existingBlocks: EmailBlock[] = []): string => {
  const allBlocks = collectAllBlocks(existingBlocks);
  const prefix = `${blockType}_`;

  const maxSuffix = allBlocks.reduce((max, block) => {
    if (!block.id.startsWith(prefix)) return max;

    const suffix = Number(block.id.slice(prefix.length));
    if (!Number.isInteger(suffix) || suffix < 1) return max;

    return Math.max(max, suffix);
  }, 0);

  return `${blockType}_${maxSuffix + 1}`;
};

export function createBlockFromType(
  blockType: EmailBlockType,
  label: string,
  existingBlocks: EmailBlock[] = [],
  activeBreakpoint: EmailBreakpointId = 'desktop',
  defaultBgColor?: string
): EmailBlock {
  const id = generateBlockId(blockType, existingBlocks);
  const baseDefaults = getDefaultStylesForType(blockType);
  const defaultStyles = defaultBgColor ? { ...baseDefaults, backgroundColor: defaultBgColor } : baseDefaults;

  switch (blockType) {
    case EmailBlockType.HEADING: {
      const { headingLevel, ...headingStyles } = defaultStyles as Record<string, any>;
      return {
        id,
        type: EmailBlockType.HEADING,
        content: label,
        headingLevel: (headingLevel as HeadingLevel) || HeadingLevel.H2,
        style: createResponsiveStyle(headingStyles, activeBreakpoint),
      };
    }

    case EmailBlockType.TEXT:
      return {
        id,
        type: EmailBlockType.TEXT,
        content: 'Enter your text here...',
        style: createResponsiveStyle(defaultStyles, activeBreakpoint),
      };

    case EmailBlockType.IMAGE:
      return {
        id,
        type: EmailBlockType.IMAGE,
        src: '',
        alt: 'Image',
        style: createResponsiveStyle(defaultStyles, activeBreakpoint),
      };

    case EmailBlockType.VIDEO:
      return {
        id,
        type: EmailBlockType.VIDEO,
        url: '',
        alt: 'Video',
        style: createResponsiveStyle(defaultStyles, activeBreakpoint),
      };

    case EmailBlockType.BUTTON:
      return {
        id,
        type: EmailBlockType.BUTTON,
        label: 'Click Here',
        url: '#',
        style: createResponsiveStyle(defaultStyles, activeBreakpoint),
      };

    case EmailBlockType.COLUMNS:
      return {
        id,
        type: EmailBlockType.COLUMNS,
        columns: [
          { id: makeId(), width: '50%', blocks: [] },
          { id: makeId(), width: '50%', blocks: [] },
        ],
        style: createResponsiveStyle(defaultStyles, activeBreakpoint),
      };

    case EmailBlockType.DIVIDER:
      return {
        id,
        type: EmailBlockType.DIVIDER,
        style: createResponsiveStyle(defaultStyles, activeBreakpoint),
      };

    case EmailBlockType.SPACER:
      return {
        id,
        type: EmailBlockType.SPACER,
        height: 20,
        style: createResponsiveStyle(defaultStyles, activeBreakpoint),
      };

    case EmailBlockType.HTML:
      return {
        id,
        type: EmailBlockType.HTML,
        content: '<p style="font-size: 16px; color: #333;">Custom HTML</p>',
        style: createResponsiveStyle(defaultStyles, activeBreakpoint),
      };

    case EmailBlockType.DISCOUNT_CODE:
      return {
        id,
        type: EmailBlockType.DISCOUNT_CODE,
        code: 'SAVE20',
        description: 'Use this code for 20% off',
        style: createResponsiveStyle(defaultStyles, activeBreakpoint),
      };

    case EmailBlockType.MENU:
      return {
        id,
        type: EmailBlockType.MENU,
        items: [
          { id: makeId(), label: 'Menu 1', url: '#' },
          { id: makeId(), label: 'Menu 2', url: '#' },
          { id: makeId(), label: 'Menu 3', url: '#' },
        ],
        style: createResponsiveStyle(defaultStyles, activeBreakpoint),
      };

    case EmailBlockType.SOCIAL_LINKS:
      return {
        id,
        type: EmailBlockType.SOCIAL_LINKS,
        links: [
          { id: makeId(), platform: SocialPlatform.FACEBOOK, url: '' },
          { id: makeId(), platform: SocialPlatform.TWITTER, url: '' },
          { id: makeId(), platform: SocialPlatform.INSTAGRAM, url: '' },
        ],
        style: createResponsiveStyle(defaultStyles, activeBreakpoint),
      };

    default:
      return {
        id,
        type: EmailBlockType.TEXT,
        content: label,
        style: createResponsiveStyle(defaultStyles, activeBreakpoint),
      };
  }
}
