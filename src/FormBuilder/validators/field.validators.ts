/**
 * Field Validators
 * Validation for individual field properties
 */

import { Field, FieldType, FieldOption, DropdownField, RadioField, CheckboxField, InputField, HeadingLevel } from '../types';
import { ValidationError } from '../types/validation';

export const validateFieldId = (id: string, fieldId: string): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!id || typeof id !== 'string') {
    errors.push({
      path: `fields[${fieldId}].id`,
      message: 'Field id is required and must be a string',
      type: 'missing_required',
    });
  } else if (id.trim().length === 0) {
    errors.push({
      path: `fields[${fieldId}].id`,
      message: 'Field id cannot be empty',
      type: 'invalid_value',
    });
  }

  return errors;
};

export const validateFieldType = (type: string, fieldId: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  const validTypes = Object.values(FieldType);

  if (!type || typeof type !== 'string') {
    errors.push({
      path: `fields[${fieldId}].type`,
      message: 'Field type is required and must be a string',
      type: 'missing_required',
    });
  } else if (!validTypes.includes(type as FieldType)) {
    errors.push({
      path: `fields[${fieldId}].type`,
      message: `Field type must be one of: ${validTypes.join(', ')}`,
      type: 'invalid_value',
    });
  }

  return errors;
};

export const validateFieldLabel = (
  field: Field,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const contentBlockTypes = [FieldType.DIVIDER];
  const isContentBlock = contentBlockTypes.includes(field.type);

  if (!isContentBlock && 'label' in field) {
    if (field.label !== undefined && typeof field.label !== 'string') {
      errors.push({
        path: `fields[${field.id}].label`,
        message: 'Field label must be a string',
        type: 'invalid_type',
      });
    }
  }

  return errors;
};

export const validateInputFieldName = (
  field: Field,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const inputFieldTypes = [
    FieldType.TEXT,
    FieldType.URL,
    FieldType.EMAIL,
    FieldType.PHONE,
    FieldType.NUMBER,
    FieldType.TEXTAREA,
    FieldType.DATE,
    FieldType.TIME,
    FieldType.DROPDOWN,
    FieldType.RADIO,
    FieldType.CHECKBOX,
    FieldType.UPLOAD,
  ];

  if (inputFieldTypes.includes(field.type)) {
    // Check if name property exists
    if (!('name' in field)) {
      errors.push({
        path: `fields[${field.id}].name`,
        message: `Input fields of type ${field.type} must have a name property`,
        type: 'missing_required',
      });
    } else {
      const inputField = field as InputField;
      // Check if name is null or undefined
      if (inputField.name === null || inputField.name === undefined) {
        errors.push({
          path: `fields[${field.id}].name`,
          message: `Input fields of type ${field.type} must have a name property`,
          type: 'missing_required',
        });
      } else if (typeof inputField.name !== 'string') {
        errors.push({
          path: `fields[${field.id}].name`,
          message: 'Field name must be a string',
          type: 'invalid_type',
        });
      } else if (inputField.name.trim().length === 0) {
        errors.push({
          path: `fields[${field.id}].name`,
          message: 'Field name cannot be empty or whitespace only',
          type: 'invalid_value',
        });
      }
    }
  }

  return errors;
};

export const validateFieldOption = (
  option: FieldOption,
  fieldId: string,
  optionIndex: number,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!option.label || typeof option.label !== 'string') {
    errors.push({
      path: `fields[${fieldId}].options[${optionIndex}].label`,
      message: 'Option label is required and must be a string',
      type: 'missing_required',
    });
  }

  if (!option.value || typeof option.value !== 'string') {
    errors.push({
      path: `fields[${fieldId}].options[${optionIndex}].value`,
      message: 'Option value is required and must be a string',
      type: 'missing_required',
    });
  }

  return errors;
};

export const validateFieldOptions = (
  field: Field,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const optionFieldTypes = [FieldType.DROPDOWN, FieldType.RADIO, FieldType.CHECKBOX];

  if (optionFieldTypes.includes(field.type) && 'options' in field) {
    const typedField = field as DropdownField | RadioField | CheckboxField;
    const options = typedField.options;

    if (!Array.isArray(options)) {
      errors.push({
        path: `fields[${field.id}].options`,
        message: `Field type ${field.type} must have an options array`,
        type: 'missing_required',
      });
    } else {
      if (options.length === 0) {
        errors.push({
          path: `fields[${field.id}].options`,
          message: 'Options array cannot be empty',
          type: 'invalid_value',
        });
      }

      options.forEach((option, optionIndex) => {
        const optionErrors = validateFieldOption(option, field.id, optionIndex);
        errors.push(...optionErrors);
      });
    }
  }

  return errors;
};

export const validateFieldStyle = (field: Field): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (field.style && (typeof field.style !== 'object' || Array.isArray(field.style))) {
    errors.push({
      path: `fields[${field.id}].style`,
      message: 'Field style must be an object',
      type: 'invalid_type',
    });
  }

  return errors;
};

export const validateFieldHeadingLevel = (field: Field): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (field.type === FieldType.HEADING && 'headingLevel' in field) {
    const headingField = field as any;
    if (headingField.headingLevel !== undefined) {
      const validLevels = Object.values(HeadingLevel);
      if (!validLevels.includes(headingField.headingLevel)) {
        errors.push({
          path: `fields[${field.id}].headingLevel`,
          message: `Heading level must be one of: ${validLevels.join(', ')}`,
          type: 'invalid_value',
        });
      }
    }
  }

  return errors;
};

export const validateField = (field: Field): ValidationError[] => {
  const errors: ValidationError[] = [];

  errors.push(...validateFieldId(field.id, field.id));
  errors.push(...validateFieldType(field.type, field.id));
  errors.push(...validateFieldLabel(field));
  errors.push(...validateInputFieldName(field));
  errors.push(...validateFieldOptions(field));
  errors.push(...validateFieldStyle(field));
  errors.push(...validateFieldHeadingLevel(field));

  return errors;
};
