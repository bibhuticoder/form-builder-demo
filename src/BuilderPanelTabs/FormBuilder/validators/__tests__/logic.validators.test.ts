/**
 * Tests for Logic Validators
 */

import {
  validateLogicTrigger,
  validateLogicComparison,
  validateLogicCondition,
  validateLogicExpression,
  validateLogicEffect,
  validateLogicEffectTargets,
  validateLogicRule,
  validateLogicRules,
} from '../index';

import {
  LogicEvent,
  LogicComparison,
  LogicOperation,
  LogicEffect,
  LogicRule,
} from '../../BuilderPanelTabs/FormBuilder/types';

// ============================================================================
// TEST HELPERS
// ============================================================================

const createValidLogicRule = (overrides?: any): LogicRule => ({
  id: 'test_rule',
  enabled: true,
  trigger: {
    event: LogicEvent.FIELD_CHANGE,
    fieldId: 'test_field',
  },
  if: {
    operation: LogicOperation.AND,
    args: [
      {
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
// LOGIC RULE VALIDATION TESTS
// ============================================================================

describe('validateLogicTrigger', () => {
  test('should pass for valid trigger', () => {
    const trigger = {
      event: LogicEvent.FIELD_CHANGE,
      fieldId: 'test_field',
    };
    const errors = validateLogicTrigger(trigger, 'rule_1');
    expect(errors).toHaveLength(0);
  });

  test('should fail for invalid event', () => {
    const trigger = {
      event: 'invalid_event',
      fieldId: 'test_field',
    };
    const errors = validateLogicTrigger(trigger, 'rule_1');
    expect(errors).toHaveLength(1);
  });

  test('should fail for missing event', () => {
    const trigger = { fieldId: 'test_field' };
    const errors = validateLogicTrigger(trigger, 'rule_1');
    expect(errors).toHaveLength(1);
  });

  test('should fail for non-string fieldId', () => {
    const trigger = {
      event: LogicEvent.FIELD_CHANGE,
      fieldId: 123 as any,
    };
    const errors = validateLogicTrigger(trigger, 'rule_1');
    expect(errors).toHaveLength(1);
  });

  test('should fail for invalid fieldId reference', () => {
    const trigger = {
      event: LogicEvent.FIELD_CHANGE,
      fieldId: 'non_existent_field',
    };
    const validFieldIds = new Set(['test_field', 'other_field']);
    const errors = validateLogicTrigger(trigger, 'rule_1', validFieldIds);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].type).toBe('invalid_value');
  });

  test('should pass for valid fieldId reference', () => {
    const trigger = {
      event: LogicEvent.FIELD_CHANGE,
      fieldId: 'test_field',
    };
    const validFieldIds = new Set(['test_field', 'other_field']);
    const errors = validateLogicTrigger(trigger, 'rule_1', validFieldIds);
    expect(errors).toHaveLength(0);
  });
});

describe('validateLogicComparison', () => {
  test('should pass for valid comparison', () => {
    const errors = validateLogicComparison(LogicComparison.EQ, 'rule_1', 0);
    expect(errors).toHaveLength(0);
  });

  test('should fail for invalid comparison', () => {
    const errors = validateLogicComparison('invalid_cmp', 'rule_1', 0);
    expect(errors).toHaveLength(1);
  });
});

describe('validateLogicCondition', () => {
  test('should pass for valid condition', () => {
    const condition = {
      comparison: LogicComparison.EQ,
      left: { var: 'field1' },
      right: { str: 'value' },
    };
    const errors = validateLogicCondition(condition, 'rule_1', 0);
    expect(errors).toHaveLength(0);
  });

  test('should fail for missing left operand', () => {
    const condition = {
      comparison: LogicComparison.EQ,
      right: { str: 'value' },
    };
    const errors = validateLogicCondition(condition, 'rule_1', 0);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('should fail for missing right operand', () => {
    const condition = {
      comparison: LogicComparison.EQ,
      left: { var: 'field1' },
    };
    const errors = validateLogicCondition(condition, 'rule_1', 0);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('validateLogicExpression', () => {
  test('should pass for valid expression', () => {
    const expression = {
      operation: LogicOperation.AND,
      args: [
        {
          comparison: LogicComparison.EQ,
          left: { var: 'field1' },
          right: { str: 'value' },
        },
      ],
    };
    const errors = validateLogicExpression(expression, 'rule_1');
    expect(errors).toHaveLength(0);
  });

  test('should fail for invalid operation', () => {
    const expression = {
      operation: 'invalid_op',
      args: [],
    };
    const errors = validateLogicExpression(expression, 'rule_1');
    expect(errors.length).toBeGreaterThan(0);
  });

  test('should fail for non-array args', () => {
    const expression = {
      operation: LogicOperation.AND,
      args: {},
    };
    const errors = validateLogicExpression(expression, 'rule_1');
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('validateLogicRule', () => {
  test('should pass for valid rule', () => {
    const rule = createValidLogicRule();
    const errors = validateLogicRule(rule, 0);
    expect(errors).toHaveLength(0);
  });

  test('should fail for missing rule id', () => {
    const rule = createValidLogicRule({ id: '' });
    const errors = validateLogicRule(rule as any, 0);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('should fail for invalid trigger', () => {
    const rule = createValidLogicRule({
      trigger: { event: 'invalid_event' },
    });
    const errors = validateLogicRule(rule as any, 0);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('should fail for non-boolean enabled', () => {
    const rule = createValidLogicRule({ enabled: 'true' as any });
    const errors = validateLogicRule(rule, 0);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('validateLogicRules', () => {
  test('should pass for valid logic rules', () => {
    const logic = {
      version: 1,
      rules: [createValidLogicRule()],
    };
    const errors = validateLogicRules(logic);
    expect(errors).toHaveLength(0);
  });

  test('should pass for empty rules', () => {
    const logic = {
      version: 1,
      rules: [],
    };
    const errors = validateLogicRules(logic);
    expect(errors).toHaveLength(0);
  });

  test('should pass for undefined logic', () => {
    const errors = validateLogicRules(undefined);
    expect(errors).toHaveLength(0);
  });

  test('should fail for duplicate rule ids', () => {
    const rule = createValidLogicRule({ id: 'same_id' });
    const logic = {
      version: 1,
      rules: [rule, createValidLogicRule({ id: 'same_id' })],
    };
    const errors = validateLogicRules(logic as any);
    expect(errors.some((e) => e.type === 'duplicate')).toBe(true);
  });

  test('should fail for invalid fieldId in trigger', () => {
    const rule = createValidLogicRule({
      trigger: { event: LogicEvent.FIELD_CHANGE, fieldId: 'invalid_field' },
    });
    const logic = { version: 1, rules: [rule] };
    const validFieldIds = new Set(['test_field', 'other_field']);
    const errors = validateLogicRules(logic, validFieldIds);
    expect(errors.some((e) => e.type === 'invalid_value' && e.path.includes('fieldId'))).toBe(true);
  });

  test('should fail for invalid targets in effect', () => {
    const rule = createValidLogicRule({
      then: [
        {
          effect: LogicEffect.FIELD_VISIBILITY_SET,
          targets: ['invalid_target'],
          value: true,
        },
      ],
    });
    const logic = { version: 1, rules: [rule] };
    const validFieldIds = new Set(['test_field', 'other_field']);
    const errors = validateLogicRules(logic, validFieldIds);
    expect(errors.some((e) => e.type === 'invalid_value' && e.path.includes('targets'))).toBe(true);
  });

  test('should pass for valid fieldId and targets', () => {
    const rule = createValidLogicRule({
      trigger: { event: LogicEvent.FIELD_CHANGE, fieldId: 'test_field' },
      then: [
        {
          effect: LogicEffect.FIELD_VISIBILITY_SET,
          targets: ['other_field'],
          value: true,
        },
      ],
    });
    const logic = { version: 1, rules: [rule] };
    const validFieldIds = new Set(['test_field', 'other_field']);
    const errors = validateLogicRules(logic, validFieldIds);
    expect(errors).toHaveLength(0);
  });
});

// ============================================================================
// NESTED EXPRESSION TESTS
// ============================================================================

describe('validateLogicExpression - nested expressions', () => {
  test('should pass for valid nested expression', () => {
    const expression = {
      operation: LogicOperation.AND,
      args: [
        {
          comparison: LogicComparison.EQ,
          left: { var: 'contact_preference' },
          right: { str: 'phone' },
        },
        {
          comparison: LogicComparison.EQ,
          left: { var: 'is_anonymous' },
          right: { bool: false },
        },
        {
          operation: LogicOperation.OR,
          args: [
            {
              comparison: LogicComparison.EQ,
              left: { var: 'country' },
              right: { str: 'US' },
            },
            {
              comparison: LogicComparison.EQ,
              left: { var: 'country' },
              right: { str: 'CA' },
            },
          ],
        },
      ],
    };
    const errors = validateLogicExpression(expression, 'rule_1');
    expect(errors).toHaveLength(0);
  });

  test('should pass for deeply nested expressions', () => {
    const expression = {
      operation: LogicOperation.AND,
      args: [
        {
          comparison: LogicComparison.EQ,
          left: { var: 'field1' },
          right: { str: 'value1' },
        },
        {
          operation: LogicOperation.OR,
          args: [
            {
              comparison: LogicComparison.EQ,
              left: { var: 'field2' },
              right: { str: 'value2' },
            },
            {
              operation: LogicOperation.AND,
              args: [
                {
                  comparison: LogicComparison.GT,
                  left: { var: 'age' },
                  right: { num: 18 },
                },
                {
                  comparison: LogicComparison.LT,
                  left: { var: 'age' },
                  right: { num: 65 },
                },
              ],
            },
          ],
        },
      ],
    };
    const errors = validateLogicExpression(expression, 'rule_1');
    expect(errors).toHaveLength(0);
  });

  test('should fail for nested expression with invalid operation', () => {
    const expression = {
      operation: LogicOperation.AND,
      args: [
        {
          comparison: LogicComparison.EQ,
          left: { var: 'field1' },
          right: { str: 'value1' },
        },
        {
          operation: 'invalid_op',
          args: [
            {
              comparison: LogicComparison.EQ,
              left: { var: 'field2' },
              right: { str: 'value2' },
            },
          ],
        },
      ],
    };
    const errors = validateLogicExpression(expression, 'rule_1');
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.message.includes('Operation must be one of'))).toBe(true);
  });

  test('should fail for nested expression with invalid condition', () => {
    const expression = {
      operation: LogicOperation.AND,
      args: [
        {
          comparison: LogicComparison.EQ,
          left: { var: 'field1' },
          right: { str: 'value1' },
        },
        {
          operation: LogicOperation.OR,
          args: [
            {
              comparison: 'invalid_comparison',
              left: { var: 'field2' },
              right: { str: 'value2' },
            },
          ],
        },
      ],
    };
    const errors = validateLogicExpression(expression, 'rule_1');
    expect(errors.length).toBeGreaterThan(0);
  });

  test('should fail for arg that is neither expression nor condition', () => {
    const expression = {
      operation: LogicOperation.AND,
      args: [
        {
          comparison: LogicComparison.EQ,
          left: { var: 'field1' },
          right: { str: 'value1' },
        },
        {
          // Neither operation nor comparison
          invalid: 'data',
        },
      ],
    };
    const errors = validateLogicExpression(expression, 'rule_1');
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.message.includes('must be either a LogicExpression'))).toBe(true);
  });
});

describe('validateLogicCondition - optional right operand', () => {
  test('should pass for unary operators without right operand', () => {
    const condition = {
      comparison: LogicComparison.EXISTS,
      left: { var: 'field1' },
    };
    const errors = validateLogicCondition(condition, 'rule_1', 0);
    expect(errors).toHaveLength(0);
  });

  test('should pass for isEmpty operator without right operand', () => {
    const condition = {
      comparison: LogicComparison.IS_EMPTY,
      left: { var: 'field1' },
    };
    const errors = validateLogicCondition(condition, 'rule_1', 0);
    expect(errors).toHaveLength(0);
  });

  test('should fail for binary operators without right operand', () => {
    const condition = {
      comparison: LogicComparison.EQ,
      left: { var: 'field1' },
    };
    const errors = validateLogicCondition(condition, 'rule_1', 0);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.path.includes('.right'))).toBe(true);
    expect(errors.some((e) => e.message.includes('binary operators'))).toBe(true);
  });
});

describe('validateLogicRule - with nested expressions', () => {
  test('should pass for valid rule with nested expressions', () => {
    const rule = createValidLogicRule({
      if: {
        operation: LogicOperation.AND,
        args: [
          {
            comparison: LogicComparison.EQ,
            left: { var: 'contact_preference' },
            right: { str: 'phone' },
          },
          {
            operation: LogicOperation.OR,
            args: [
              {
                comparison: LogicComparison.EQ,
                left: { var: 'country' },
                right: { str: 'US' },
              },
              {
                comparison: LogicComparison.EQ,
                left: { var: 'country' },
                right: { str: 'CA' },
              },
            ],
          },
        ],
      },
    });
    const errors = validateLogicRule(rule, 0);
    expect(errors).toHaveLength(0);
  });
});

// ============================================================================
// LOGIC EFFECT VALIDATION TESTS
// ============================================================================

describe('validateLogicEffect', () => {
  test('should pass for valid field visibility effect', () => {
    const effect = {
      effect: LogicEffect.FIELD_VISIBILITY_SET,
      targets: ['field1', 'field2'],
      value: true,
    };
    const errors = validateLogicEffect(effect, 'rule_1', 0);
    expect(errors).toHaveLength(0);
  });

  test('should fail for missing effect property', () => {
    const effect = {
      targets: ['field1'],
      value: true,
    };
    const errors = validateLogicEffect(effect, 'rule_1', 0);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].path).toContain('.effect');
  });

  test('should fail for invalid effect type', () => {
    const effect = {
      effect: 'INVALID_EFFECT',
      targets: ['field1'],
      value: true,
    };
    const errors = validateLogicEffect(effect, 'rule_1', 0);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].type).toBe('invalid_value');
  });

  test('should fail for non-object effect', () => {
    const effect = 'not-an-object';
    const errors = validateLogicEffect(effect, 'rule_1', 0);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('invalid_type');
    expect(errors[0].message).toBe('Effect must be an object');
  });

  test('should validate targets for FIELD_VISIBILITY_SET effect', () => {
    const effect = {
      effect: LogicEffect.FIELD_VISIBILITY_SET,
      targets: ['non_existent_field'],
      value: true,
    };
    const validFieldIds = new Set(['field1', 'field2']);
    const errors = validateLogicEffect(effect, 'rule_1', 0, false, validFieldIds);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].type).toBe('invalid_value');
  });

  test('should handle else effects with correct path', () => {
    const effect = {
      effect: 'INVALID_EFFECT',
      targets: ['field1'],
    };
    const errors = validateLogicEffect(effect, 'rule_1', 0, true);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].path).toContain('.else');
  });

  test('should pass for null effect', () => {
    const effect = null;
    const errors = validateLogicEffect(effect, 'rule_1', 0);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].type).toBe('invalid_type');
  });
});

// ============================================================================
// LOGIC EFFECT TARGETS VALIDATION TESTS
// ============================================================================

describe('validateLogicEffectTargets', () => {
  test('should pass for valid targets array', () => {
    const targets = ['field1', 'field2'];
    const validFieldIds = new Set(['field1', 'field2', 'field3']);
    const errors = validateLogicEffectTargets(targets, 'rule_1', 0, false, validFieldIds);
    expect(errors).toHaveLength(0);
  });

  test('should fail for non-array targets', () => {
    const targets = 'not-an-array';
    const errors = validateLogicEffectTargets(targets, 'rule_1', 0);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('invalid_type');
    expect(errors[0].message).toBe('Effect targets must be an array');
  });

  test('should fail for empty targets array', () => {
    const targets: string[] = [];
    const errors = validateLogicEffectTargets(targets, 'rule_1', 0);
    expect(errors).toHaveLength(1);
    expect(errors[0].type).toBe('invalid_value');
    expect(errors[0].message).toBe('Effect targets array cannot be empty');
  });

  test('should fail for non-string target', () => {
    const targets = ['field1', 123, 'field3'];
    const errors = validateLogicEffectTargets(targets, 'rule_1', 0);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].type).toBe('invalid_type');
    expect(errors[0].message).toBe('Target must be a string field ID');
  });

  test('should fail for non-existent field reference', () => {
    const targets = ['field1', 'non_existent_field'];
    const validFieldIds = new Set(['field1', 'field2']);
    const errors = validateLogicEffectTargets(targets, 'rule_1', 0, false, validFieldIds);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].type).toBe('invalid_value');
    expect(errors[0].message).toContain('does not exist');
  });

  test('should handle else effects with correct path', () => {
    const targets: string[] = [];
    const errors = validateLogicEffectTargets(targets, 'rule_1', 0, true);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].path).toContain('.else');
  });

  test('should pass when validFieldIds is not provided', () => {
    const targets = ['field1', 'field2'];
    const errors = validateLogicEffectTargets(targets, 'rule_1', 0);
    expect(errors).toHaveLength(0);
  });

  test('should fail for multiple invalid targets', () => {
    const targets = [123, 'field1', {}, 'field2'];
    const errors = validateLogicEffectTargets(targets, 'rule_1', 0);
    expect(errors.length).toBeGreaterThanOrEqual(2);
  });
});
