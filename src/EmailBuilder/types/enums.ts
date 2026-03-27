/**
 * Email Builder Enums
 * All enumeration types for the email builder system
 */

export enum EmailStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  SENDING = 'sending',
  SENT = 'sent',
  PAUSED = 'paused',
}

export enum EmailBlockType {
  HEADING = 'heading',
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  BUTTON = 'button',
  COLUMNS = 'columns',
  DIVIDER = 'divider',
  SPACER = 'spacer',
  HTML = 'html',
  DISCOUNT_CODE = 'discount_code',
  MENU = 'menu',
  SOCIAL_LINKS = 'social_links',
}

export enum HeadingLevel {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
}

export enum TextAlign {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

export enum ButtonAction {
  OPEN_URL = 'open_url',
  MAILTO = 'mailto',
  TEL = 'tel',
}

export enum SocialPlatform {
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  INSTAGRAM = 'instagram',
  LINKEDIN = 'linkedin',
  YOUTUBE = 'youtube',
  TIKTOK = 'tiktok',
  PINTEREST = 'pinterest',
}

export enum EditorView {
  DESIGN = 'DESIGN',
  HTML = 'HTML',
}
