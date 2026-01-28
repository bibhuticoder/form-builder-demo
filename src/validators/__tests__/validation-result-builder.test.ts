/**
 * Tests for ValidationResultBuilder
 */

import { ValidationResultBuilder } from '../../validators';

// ============================================================================
// VALIDATION RESULT BUILDER TESTS
// ============================================================================

describe('ValidationResultBuilder', () => {
  test('should create a valid result when no errors added', () => {
    const builder = new ValidationResultBuilder();
    const result = builder.build();

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should create invalid result when error is added', () => {
    const builder = new ValidationResultBuilder();
    builder.addError('field_1', 'Field is required', 'missing_required');
    const result = builder.build();

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].path).toBe('field_1');
    expect(result.errors[0].message).toBe('Field is required');
    expect(result.errors[0].type).toBe('missing_required');
  });

  test('should add multiple errors with addError calls', () => {
    const builder = new ValidationResultBuilder();
    builder.addError('field_1', 'Required', 'missing_required');
    builder.addError('field_2', 'Invalid format', 'invalid_value');
    builder.addError('field_3', 'Too short', 'invalid_value');
    const result = builder.build();

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(3);
  });

  test('should add multiple errors with addErrors', () => {
    const builder = new ValidationResultBuilder();
    builder.addErrors([
      { path: 'field_1', message: 'Required', type: 'missing_required' },
      { path: 'field_2', message: 'Invalid', type: 'invalid_value' },
    ]);
    const result = builder.build();

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });

  test('should support method chaining', () => {
    const result = new ValidationResultBuilder()
      .addError('field_1', 'Required', 'missing_required')
      .addError('field_2', 'Invalid', 'invalid_value')
      .build();

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });

  test('should combine addError and addErrors calls', () => {
    const builder = new ValidationResultBuilder();
    builder.addError('field_1', 'Required', 'missing_required');
    builder.addErrors([
      { path: 'field_2', message: 'Invalid', type: 'invalid_value' },
      { path: 'field_3', message: 'Too short', type: 'invalid_value' },
    ]);
    const result = builder.build();

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(3);
  });

  test('should preserve error order', () => {
    const builder = new ValidationResultBuilder();
    builder.addError('field_a', 'Error A', 'type_a');
    builder.addError('field_b', 'Error B', 'type_b');
    builder.addError('field_c', 'Error C', 'type_c');
    const result = builder.build();

    expect(result.errors[0].path).toBe('field_a');
    expect(result.errors[1].path).toBe('field_b');
    expect(result.errors[2].path).toBe('field_c');
  });

  test('should handle empty addErrors array', () => {
    const builder = new ValidationResultBuilder();
    builder.addErrors([]);
    const result = builder.build();

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should allow building multiple times', () => {
    const builder = new ValidationResultBuilder();
    builder.addError('field_1', 'Error 1', 'type_1');

    const result1 = builder.build();
    expect(result1.errors).toHaveLength(1);

    builder.addError('field_2', 'Error 2', 'type_2');
    const result2 = builder.build();
    expect(result2.errors).toHaveLength(2);
  });

  test('should include all error properties', () => {
    const builder = new ValidationResultBuilder();
    builder.addError('test_path', 'Test message', 'test_type');
    const result = builder.build();

    const error = result.errors[0];
    expect(error.path).toBe('test_path');
    expect(error.message).toBe('Test message');
    expect(error.type).toBe('test_type');
  });
});
