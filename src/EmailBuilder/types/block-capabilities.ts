/**
 * Block Style Capabilities
 * Defines which style/content options each block type supports
 */

import { EmailBlockType } from './enums';

export interface BlockStyleCapabilities {
  supportsText: boolean;
  supportsImage: boolean;
  supportsLink: boolean;
  supportsAlignment: boolean;
  supportsPadding: boolean;
  supportsBackgroundColor: boolean;
  supportsBorder: boolean;
  supportsTypography: boolean;
}

export const BLOCK_CAPABILITIES: Record<EmailBlockType, BlockStyleCapabilities> = {
  [EmailBlockType.HEADING]: {
    supportsText: true,
    supportsImage: false,
    supportsLink: false,
    supportsAlignment: true,
    supportsPadding: true,
    supportsBackgroundColor: true,
    supportsBorder: false,
    supportsTypography: true,
  },
  [EmailBlockType.TEXT]: {
    supportsText: true,
    supportsImage: false,
    supportsLink: false,
    supportsAlignment: true,
    supportsPadding: true,
    supportsBackgroundColor: true,
    supportsBorder: false,
    supportsTypography: true,
  },
  [EmailBlockType.IMAGE]: {
    supportsText: false,
    supportsImage: true,
    supportsLink: true,
    supportsAlignment: true,
    supportsPadding: true,
    supportsBackgroundColor: false,
    supportsBorder: true,
    supportsTypography: false,
  },
  [EmailBlockType.VIDEO]: {
    supportsText: false,
    supportsImage: false,
    supportsLink: true,
    supportsAlignment: true,
    supportsPadding: true,
    supportsBackgroundColor: false,
    supportsBorder: false,
    supportsTypography: false,
  },
  [EmailBlockType.BUTTON]: {
    supportsText: true,
    supportsImage: false,
    supportsLink: true,
    supportsAlignment: true,
    supportsPadding: true,
    supportsBackgroundColor: true,
    supportsBorder: true,
    supportsTypography: true,
  },
  [EmailBlockType.COLUMNS]: {
    supportsText: false,
    supportsImage: false,
    supportsLink: false,
    supportsAlignment: false,
    supportsPadding: true,
    supportsBackgroundColor: true,
    supportsBorder: false,
    supportsTypography: false,
  },
  [EmailBlockType.DIVIDER]: {
    supportsText: false,
    supportsImage: false,
    supportsLink: false,
    supportsAlignment: false,
    supportsPadding: true,
    supportsBackgroundColor: false,
    supportsBorder: true,
    supportsTypography: false,
  },
  [EmailBlockType.SPACER]: {
    supportsText: false,
    supportsImage: false,
    supportsLink: false,
    supportsAlignment: false,
    supportsPadding: false,
    supportsBackgroundColor: false,
    supportsBorder: false,
    supportsTypography: false,
  },
  [EmailBlockType.HTML]: {
    supportsText: true,
    supportsImage: false,
    supportsLink: false,
    supportsAlignment: false,
    supportsPadding: true,
    supportsBackgroundColor: true,
    supportsBorder: false,
    supportsTypography: false,
  },
  [EmailBlockType.DISCOUNT_CODE]: {
    supportsText: true,
    supportsImage: false,
    supportsLink: false,
    supportsAlignment: true,
    supportsPadding: true,
    supportsBackgroundColor: true,
    supportsBorder: true,
    supportsTypography: true,
  },
  [EmailBlockType.MENU]: {
    supportsText: true,
    supportsImage: false,
    supportsLink: true,
    supportsAlignment: true,
    supportsPadding: true,
    supportsBackgroundColor: true,
    supportsBorder: false,
    supportsTypography: true,
  },
  [EmailBlockType.SOCIAL_LINKS]: {
    supportsText: false,
    supportsImage: false,
    supportsLink: true,
    supportsAlignment: true,
    supportsPadding: true,
    supportsBackgroundColor: true,
    supportsBorder: false,
    supportsTypography: false,
  },
};

export function getBlockCapabilities(blockType: EmailBlockType): BlockStyleCapabilities {
  return BLOCK_CAPABILITIES[blockType];
}
