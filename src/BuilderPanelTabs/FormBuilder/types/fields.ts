/**
 * Field Type Definitions
 * All specific field type definitions
 */

import { FieldType, HeadingLevel, ButtonAction } from './enums';
import { FieldStyle } from './styles';
import { FieldOption } from './field-option';

// ============================================================================
// FIELD BASE TYPES
// ============================================================================

export interface BaseField {
  id: string;
  type: FieldType;
  required?: boolean;
  style?: FieldStyle;
}

export interface LabeledField extends BaseField {
  label?: string;
}

export interface InputField extends LabeledField {
  name?: string;
  placeholder?: string;
  helpText?: string;
  disabled?: boolean;
}

// ============================================================================
// SPECIFIC FIELD TYPES
// ============================================================================

export interface HeadingField extends LabeledField {
  type: typeof FieldType.HEADING;
  label: string;
  headingLevel?: HeadingLevel;
}

export interface ParagraphField extends LabeledField {
  type: typeof FieldType.PARAGRAPH;
  label: string;
}

export interface DividerField extends BaseField {
  type: typeof FieldType.DIVIDER;
}

export interface ImageField extends LabeledField {
  type: typeof FieldType.IMAGE;
  url: string;
  altText?: string;
  caption?: string;
}

export interface VideoField extends LabeledField {
  type: typeof FieldType.VIDEO;
  url: string;
  altText?: string;
}

export interface TextField extends InputField {
  type: typeof FieldType.TEXT;
}

export interface UrlField extends InputField {
  type: typeof FieldType.URL;
}

export interface EmailField extends InputField {
  type: typeof FieldType.EMAIL;
}

export interface PhoneField extends InputField {
  type: typeof FieldType.PHONE;
}

export interface NumberField extends InputField {
  type: typeof FieldType.NUMBER;
  min?: number;
  max?: number;
  step?: number;
}

export interface TextAreaField extends InputField {
  type: typeof FieldType.TEXTAREA;
  rows?: number;
  cols?: number;
  maxLength?: number;
}

export interface DateField extends InputField {
  type: typeof FieldType.DATE;
  min?: string;
  max?: string;
  format?: string;
}

export interface TimeField extends InputField {
  type: typeof FieldType.TIME;
  format?: string;
}

export interface DropdownField extends InputField {
  type: typeof FieldType.DROPDOWN;
  options: FieldOption[];
  placeholder?: string;
}

export interface RadioField extends InputField {
  type: typeof FieldType.RADIO;
  options: FieldOption[];
}

export interface CheckboxField extends InputField {
  type: typeof FieldType.CHECKBOX;
  options: FieldOption[];
  selectionMode?: 'single' | 'multi';
}

export interface UploadField extends InputField {
  type: typeof FieldType.UPLOAD;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
}

export interface CaptchaField extends LabeledField {
  type: typeof FieldType.CAPTCHA;
  label: string;
  provider?: string;
}

export interface ButtonField extends LabeledField {
  type: typeof FieldType.BUTTON;
  label: string;
  action?: ButtonAction;
  targetUrl?: string; // For OPEN_URL
  scrollToElement?: string; // For SCROLL_TO_ELEMENT (element ID)
}

// Union type for all field types
export type Field =
  | HeadingField
  | ParagraphField
  | DividerField
  | ImageField
  | VideoField
  | TextField
  | UrlField
  | EmailField
  | PhoneField
  | NumberField
  | TextAreaField
  | DateField
  | TimeField
  | DropdownField
  | RadioField
  | CheckboxField
  | UploadField
  | CaptchaField
  | ButtonField;
