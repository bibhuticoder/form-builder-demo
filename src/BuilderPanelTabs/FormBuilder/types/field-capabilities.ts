/**
 * Field Style Capabilities
 * Defines which style categories each field type supports
 */

import { FieldType } from './enums';

export interface FieldStyleCapabilities {
    // Style capabilities
    supportsInputStyles: boolean;
    supportsWindowStyles: boolean;
    supportsLabelStyles: boolean;
    supportsPlaceholderStyles: boolean;
    supportsHelpStyles: boolean;

    // Content capabilities
    hasLabel: boolean;
    hasPlaceholder: boolean;
    hasRequired: boolean;
    hasHelpText: boolean;
    hasOptions: boolean;
}

/**
 * Field capability mappings
 * Defines which style categories are available for each field type
 */
export const FIELD_CAPABILITIES: Record<FieldType, FieldStyleCapabilities> = {
    // Display-only fields - only support window styles
    [FieldType.HEADING]: {
        supportsInputStyles: false,
        supportsWindowStyles: true,
        supportsLabelStyles: false,
        supportsPlaceholderStyles: false,
        supportsHelpStyles: false,
        hasLabel: true,
        hasPlaceholder: false,
        hasRequired: false,
        hasHelpText: false,
        hasOptions: false,
    },
    [FieldType.PARAGRAPH]: {
        supportsInputStyles: false,
        supportsWindowStyles: true,
        supportsLabelStyles: false,
        supportsPlaceholderStyles: false,
        supportsHelpStyles: false,
        hasLabel: true,
        hasPlaceholder: false,
        hasRequired: false,
        hasHelpText: false,
        hasOptions: false,
    },
    [FieldType.DIVIDER]: {
        supportsInputStyles: false,
        supportsWindowStyles: true,
        supportsLabelStyles: false,
        supportsPlaceholderStyles: false,
        supportsHelpStyles: false,
        hasLabel: false,
        hasPlaceholder: false,
        hasRequired: false,
        hasHelpText: false,
        hasOptions: false,
    },
    [FieldType.IMAGE]: {
        supportsInputStyles: false,
        supportsWindowStyles: true,
        supportsLabelStyles: false,
        supportsPlaceholderStyles: false,
        supportsHelpStyles: false,
        hasLabel: true,
        hasPlaceholder: false,
        hasRequired: false,
        hasHelpText: false,
        hasOptions: false,
    },
    [FieldType.VIDEO]: {
        supportsInputStyles: false,
        supportsWindowStyles: true,
        supportsLabelStyles: false,
        supportsPlaceholderStyles: false,
        supportsHelpStyles: false,
        hasLabel: true,
        hasPlaceholder: false,
        hasRequired: false,
        hasHelpText: false,
        hasOptions: false,
    },
    [FieldType.BUTTON]: {
        supportsInputStyles: false,
        supportsWindowStyles: true,
        supportsLabelStyles: false,
        supportsPlaceholderStyles: false,
        supportsHelpStyles: false,
        hasLabel: true,
        hasPlaceholder: false,
        hasRequired: false,
        hasHelpText: false,
        hasOptions: false,
    },
    [FieldType.CAPTCHA]: {
        supportsInputStyles: false,
        supportsWindowStyles: true,
        supportsLabelStyles: false,
        supportsPlaceholderStyles: false,
        supportsHelpStyles: false,
        hasLabel: true,
        hasPlaceholder: false,
        hasRequired: false,
        hasHelpText: false,
        hasOptions: false,
    },

    // Input fields - support all styles
    [FieldType.TEXT]: {
        supportsInputStyles: true,
        supportsWindowStyles: true,
        supportsLabelStyles: true,
        supportsPlaceholderStyles: true,
        supportsHelpStyles: true,
        hasLabel: true,
        hasPlaceholder: true,
        hasRequired: true,
        hasHelpText: true,
        hasOptions: false,
    },
    [FieldType.EMAIL]: {
        supportsInputStyles: true,
        supportsWindowStyles: true,
        supportsLabelStyles: true,
        supportsPlaceholderStyles: true,
        supportsHelpStyles: true,
        hasLabel: true,
        hasPlaceholder: true,
        hasRequired: true,
        hasHelpText: true,
        hasOptions: false,
    },
    [FieldType.URL]: {
        supportsInputStyles: true,
        supportsWindowStyles: true,
        supportsLabelStyles: true,
        supportsPlaceholderStyles: true,
        supportsHelpStyles: true,
        hasLabel: true,
        hasPlaceholder: true,
        hasRequired: true,
        hasHelpText: true,
        hasOptions: false,
    },
    [FieldType.PHONE]: {
        supportsInputStyles: true,
        supportsWindowStyles: true,
        supportsLabelStyles: true,
        supportsPlaceholderStyles: true,
        supportsHelpStyles: true,
        hasLabel: true,
        hasPlaceholder: true,
        hasRequired: true,
        hasHelpText: true,
        hasOptions: false,
    },
    [FieldType.NUMBER]: {
        supportsInputStyles: true,
        supportsWindowStyles: true,
        supportsLabelStyles: true,
        supportsPlaceholderStyles: true,
        supportsHelpStyles: true,
        hasLabel: true,
        hasPlaceholder: true,
        hasRequired: true,
        hasHelpText: true,
        hasOptions: false,
    },
    [FieldType.TEXTAREA]: {
        supportsInputStyles: true,
        supportsWindowStyles: true,
        supportsLabelStyles: true,
        supportsPlaceholderStyles: true,
        supportsHelpStyles: true,
        hasLabel: true,
        hasPlaceholder: true,
        hasRequired: true,
        hasHelpText: true,
        hasOptions: false,
    },
    [FieldType.DATE]: {
        supportsInputStyles: true,
        supportsWindowStyles: true,
        supportsLabelStyles: true,
        supportsPlaceholderStyles: true,
        supportsHelpStyles: true,
        hasLabel: true,
        hasPlaceholder: false,
        hasRequired: true,
        hasHelpText: true,
        hasOptions: false,
    },
    [FieldType.TIME]: {
        supportsInputStyles: true,
        supportsWindowStyles: true,
        supportsLabelStyles: true,
        supportsPlaceholderStyles: true,
        supportsHelpStyles: true,
        hasLabel: true,
        hasPlaceholder: false,
        hasRequired: true,
        hasHelpText: true,
        hasOptions: false,
    },

    // Selection fields - support all except placeholder
    [FieldType.DROPDOWN]: {
        supportsInputStyles: true,
        supportsWindowStyles: true,
        supportsLabelStyles: true,
        supportsPlaceholderStyles: false,
        supportsHelpStyles: true,
        hasLabel: true,
        hasPlaceholder: false,
        hasRequired: true,
        hasHelpText: true,
        hasOptions: true,
    },
    [FieldType.RADIO]: {
        supportsInputStyles: true,
        supportsWindowStyles: true,
        supportsLabelStyles: true,
        supportsPlaceholderStyles: false,
        supportsHelpStyles: true,
        hasLabel: true,
        hasPlaceholder: false,
        hasRequired: true,
        hasHelpText: true,
        hasOptions: true,
    },
    [FieldType.CHECKBOX]: {
        supportsInputStyles: true,
        supportsWindowStyles: true,
        supportsLabelStyles: true,
        supportsPlaceholderStyles: false,
        supportsHelpStyles: true,
        hasLabel: true,
        hasPlaceholder: false,
        hasRequired: true,
        hasHelpText: true,
        hasOptions: true,
    },

    [FieldType.UPLOAD]: {
        supportsInputStyles: true,
        supportsWindowStyles: true,
        supportsLabelStyles: true,
        supportsPlaceholderStyles: false,
        supportsHelpStyles: true,
        hasLabel: true,
        hasPlaceholder: false,
        hasRequired: true,
        hasHelpText: true,
        hasOptions: false,
    },
};

/**
 * Get style capabilities for a field type
 */
export function getFieldCapabilities(fieldType: FieldType): FieldStyleCapabilities {
    return FIELD_CAPABILITIES[fieldType];
}
