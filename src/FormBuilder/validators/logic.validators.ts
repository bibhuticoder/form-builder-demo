/**
 * Logic Rule Validators
 * Validation for logic rules and conditions
 */

import {
  LogicRule,
  LogicEvent,
  LogicComparison,
  LogicOperation,
  LogicEffect,
} from '../types';
import { ValidationError } from '../types/validation';

export const validateLogicTrigger = (
  trigger: any,
  ruleId: string,
  validFieldIds?: Set<string>,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const validEvents = Object.values(LogicEvent);

  if (!trigger || typeof trigger !== 'object') {
    errors.push({
      path: `logic.rules[${ruleId}].trigger`,
      message: 'Logic trigger is required and must be an object',
      type: 'missing_required',
    });
    return errors;
  }

  if (!trigger.event || !validEvents.includes(trigger.event)) {
    errors.push({
      path: `logic.rules[${ruleId}].trigger.event`,
      message: `Trigger event must be one of: ${validEvents.join(', ')}`,
      type: 'invalid_value',
    });
  }

  if (trigger.fieldId && typeof trigger.fieldId !== 'string') {
    errors.push({
      path: `logic.rules[${ruleId}].trigger.fieldId`,
      message: 'Trigger fieldId must be a string',
      type: 'invalid_type',
    });
  } else if (trigger.fieldId && validFieldIds && !validFieldIds.has(trigger.fieldId)) {
    errors.push({
      path: `logic.rules[${ruleId}].trigger.fieldId`,
      message: `Trigger fieldId "${trigger.fieldId}" does not exist in form fields`,
      type: 'invalid_value',
    });
  }

  return errors;
};

export const validateLogicComparison = (
  comparison: any,
  ruleId: string,
  conditionIndex: number,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const validComparisons = Object.values(LogicComparison);

  if (!comparison || typeof comparison !== 'string') {
    errors.push({
      path: `logic.rules[${ruleId}].if.args[${conditionIndex}].comparison`,
      message: 'Comparison must be a string',
      type: 'missing_required',
    });
  } else if (!validComparisons.includes(comparison as LogicComparison)) {
    errors.push({
      path: `logic.rules[${ruleId}].if.args[${conditionIndex}].comparison`,
      message: `Comparison must be one of: ${validComparisons.join(', ')}`,
      type: 'invalid_value',
    });
  }

  return errors;
};

export const validateLogicCondition = (
  condition: any,
  ruleId: string,
  conditionIndex: number,
  path: string = '',
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const basePath = path || `logic.rules[${ruleId}].if.args[${conditionIndex}]`;

  if (!condition || typeof condition !== 'object') {
    errors.push({
      path: basePath,
      message: 'Condition must be an object',
      type: 'invalid_type',
    });
    return errors;
  }

  errors.push(...validateLogicComparison(condition.comparison, ruleId, conditionIndex));

  if (!condition.left || typeof condition.left !== 'object') {
    errors.push({
      path: `${basePath}.left`,
      message: 'Condition left operand is required',
      type: 'missing_required',
    });
  }

  // Right operand is optional for unary operators like exists/isEmpty
  const unaryOperators = [LogicComparison.EXISTS, LogicComparison.IS_EMPTY];
  const requiresRight = !unaryOperators.includes(condition.comparison);

  if (requiresRight && (!condition.right || typeof condition.right !== 'object')) {
    errors.push({
      path: `${basePath}.right`,
      message: 'Condition right operand is required for binary operators',
      type: 'missing_required',
    });
  }

  return errors;
};

export const validateLogicExpression = (
  expression: any,
  ruleId: string,
  path: string = '',
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const validOperations = Object.values(LogicOperation);
  const basePath = path || `logic.rules[${ruleId}].if`;

  if (!expression || typeof expression !== 'object') {
    errors.push({
      path: basePath,
      message: 'Logic expression is required and must be an object',
      type: 'missing_required',
    });
    return errors;
  }

  if (!expression.operation || !validOperations.includes(expression.operation)) {
    errors.push({
      path: `${basePath}.operation`,
      message: `Operation must be one of: ${validOperations.join(', ')}`,
      type: 'invalid_value',
    });
  }

  if (!Array.isArray(expression.args)) {
    errors.push({
      path: `${basePath}.args`,
      message: 'Expression args must be an array',
      type: 'invalid_type',
    });
  } else {
    expression.args.forEach((arg: any, index: number) => {
      const argPath = `${basePath}.args[${index}]`;

      // Check if this is a nested expression or a condition
      if (arg.operation) {
        // Nested expression
        const nestedErrors = validateLogicExpression(arg, ruleId, argPath);
        errors.push(...nestedErrors);
      } else if (arg.comparison) {
        // Condition
        const conditionErrors = validateLogicCondition(arg, ruleId, index, argPath);
        errors.push(...conditionErrors);
      } else {
        // Invalid - neither expression nor condition
        errors.push({
          path: argPath,
          message: 'Argument must be either a LogicExpression (with operation) or LogicCondition (with comparison)',
          type: 'invalid_type',
        });
      }
    });
  }

  return errors;
};


export const validateLogicEffectTargets = (
  targets: any,
  ruleId: string,
  effectIndex: number,
  isElse: boolean = false,
  validFieldIds?: Set<string>,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const effectPath = isElse ? `logic.rules[${ruleId}].else` : `logic.rules[${ruleId}].then`;

  if (!Array.isArray(targets)) {
    errors.push({
      path: `${effectPath}[${effectIndex}].targets`,
      message: 'Effect targets must be an array',
      type: 'invalid_type',
    });
    return errors;
  }

  if (targets.length === 0) {
    errors.push({
      path: `${effectPath}[${effectIndex}].targets`,
      message: 'Effect targets array cannot be empty',
      type: 'invalid_value',
    });
  }

  targets.forEach((target: any, targetIndex: number) => {
    if (typeof target !== 'string') {
      errors.push({
        path: `${effectPath}[${effectIndex}].targets[${targetIndex}]`,
        message: 'Target must be a string field ID',
        type: 'invalid_type',
      });
    } else if (validFieldIds && !validFieldIds.has(target)) {
      errors.push({
        path: `${effectPath}[${effectIndex}].targets[${targetIndex}]`,
        message: `Target field ID "${target}" does not exist in form fields`,
        type: 'invalid_value',
      });
    }
  });

  return errors;
};

export const validateLogicEffect = (
  effect: any,
  ruleId: string,
  effectIndex: number,
  isElse: boolean = false,
  validFieldIds?: Set<string>,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const validEffects = Object.values(LogicEffect);
  const effectPath = isElse ? `logic.rules[${ruleId}].else` : `logic.rules[${ruleId}].then`;

  if (!effect || typeof effect !== 'object') {
    errors.push({
      path: `${effectPath}[${effectIndex}]`,
      message: 'Effect must be an object',
      type: 'invalid_type',
    });
    return errors;
  }

  if (!effect.effect || !validEffects.includes(effect.effect)) {
    errors.push({
      path: `${effectPath}[${effectIndex}].effect`,
      message: `Effect must be one of: ${validEffects.join(', ')}`,
      type: 'invalid_value',
    });
  }

  // Validate targets for FIELD_VISIBILITY_SET effect
  if (effect.effect === LogicEffect.FIELD_VISIBILITY_SET && effect.targets) {
    const targetErrors = validateLogicEffectTargets(effect.targets, ruleId, effectIndex, isElse, validFieldIds);
    errors.push(...targetErrors);
  }

  return errors;
};

export const validateLogicRule = (
  rule: LogicRule,
  ruleIndex: number,
  validFieldIds?: Set<string>,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!rule.id || typeof rule.id !== 'string') {
    errors.push({
      path: `logic.rules[${ruleIndex}].id`,
      message: 'Logic rule id is required and must be a string',
      type: 'missing_required',
    });
    return errors;
  }

  const ruleId = rule.id;

  if (typeof rule.enabled !== 'boolean') {
    errors.push({
      path: `logic.rules[${ruleIndex}].enabled`,
      message: 'Logic rule enabled must be a boolean',
      type: 'invalid_type',
    });
  }

  errors.push(...validateLogicTrigger(rule.trigger, ruleId, validFieldIds));
  errors.push(...validateLogicExpression(rule.if, ruleId));

  if (!Array.isArray(rule.then)) {
    errors.push({
      path: `logic.rules[${ruleIndex}].then`,
      message: 'Logic rule then must be an array',
      type: 'invalid_type',
    });
  } else {
    rule.then.forEach((effect, effectIndex) => {
      const effectErrors = validateLogicEffect(effect, ruleId, effectIndex, false, validFieldIds);
      errors.push(...effectErrors);
    });
  }

  if (rule.else && Array.isArray(rule.else)) {
    rule.else.forEach((effect, effectIndex) => {
      const effectErrors = validateLogicEffect(effect, ruleId, effectIndex, true, validFieldIds);
      errors.push(...effectErrors);
    });
  }

  return errors;
};

export const validateLogicRules = (logic: any, validFieldIds?: Set<string>): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!logic || typeof logic !== 'object') {
    // Logic rules are optional
    return errors;
  }

  if (typeof logic.version !== 'number') {
    errors.push({
      path: 'logic.version',
      message: 'Logic version must be a number',
      type: 'invalid_type',
    });
  }

  if (!Array.isArray(logic.rules)) {
    errors.push({
      path: 'logic.rules',
      message: 'Logic rules must be an array',
      type: 'invalid_type',
    });
    return errors;
  }

  const ruleIds = new Set<string>();
  logic.rules.forEach((rule: any, index: number) => {
    if (rule.id && ruleIds.has(rule.id)) {
      errors.push({
        path: `logic.rules[${rule.id}].id`,
        message: `Duplicate rule id: "${rule.id}" already exists`,
        type: 'duplicate',
      });
    } else if (rule.id) {
      ruleIds.add(rule.id);
    }

    const ruleErrors = validateLogicRule(rule, index, validFieldIds);
    // Replace leading logic.rules[index] with logic.rules[id] in error paths for consistency
    const indexPrefix = `logic.rules[${index}]`;
    const updatedErrors = ruleErrors.map((error) => {
      if (rule.id && typeof error.path === 'string' && error.path.startsWith(indexPrefix)) {
        const suffix = error.path.slice(indexPrefix.length);
        return {
          ...error,
          path: `logic.rules[${rule.id}]${suffix}`,
        };
      }
      return error;
    });
    errors.push(...updatedErrors);
  });

  return errors;
};
