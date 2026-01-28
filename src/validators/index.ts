/**
 * Form Validators - Main Export
 * Re-exports all validator functions from organized modules
 */

// Field validators
export {
  validateFieldId,
  validateFieldType,
  validateFieldLabel,
  validateInputFieldName,
  validateFieldOption,
  validateFieldOptions,
  validateFieldStyle,
  validateFieldHeadingLevel,
  validateField,
} from './field.validators';

// Form settings validators
export {
  validateFormStatus,
  validateFormName,
  validateFormSettings,
  validateFields,
} from './form-settings.validators';

// Logic validators
export {
  validateLogicTrigger,
  validateLogicComparison,
  validateLogicCondition,
  validateLogicExpression,
  validateLogicEffectTargets,
  validateLogicEffect,
  validateLogicRule,
  validateLogicRules,
} from './logic.validators';

// Utility validators
export {
  isValidEmail,
  isValidUrl,
  isValidPhone,
  validateLogicFieldReferences,
} from './utility.validators';

// Validation result builder
export { ValidationResultBuilder } from './validation-result-builder';

// Main form definition validator
export { validateFormDefinition } from './form-definition.validators';
