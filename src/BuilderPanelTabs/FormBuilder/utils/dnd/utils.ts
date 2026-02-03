/**
 * Utility functions for drag-and-drop field creation
 */

import { FieldType } from "../../types/enums";
import { Field } from "../../types";

/**
 * Generates a unique ID combining timestamp and random string
 * Format: base36_timestamp-random_hash
 */
const makeId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * Creates a new field instance with default values based on field type
 * 
 * @param fieldType - The type of field to create
 * @param label - Display label for the field
 * @returns A new field object with appropriate defaults and structure
 * 
 * @remarks
 * - Generates a sanitized name from the label (lowercase, underscores)
 * - Adds default options for CHECKBOX, RADIO, and DROPDOWN types
 * - Sets common defaults: required=false, placeholder based on label
 */
// Base styles that all fields get
const BASE_STYLES = {
  width: "full",
  windowMarginBottom: 0,
  windowPaddingTop: 0,
  windowPaddingRight: 0,
  windowPaddingBottom: 0,
  windowPaddingLeft: 0,
};

// Styles for display-only fields (heading, paragraph, divider, image, video)
const DISPLAY_FIELD_STYLES = {
  ...BASE_STYLES,
  inputFontSize: 14,
  inputFontSizeUnit: "px",
  inputFontWeight: "normal",
  inputFontFamily: "default",
  inputColor: "#111827",
};

// Styles specifically for Headings (h1-h6) to allow their natural size to take precedence
// unless explicitly overridden by the user.
const HEADING_FIELD_STYLES = {
  ...BASE_STYLES,
  // We explicitly DO NOT set inputFontSize here so that the h1-h6 tags control the size
  inputFontWeight: "bold", // Headings are usually bold
  inputFontFamily: "default",
  inputColor: "#111827",
};

// Styles specifically for Divider
const DIVIDER_FIELD_STYLES = {
  ...DISPLAY_FIELD_STYLES,
  borderColor: "#000000",
  borderWidth: 1,
};

// Full styles for input fields
const INPUT_FIELD_STYLES = {
  ...DISPLAY_FIELD_STYLES,
  // Label Typography
  labelFontSize: 14,
  labelFontSizeUnit: "px",
  labelFontWeight: "medium",
  labelFontFamily: "default",
  labelColor: "#374151",

  // Help Text Typography
  helpFontSize: 12,
  helpFontSizeUnit: "px",
  helpFontWeight: "normal",
  helpFontFamily: "default",
  helpColor: "#6b7280",

  // Input Decoration
  inputBackgroundColor: "#ffffff",
  inputBorderColor: "#d1d5db",
  inputBorderWidth: 1,
  inputBorderRadius: 6,

  // Spacing (Input)
  inputPaddingTop: 8,
  inputPaddingRight: 12,
  inputPaddingBottom: 8,
  inputPaddingLeft: 12,
  inputMarginTop: 0,
  inputMarginRight: 0,
  inputMarginBottom: 0,
  inputMarginLeft: 0,
};

// Helper to get appropriate default styles based on field type
const getDefaultStylesForType = (fieldType: FieldType) => {
  // Display-only fields

  if (fieldType === FieldType.HEADING) {
    return HEADING_FIELD_STYLES;
  }

  if (fieldType === FieldType.DIVIDER) {
    return DIVIDER_FIELD_STYLES;
  }

  if ([
    FieldType.PARAGRAPH,
    FieldType.IMAGE,
    FieldType.VIDEO,
    FieldType.BUTTON,
    FieldType.CAPTCHA,
  ].includes(fieldType)) {
    return DISPLAY_FIELD_STYLES;
  }

  // Input fields get full styles
  return INPUT_FIELD_STYLES;
};


/**
 * Generates a semantic ID for a field based on its type and existing fields
 * Format: fieldtype_count (e.g., "heading_3" for the 3rd heading)
 */
const generateFieldId = (fieldType: FieldType, existingFields: Field[] = []): string => {
  // Count how many fields of this type already exist
  const count = existingFields.filter(f => f.type === fieldType).length + 1;
  return `${fieldType}_${count}`;
};

export function createFieldFromType(
  fieldType: FieldType,
  label: string,
  existingFields: Field[] = []
): Field {
  const id = generateFieldId(fieldType, existingFields);
  const placeholder = `Enter ${label.toLowerCase()}`;

  // Option-based fields need default choices
  if (fieldType === FieldType.CHECKBOX || fieldType === FieldType.RADIO || fieldType === FieldType.DROPDOWN) {
    const options = [
      { id: makeId(), label: "Option 1", value: "option1" },
      { id: makeId(), label: "Option 2", value: "option2" },
    ];

    // Return properly typed option-based field
    return {
      id,
      type: fieldType,
      label,
      required: false,
      placeholder,
      options,
      style: { ...getDefaultStylesForType(fieldType) },
    } as Field;
  }

  // Heading fields need a headingLevel property
  if (fieldType === FieldType.HEADING) {
    return {
      id,
      type: fieldType,
      label,
      headingLevel: "h2", // Default to h2
      style: { ...getDefaultStylesForType(fieldType) },
    } as Field;
  }

  // Return basic field for non-option types
  return {
    id,
    type: fieldType,
    label,
    required: false,
    placeholder,
    style: { ...getDefaultStylesForType(fieldType) },
  } as Field;
}
