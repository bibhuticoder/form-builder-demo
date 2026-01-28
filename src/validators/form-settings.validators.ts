/**
 * Form Settings & Fields Validators
 * Validation for form configuration and field arrays
 */

import { FormStatus } from '../types';
import { ValidationError } from '../types/validation';
import { validateField } from './field.validators';

export const validateFormStatus = (status: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  const validStatuses = Object.values(FormStatus);

  if (!status || typeof status !== 'string') {
    errors.push({
      path: 'formSettings.status',
      message: 'Form status is required and must be a string',
      type: 'missing_required',
    });
  } else if (!validStatuses.includes(status as FormStatus)) {
    errors.push({
      path: 'formSettings.status',
      message: `Form status must be one of: ${validStatuses.join(', ')}`,
      type: 'invalid_value',
    });
  }

  return errors;
};

export const validateFormName = (name: string): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!name || typeof name !== 'string') {
    errors.push({
      path: 'formSettings.name',
      message: 'Form name is required and must be a string',
      type: 'missing_required',
    });
  } else if (name.trim().length === 0) {
    errors.push({
      path: 'formSettings.name',
      message: 'Form name cannot be empty',
      type: 'invalid_value',
    });
  }

  return errors;
};

export const validateFormSettings = (formSettings: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!formSettings || typeof formSettings !== 'object') {
    errors.push({
      path: 'formSettings',
      message: 'Form settings is required and must be an object',
      type: 'missing_required',
    });
    return errors;
  }

  errors.push(...validateFormName(formSettings.name));
  errors.push(...validateFormStatus(formSettings.status));

  if (!formSettings.settings || typeof formSettings.settings !== 'object') {
    errors.push({
      path: 'formSettings.settings',
      message: 'Form settings.settings is required and must be an object',
      type: 'missing_required',
    });
  }

  return errors;
};

export const validateFields = (fields: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!Array.isArray(fields)) {
    errors.push({
      path: 'fields',
      message: 'Fields must be an array',
      type: 'invalid_type',
    });
    return errors;
  }

  if (fields.length === 0) {
    errors.push({
      path: 'fields',
      message: 'Form must have at least one field',
      type: 'invalid_value',
    });
    return errors;
  }

  // Check for duplicate field IDs
  const fieldIds = new Set<string>();
  fields.forEach((field) => {
    if (field.id && fieldIds.has(field.id)) {
      errors.push({
        path: `fields[${field.id}].id`,
        message: `Duplicate field id: "${field.id}" already exists`,
        type: 'duplicate',
      });
    } else if (field.id) {
      fieldIds.add(field.id);
    }
  });

  // Validate each field
  fields.forEach((field) => {
    const fieldErrors = validateField(field);
    errors.push(...fieldErrors);
  });

  return errors;
};
