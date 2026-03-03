/**
 * Tests for Utility Validators
 */

import {
  isValidEmail,
  isValidUrl,
  isValidPhone,
  validateLogicFieldReferences,
} from '../index';

import {
  FieldType,
  TextField,
  LogicEvent,
  LogicComparison,
  LogicEffect,
  LogicRule,
  FormDefinition,
  FormStatus,
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

const createValidFormDefinition = (overrides?: any): FormDefinition => ({
  formSettings: createValidFormSettings(),
  fields: [createValidTextField()],
  ...overrides,
});

const createValidLogicRule = (overrides?: any): LogicRule => ({
  id: 'test_rule',
  enabled: true,
  trigger: {
    event: LogicEvent.FIELD_CHANGE,
    fieldId: 'test_field',
  },
  if: {
    conditions: [
      {
        id: 'cond_1',
        comparison: LogicComparison.EQ,
        left: { var: 'test_field' },
        right: { str: 'value' },
      },
    ],
  },
  then: [
    {
      effect: LogicEffect.FIELD_VISIBILITY_SET,
      targets: ['other_field'],
      value: true,
    },
  ],
  ...overrides,
});

// ============================================================================
// UTILITY VALIDATOR TESTS
// ============================================================================

describe('isValidEmail', () => {
  test('should validate correct email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  test('should reject invalid email', () => {
    expect(isValidEmail('invalid.email')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
  });
});

describe('isValidUrl', () => {
  test('should validate correct URL', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://example.com')).toBe(true);
  });

  test('should reject invalid URL', () => {
    expect(isValidUrl('not a url')).toBe(false);
    expect(isValidUrl('example.com')).toBe(false);
  });
});

describe('isValidPhone', () => {
  test('should validate correct phone number', () => {
    expect(isValidPhone('555-123-4567')).toBe(true);
    expect(isValidPhone('+1 (555) 123-4567')).toBe(true);
    expect(isValidPhone('5551234567')).toBe(true);
  });

  test('should reject invalid phone number', () => {
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('abc')).toBe(false);
  });
});

describe('validateLogicFieldReferences', () => {
  test('should pass when all field references exist', () => {
    const definition = createValidFormDefinition({
      fields: [
        createValidTextField({ id: 'test_field' }),
        createValidTextField({ id: 'other_field' }),
      ],
      logic: {
        version: 1,
        rules: [createValidLogicRule()],
      },
    });
    const errors = validateLogicFieldReferences(definition);
    expect(errors).toHaveLength(0);
  });

  test('should fail when trigger fieldId does not exist', () => {
    const definition = createValidFormDefinition({
      logic: {
        version: 1,
        rules: [
          createValidLogicRule({
            trigger: {
              event: LogicEvent.FIELD_CHANGE,
              fieldId: 'nonexistent_field',
            },
          }),
        ],
      },
    });
    const errors = validateLogicFieldReferences(definition);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].type).toBe('invalid_reference');
  });

  test('should fail when condition field reference does not exist', () => {
    const definition = createValidFormDefinition({
      logic: {
        version: 1,
        rules: [
          createValidLogicRule({
            if: {
              conditions: [
                {
                  id: 'cond_2',
                  comparison: LogicComparison.EQ,
                  left: { var: 'nonexistent_field' },
                  right: { str: 'value' },
                },
              ],
            },
          }),
        ],
      },
    });
    const errors = validateLogicFieldReferences(definition);
    expect(errors.length).toBeGreaterThan(0);
  });
});
