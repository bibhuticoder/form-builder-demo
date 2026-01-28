/**
 * Form Definition Validator
 * Main comprehensive form validation
 */

import { ValidationResult } from '../types/validation';
import { ValidationResultBuilder } from './validation-result-builder';
import { validateFormSettings, validateFields } from './form-settings.validators';
import { validateLogicRules } from './logic.validators';
import { validateLogicFieldReferences } from './utility.validators';

export const validateFormDefinition = (definition: any): ValidationResult => {
  const builder = new ValidationResultBuilder();

  if (!definition || typeof definition !== 'object') {
    builder.addError('root', 'Form definition must be an object', 'invalid_type');
    return builder.build();
  }

  // Validate form settings
  const settingsErrors = validateFormSettings(definition.formSettings);
  builder.addErrors(settingsErrors);

  // Validate fields
  const fieldsErrors = validateFields(definition.fields);
  builder.addErrors(fieldsErrors);

  // Collect all field IDs for logic validation
  const validFieldIds = new Set<string>();
  if (definition.fields && Array.isArray(definition.fields)) {
    definition.fields.forEach((field: any) => {
      if (field.id) {
        validFieldIds.add(field.id);
      }
    });
  }

  // Validate logic rules (optional) with field ID validation
  const logicErrors = validateLogicRules(definition.logic, validFieldIds);
  builder.addErrors(logicErrors);

  // Validate field references in logic rules
  if (definition.fields && Array.isArray(definition.fields)) {
    const refErrors = validateLogicFieldReferences(definition);
    builder.addErrors(refErrors);
  }

  return builder.build();
};
