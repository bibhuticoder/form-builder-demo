/**
 * Form Builder Enums
 * All enumeration types for the form system
 */

export enum FormStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum FieldType {
  // Content Blocks
  HEADING = 'heading',
  PARAGRAPH = 'paragraph',
  DIVIDER = 'divider',
  IMAGE = 'image',
  VIDEO = 'video',

  // Input Fields
  TEXT = 'text',
  URL = 'url',
  EMAIL = 'email',
  PHONE = 'phone',
  NUMBER = 'number',
  TEXTAREA = 'textarea',
  DATE = 'date',
  TIME = 'time',
  DROPDOWN = 'dropdown',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  UPLOAD = 'upload',

  // Advanced / Utility
  CAPTCHA = 'captcha',
  BUTTON = 'button',
}

export enum FieldWidth {
  FULL = 'full',
  HALF = 'half',
  THIRD = 'third',
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
  JUSTIFY = 'justify',
}

export enum LogicEvent {
  FIELD_CHANGE = 'field.change',
  FIELD_BLUR = 'field.blur',
  SUBMISSION_ATTEMPT = 'submission.attempt',
  SUBMISSION_SUCCESS = 'submission.success',
  SUBMISSION_FAILURE = 'submission.failure',
  PAGE_ENTER = 'page.enter',
  PAGE_LEAVE = 'page.leave',
}

export enum LogicComparison {
  EQ = 'eq',
  NEQ = 'neq',
  CONTAINS = 'contains',
  IN = 'in',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  EXISTS = 'exists',
  IS_EMPTY = 'isEmpty',
  MATCHES_REGEX = 'matchesRegex',
}

export enum LogicOperation {
  AND = 'and',
  OR = 'or',
  NOT = 'not',
}

export enum LogicEffect {
  FIELD_VISIBILITY_SET = 'field.visibility.set',
  NAV_REDIRECT = 'nav.redirect',
  SUBMISSION_REJECT = 'submission.reject',
  UI_TOAST = 'ui.toast',
}

export enum ToastVariant {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export enum ButtonAction {
  SUBMIT = 'submit',
  RESET = 'reset',
  OPEN_URL = 'open_url',
  SCROLL_TO_ELEMENT = 'scroll_to_element',
  CUSTOM = 'custom',
}
