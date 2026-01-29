/**
 * Form Definition Validator
 * Main comprehensive form validation
 */

import { ValidationResult } from '../types/validation';
import { ValidationResultBuilder } from './validation-result-builder';
import { validateFormSettings, validateFields } from './form-settings.validators';
import { validateLogicRules } from './logic.validators';
import { validateLogicFieldReferences } from './utility.validators';

export const validateFormDefinition = (definition: unknown): ValidationResult => {
  const builder = new ValidationResultBuilder();

  if (!definition || typeof definition !== 'object') {
    builder.addError('root', 'Form definition must be an object', 'invalid_type');
    return builder.build();
  }

  // Cast to Record for property access after type check
  const def = definition as Record<string, unknown>;

  // Validate form settings
  const settingsErrors = validateFormSettings(def.formSettings);
  builder.addErrors(settingsErrors);

  // Validate fields
  const fieldsErrors = validateFields(def.fields);
  builder.addErrors(fieldsErrors);

  // Collect all field IDs for logic validation
  const validFieldIds = new Set<string>();
  if (def.fields && Array.isArray(def.fields)) {
    (def.fields as Array<{ id?: string }>).forEach((field) => {
      if (field.id) {
        validFieldIds.add(field.id);
      }
    });
  }

  // Validate logic rules (optional) with field ID validation
  const logicErrors = validateLogicRules(def.logic, validFieldIds);
  builder.addErrors(logicErrors);

  // Validate field references in logic rules
  if (def.fields && Array.isArray(def.fields)) {
    const refErrors = validateLogicFieldReferences(definition as any);
    builder.addErrors(refErrors);
  }

  return builder.build();
};
