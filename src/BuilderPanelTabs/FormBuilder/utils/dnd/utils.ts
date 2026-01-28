/**
 * Utility functions for drag-and-drop field creation
 */

import { FieldType } from "../../../../types/enums";
import { Field } from "../../../../types";

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
export function createFieldFromType(fieldType: FieldType, label: string): Field {
  const id = makeId();
  const name = label.toLowerCase().replace(/\s+/g, "_");
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
      name,
      label,
      required: false,
      placeholder,
      options,
    } as Field;
  }

  // Return basic field for non-option types
  return {
    id,
    type: fieldType,
    name,
    label,
    required: false,
    placeholder,
  } as Field;
}
