/**
 * Email Block Type Definitions
 */

import { EmailBlockType, HeadingLevel, ButtonAction, SocialPlatform } from './enums';
import { BlockStyle } from './styles';

export interface BaseBlock {
  id: string;
  type: EmailBlockType;
  style?: BlockStyle;
}

export interface HeadingBlock extends BaseBlock {
  type: typeof EmailBlockType.HEADING;
  content: string;
  headingLevel?: HeadingLevel;
}

export interface TextBlock extends BaseBlock {
  type: typeof EmailBlockType.TEXT;
  content: string;
}

export interface ImageBlock extends BaseBlock {
  type: typeof EmailBlockType.IMAGE;
  src: string;
  alt?: string;
  linkUrl?: string;
  width?: number | string;
  height?: number | string;
}

export interface VideoBlock extends BaseBlock {
  type: typeof EmailBlockType.VIDEO;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
}

export interface ButtonBlock extends BaseBlock {
  type: typeof EmailBlockType.BUTTON;
  label: string;
  url: string;
  action?: ButtonAction;
}

export interface ColumnsBlock extends BaseBlock {
  type: typeof EmailBlockType.COLUMNS;
  columns: ColumnDef[];
}

export interface ColumnDef {
  id: string;
  width: string; // e.g., '50%', '33.33%'
  blocks: EmailBlock[];
}

export interface DividerBlock extends BaseBlock {
  type: typeof EmailBlockType.DIVIDER;
}

export interface SpacerBlock extends BaseBlock {
  type: typeof EmailBlockType.SPACER;
  height?: number;
}

export interface HtmlBlock extends BaseBlock {
  type: typeof EmailBlockType.HTML;
  content: string;
}

export interface DiscountCodeBlock extends BaseBlock {
  type: typeof EmailBlockType.DISCOUNT_CODE;
  code: string;
  description?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
}

export interface MenuBlock extends BaseBlock {
  type: typeof EmailBlockType.MENU;
  items: MenuItem[];
}

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
}

export interface SocialLinksBlock extends BaseBlock {
  type: typeof EmailBlockType.SOCIAL_LINKS;
  links: SocialLink[];
}

export type EmailBlock =
  | HeadingBlock
  | TextBlock
  | ImageBlock
  | VideoBlock
  | ButtonBlock
  | ColumnsBlock
  | DividerBlock
  | SpacerBlock
  | HtmlBlock
  | DiscountCodeBlock
  | MenuBlock
  | SocialLinksBlock;
