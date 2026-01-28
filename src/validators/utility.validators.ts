/**
 * Utility Validators
 * Format validators and helper functions
 */

import { FormDefinition } from '../types';
import { ValidationError } from '../types/validation';

/**
 * Validates an email address format using a more robust pattern.
 * Ensures valid email structure with proper domain and TLD.
 */
export const isValidEmail = (email: string): boolean => {
  // More robust email validation regex
  // Validates: local-part@domain.tld format
  // - Local part: alphanumeric, dots, hyphens, underscores (not starting/ending with dot)
  // - Domain: alphanumeric and hyphens (not starting/ending with hyphen)
  // - TLD: at least 2 characters
  const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validates a URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates a phone number format.
 * Allows international formats with proper structure.
 * 
 * Supports phone numbers with:
 * - Optional country code with + prefix (1-3 digits)
 * - Optional area code (with or without parentheses)
 * - Various separators (spaces, hyphens, dots)
 * - Between 10-15 digits total (standard for most international numbers)
 * 
 * Note: Some countries may have phone numbers with fewer than 10 digits 
 * (e.g., some Caribbean islands) or more than 15 digits. Adjust the validation
 * if your use case requires support for such numbers.
 * 
 * @example
 * ```ts
 * isValidPhone("+1 (555) 123-4567");  // true
 * isValidPhone("555-123-4567");       // true
 * isValidPhone("(123) 456-7890");     // true
 * isValidPhone("----");                // false
 * isValidPhone("(((())))");            // false
 * ```
 */
export const isValidPhone = (phone: string): boolean => {
  /**
   * Regular expression pattern for validating phone number formats.
   * Allows:
   * - Optional leading "+" and country code (1-3 digits)
   * - Optional area code in parentheses
   * - Groups of digits separated by spaces, hyphens, or dots
   * - Total digit count between 10 and 15
   */
  const phoneRegex = /^(\+?\d{1,3}[\s.-]?)?((\(\d{2,4}\))|\d{2,4})[\s.-]?\d{2,4}[\s.-]?\d{2,4}([\s.-]?\d{1,4})?$/;
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Validate digit count (10-15 digits is standard for most international numbers)
  // Note: This may be too restrictive for some countries with shorter or longer numbers
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return false;
  }
  
  return phoneRegex.test(phone);
};

/**
 * Checks if all field IDs referenced in logic rules exist in form fields
 */
export const validateLogicFieldReferences = (
  definition: FormDefinition,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const fieldIds = new Set(definition.fields.map((f) => f.id));

  if (!definition.logic || !definition.logic.rules) {
    return errors;
  }

  definition.logic.rules.forEach((rule) => {
    // Check trigger fieldId
    if (rule.trigger.fieldId && !fieldIds.has(rule.trigger.fieldId)) {
      errors.push({
        path: `logic.rules[${rule.id}].trigger.fieldId`,
        message: `Field "${rule.trigger.fieldId}" does not exist`,
        type: 'invalid_reference',
      });
    }

    // Check field references in conditions
    const checkExpression = (expr: { args?: any[] }, context: string) => {
      if (!expr || !expr.args) return;

      expr.args.forEach((condition: any, index: number) => {
        if (
          condition.left &&
          condition.left.var &&
          !fieldIds.has(condition.left.var)
        ) {
          errors.push({
            path: `logic.rules[${rule.id}].${context}.args[${index}].left.var`,
            message: `Field "${condition.left.var}" does not exist`,
            type: 'invalid_reference',
          });
        }

        if (
          condition.right &&
          condition.right.var &&
          !fieldIds.has(condition.right.var)
        ) {
          errors.push({
            path: `logic.rules[${rule.id}].${context}.args[${index}].right.var`,
            message: `Field "${condition.right.var}" does not exist`,
            type: 'invalid_reference',
          });
        }
      });
    };

    checkExpression(rule.if, 'if');
  });

  return errors;
};
