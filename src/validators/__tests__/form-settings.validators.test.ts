/**
 * Tests for Form Settings & Fields Validators
 */

import {
  validateFormStatus,
  validateFormName,
  validateFormSettings,
  validateFields,
} from '../../validators';

import {
  FieldType,
  FormStatus,
  TextField,
} from '../../types';

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

const createValidFormSettings = () => ({
  name: 'Test Form',
  status: FormStatus.DRAFT,
  settings: {
    width: 768,
    backgroundColor: '#FFFFFF',
  },
});

// ============================================================================
// FORM STATUS TESTS
// ============================================================================

describe('validateFormStatus', () => {
  test('should pass for valid status', () => {
    const errors = validateFormStatus(FormStatus.DRAFT);
    expect(errors).toHaveLength(0);
  });

  test('should fail for invalid status', () => {
    const errors = validateFormStatus('invalid_status');
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('invalid_value');
  });

  test('should fail for missing status', () => {
    const errors = validateFormStatus('');
    expect(errors).toHaveLength(1);
  });
});

// ============================================================================
// FORM NAME TESTS
// ============================================================================

describe('validateFormName', () => {
  test('should pass for valid form name', () => {
    const errors = validateFormName('My Form');
    expect(errors).toHaveLength(0);
  });

  test('should fail for empty form name', () => {
    const errors = validateFormName('');
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('missing_required');
  });

  test('should fail for whitespace-only name', () => {
    const errors = validateFormName('   ');
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('invalid_value');
  });
});

// ============================================================================
// FORM SETTINGS TESTS
// ============================================================================

describe('validateFormSettings', () => {
  test('should pass for valid form settings', () => {
    const settings = createValidFormSettings();
    const errors = validateFormSettings(settings);
    expect(errors).toHaveLength(0);
  });

  test('should fail for missing name', () => {
    const settings = createValidFormSettings();
    settings.name = '';
    const errors = validateFormSettings(settings);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('should fail for invalid status', () => {
    const settings = createValidFormSettings();
    settings.status = 'invalid' as any;
    const errors = validateFormSettings(settings);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('should fail for missing settings object', () => {
    const settings = createValidFormSettings();
    settings.settings = null as any;
    const errors = validateFormSettings(settings);
    expect(errors.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// FIELDS ARRAY TESTS
// ============================================================================

describe('validateFields', () => {
  test('should pass for valid fields array', () => {
    const fields = [createValidTextField()];
    const errors = validateFields(fields);
    expect(errors).toHaveLength(0);
  });

  test('should fail for non-array fields', () => {
    const errors = validateFields({} as any);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('invalid_type');
  });

  test('should fail for empty fields array', () => {
    const errors = validateFields([]);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('invalid_value');
  });

  test('should fail for duplicate field ids', () => {
    const field1 = createValidTextField({ id: 'same_id' });
    const field2 = createValidTextField({ id: 'same_id' });
    const errors = validateFields([field1, field2]);
    expect(errors.some((e) => e.type === 'duplicate')).toBe(true);
  });

  test('should validate each field individually', () => {
    const validField = createValidTextField();
    const invalidField = createValidTextField({
      type: 'invalid_type' as any,
    });
    const errors = validateFields([validField, invalidField]);
    expect(errors.length).toBeGreaterThan(0);
  });
});
