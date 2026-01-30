/**
 * Tests for Field Validators
 */

import {
  validateFieldId,
  validateFieldType,
  validateFieldLabel,
  validateInputFieldName,
  validateFieldOptions,
  validateFieldStyle,
  validateFieldHeadingLevel,
} from '../../validators';

import {
  FieldType,
  TextField,
  DropdownField,
  HeadingField,
  HeadingLevel,
  DividerField,
} from '../../BuilderPanelTabs/FormBuilder/types';

// ============================================================================
// TEST HELPERS
// ============================================================================

const createValidTextField = (overrides?: Partial<TextField>): TextField => ({
  id: 'test_field',
  type: FieldType.TEXT,
  label: 'Test Field',
  name: 'test_field',
  required: false,
  ...overrides,
});

const createValidDropdownField = (overrides?: Partial<DropdownField>): DropdownField => ({
  id: 'test_dropdown',
  type: FieldType.DROPDOWN,
  label: 'Select Option',
  name: 'test_dropdown',
  required: false,
  options: [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
  ],
  ...overrides,
});

const createValidHeadingField = (overrides?: Partial<HeadingField>): HeadingField => ({
  id: 'test_heading',
  type: FieldType.HEADING,
  label: 'Test Heading',
  headingLevel: HeadingLevel.H1,
  ...overrides,
});

// ============================================================================
// FIELD ID TESTS
// ============================================================================

describe('validateFieldId', () => {
  test('should pass for valid field id', () => {
    const errors = validateFieldId('valid_id', 'test_field');
    expect(errors).toHaveLength(0);
  });

  test('should fail for missing field id', () => {
    const errors = validateFieldId('', 'test_field');
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('missing_required');
  });

  test('should fail for non-string field id', () => {
    const errors = validateFieldId(null as any, 'test_field');
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('missing_required');
  });

  test('should fail for whitespace-only id', () => {
    const errors = validateFieldId('   ', 'test_field');
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('invalid_value');
  });
});

// ============================================================================
// FIELD TYPE TESTS
// ============================================================================

describe('validateFieldType', () => {
  test('should pass for valid field type', () => {
    const errors = validateFieldType(FieldType.TEXT, 'test_field');
    expect(errors).toHaveLength(0);
  });

  test('should fail for invalid field type', () => {
    const errors = validateFieldType('invalid_type', 'test_field');
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('invalid_value');
  });

  test('should fail for missing field type', () => {
    const errors = validateFieldType('', 'test_field');
    expect(errors).toHaveLength(1);
  });
});

// ============================================================================
// INPUT FIELD NAME TESTS
// ============================================================================

describe('validateInputFieldName', () => {
  test('should pass for input field with name', () => {
    const field = createValidTextField();
    const errors = validateInputFieldName(field);
    expect(errors).toHaveLength(0);
  });

  test('should fail for input field without name', () => {
    const field = createValidTextField({ name: '' });
    const errors = validateInputFieldName(field);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('invalid_value');
    expect(errors[0].message).toBe('Field name cannot be empty or whitespace only');
  });

  test('should fail for input field with non-string name', () => {
    const field = createValidTextField({ name: null as any });
    const errors = validateInputFieldName(field);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('missing_required');
  });

  test('should pass for non-input fields without name', () => {
    const field = {
      id: 'heading',
      type: FieldType.HEADING,
      label: 'Title',
    };
    const errors = validateInputFieldName(field as any);
    expect(errors).toHaveLength(0);
  });
});

// ============================================================================
// FIELD OPTIONS TESTS
// ============================================================================

describe('validateFieldOptions', () => {
  test('should pass for dropdown with valid options', () => {
    const field = createValidDropdownField();
    const errors = validateFieldOptions(field);
    expect(errors).toHaveLength(0);
  });

  test('should fail for dropdown without options', () => {
    const field = createValidDropdownField({ options: [] });
    const errors = validateFieldOptions(field);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('invalid_value');
  });

  test('should fail for dropdown with invalid option', () => {
    const field = createValidDropdownField({
      options: [{ label: 'Option 1' } as any],
    });
    const errors = validateFieldOptions(field);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].type).toBe('missing_required');
  });

  test('should pass for non-option fields', () => {
    const field = createValidTextField();
    const errors = validateFieldOptions(field);
    expect(errors).toHaveLength(0);
  });
});
// ============================================================================
// HEADING LEVEL TESTS
// ============================================================================

describe('validateFieldHeadingLevel', () => {
  test('should pass for heading with valid heading level', () => {
    const field = createValidHeadingField();
    const errors = validateFieldHeadingLevel(field);
    expect(errors).toHaveLength(0);
  });

  test('should fail for heading with invalid heading level', () => {
    const field = createValidHeadingField({ headingLevel: 'invalid_level' as any });
    const errors = validateFieldHeadingLevel(field);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('invalid_value');
  });

  test('should pass for non-heading fields', () => {
    const field = createValidTextField();
    const errors = validateFieldHeadingLevel(field);
    expect(errors).toHaveLength(0);
  });

  test('should pass for heading without explicit heading level', () => {
    const field = createValidHeadingField({ headingLevel: undefined });
    const errors = validateFieldHeadingLevel(field);
    expect(errors).toHaveLength(0);
  });
});

// ============================================================================
// LABEL VALIDATION TESTS
// ============================================================================

describe('validateFieldLabel', () => {
  test('should pass for field with valid string label', () => {
    const field = createValidTextField({ label: 'Valid Label' });
    const errors = validateFieldLabel(field);
    expect(errors).toHaveLength(0);
  });

  test('should pass for field with undefined label', () => {
    const field = createValidTextField({ label: undefined });
    const errors = validateFieldLabel(field);
    expect(errors).toHaveLength(0);
  });

  test('should fail for field with non-string label', () => {
    const field = createValidTextField({ label: 123 as any });
    const errors = validateFieldLabel(field);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('invalid_type');
    expect(errors[0].message).toBe('Field label must be a string');
  });

  test('should pass for content block fields (divider)', () => {
    const field: DividerField = {
      id: 'test_divider',
      type: FieldType.DIVIDER,
    };
    const errors = validateFieldLabel(field);
    expect(errors).toHaveLength(0);
  });

  test('should pass for field with empty string label', () => {
    const field = createValidTextField({ label: '' });
    const errors = validateFieldLabel(field);
    expect(errors).toHaveLength(0);
  });
});

// ============================================================================
// STYLE VALIDATION TESTS
// ============================================================================

describe('validateFieldStyle', () => {
  test('should pass for field without style', () => {
    const field = createValidTextField();
    const errors = validateFieldStyle(field);
    expect(errors).toHaveLength(0);
  });

  test('should pass for field with valid style object', () => {
    const field = createValidTextField({
      style: { width: '100%', backgroundColor: '#fff' },
    });
    const errors = validateFieldStyle(field);
    expect(errors).toHaveLength(0);
  });

  test('should pass for field with empty style object', () => {
    const field = createValidTextField({ style: {} });
    const errors = validateFieldStyle(field);
    expect(errors).toHaveLength(0);
  });

  test('should fail for field with non-object style', () => {
    const field = createValidTextField({ style: 'invalid-style' as any });
    const errors = validateFieldStyle(field);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('invalid_type');
    expect(errors[0].message).toBe('Field style must be an object');
  });

  test('should fail for field with numeric style', () => {
    const field = createValidTextField({ style: 123 as any });
    const errors = validateFieldStyle(field);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('invalid_type');
  });

  test('should fail for field with array style', () => {
    const field = createValidTextField({ style: [] as any });
    const errors = validateFieldStyle(field);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('invalid_type');
  });
});