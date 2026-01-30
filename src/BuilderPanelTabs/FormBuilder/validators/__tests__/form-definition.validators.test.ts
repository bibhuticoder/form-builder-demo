/**
 * Tests for Form Definition Validator
 */

import { validateFormDefinition } from '../index';

import {
  FieldType,
  FormStatus,
  TextField,
  FormDefinition,
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

// ============================================================================
// FORM DEFINITION VALIDATION TESTS
// ============================================================================

describe('validateFormDefinition', () => {
  test('should pass for valid form definition', () => {
    const definition = createValidFormDefinition();
    const result = validateFormDefinition(definition);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should fail for non-object definition', () => {
    const result = validateFormDefinition(null);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('should fail for missing formSettings', () => {
    const definition = createValidFormDefinition({ formSettings: null });
    const result = validateFormDefinition(definition as any);
    expect(result.valid).toBe(false);
  });

  test('should fail for missing fields', () => {
    const definition = createValidFormDefinition({ fields: null });
    const result = validateFormDefinition(definition as any);
    expect(result.valid).toBe(false);
  });

  test('should pass with optional logic rules', () => {
    const definition = createValidFormDefinition();
    const result = validateFormDefinition(definition);
    expect(result.valid).toBe(true);
  });

  test('should collect all errors', () => {
    const definition = {
      formSettings: { name: '', status: 'invalid' as any },
      fields: [{ id: '', type: 'invalid_type' as any }],
    };
    const result = validateFormDefinition(definition);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});
