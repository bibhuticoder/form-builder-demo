/**
 * Utility functions for drag-and-drop block creation
 */

import { EmailBlockType, SocialPlatform, HeadingLevel } from "../../types/enums";
import { EmailBlock, EmailBreakpointId } from "../../types";
import { EMAIL_BREAKPOINT_IDS } from "../../constants";

const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const BASE_STYLES = {
  width: "full",
  paddingTop: 10,
  paddingRight: 10,
  paddingBottom: 10,
  paddingLeft: 10,
};

const TEXT_BLOCK_STYLES = {
  ...BASE_STYLES,
  fontSize: 14,
  fontSizeUnit: "px",
  fontWeight: "normal",
  fontFamily: "default",
  color: "#333333",
};

const HEADING_BLOCK_STYLES = {
  ...BASE_STYLES,
  fontWeight: "bold",
  fontFamily: "default",
  color: "#111827",
};

const BUTTON_BLOCK_STYLES = {
  ...BASE_STYLES,
  fontSize: 16,
  fontSizeUnit: "px",
  fontWeight: "bold",
  color: "#ffffff",
  backgroundColor: "#525df8",
  borderRadius: 4,
  textAlign: "center" as const,
  paddingTop: 12,
  paddingRight: 24,
  paddingBottom: 12,
  paddingLeft: 24,
};

const DIVIDER_BLOCK_STYLES = {
  ...BASE_STYLES,
  borderColor: "#cccccc",
  borderWidth: 1,
  borderStyle: "solid" as const,
};

const getDefaultStylesForType = (blockType: EmailBlockType) => {
  switch (blockType) {
    case EmailBlockType.HEADING:
      return HEADING_BLOCK_STYLES;
    case EmailBlockType.TEXT:
      return TEXT_BLOCK_STYLES;
    case EmailBlockType.BUTTON:
      return BUTTON_BLOCK_STYLES;
    case EmailBlockType.DIVIDER:
      return DIVIDER_BLOCK_STYLES;
    default:
      return BASE_STYLES;
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
  activeBreakpoint: EmailBreakpointId = 'desktop'
): EmailBlock {
  const id = generateBlockId(blockType, existingBlocks);
  const defaultStyles = getDefaultStylesForType(blockType);

  switch (blockType) {
    case EmailBlockType.HEADING:
      return {
        id,
        type: EmailBlockType.HEADING,
        content: label,
        headingLevel: HeadingLevel.H2,
        style: createResponsiveStyle(defaultStyles, activeBreakpoint),
      };

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
          { id: makeId(), platform: SocialPlatform.FACEBOOK, url: '#' },
          { id: makeId(), platform: SocialPlatform.TWITTER, url: '#' },
          { id: makeId(), platform: SocialPlatform.INSTAGRAM, url: '#' },
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
