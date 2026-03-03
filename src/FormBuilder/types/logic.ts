/**
 * Logic Rule Types
 * Conditional behavior definitions for forms
 */

import { LogicEvent, LogicComparison, LogicEffect, ToastVariant, LogicActionType } from './enums';

export const ON_SUBMIT_LOGIC_TYPES: ReadonlyArray<LogicActionType> = [LogicActionType.REDIRECT, LogicActionType.MESSAGE];
export const IN_FORM_LOGIC_TYPES: ReadonlyArray<LogicActionType> = [LogicActionType.DISQUALIFY, LogicActionType.VISIBILITY];

// ============================================================================
// LOGIC TRIGGER
// ============================================================================

export interface LogicTrigger {
  event: LogicEvent;
  fieldId?: string;
}

// ============================================================================
// LOGIC CONDITIONS & EXPRESSIONS
// ============================================================================

export interface LogicCondition {
  id: string; // Unique ID for React rendering
  comparison: LogicComparison;
  left: LogicOperand;
  right?: LogicOperand; // optional for unary operators like exists/isEmpty
  logicalOp?: 'and' | 'or'; // Operator connecting to the NEXT condition
}

export interface LogicOperand {
  var?: string;
  str?: string;
  num?: number;
  bool?: boolean;
}

export interface LogicExpression {
  conditions: LogicCondition[];
}

// ============================================================================
// LOGIC EFFECTS
// ============================================================================

export interface LogicEffectFieldVisibility {
  effect: typeof LogicEffect.FIELD_VISIBILITY_SET;
  targets: string[];
  value: boolean;
}

export interface LogicEffectNavRedirect {
  effect: typeof LogicEffect.NAV_REDIRECT;
  url: string;
}

export interface LogicEffectSubmissionReject {
  effect: typeof LogicEffect.SUBMISSION_REJECT;
  error: {
    fieldId?: string;
    message: string;
  };
}

export interface LogicEffectUIToast {
  effect: typeof LogicEffect.UI_TOAST;
  variant: ToastVariant;
  title: string;
  body: string;
}

export type LogicEffectAction =
  | LogicEffectFieldVisibility
  | LogicEffectNavRedirect
  | LogicEffectSubmissionReject
  | LogicEffectUIToast;

// ============================================================================
// LOGIC RULE
// ============================================================================

export interface LogicRule {
  id: string;
  enabled: boolean;
  trigger: LogicTrigger;
  if?: LogicExpression;
  then: LogicEffectAction[];
  else?: LogicEffectAction[];
}

export interface LogicRules {
  version: number;
  rules: LogicRule[];
}
