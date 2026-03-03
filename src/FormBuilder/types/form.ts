/**
 * Form Definition Types
 * Root form structure and configuration
 */

import { FormStatus } from './enums';
import { StyleSettings } from './styles';
import { Field } from './fields';
import { LogicRules } from './logic';

// ============================================================================
// FORM DEFINITION
// ============================================================================

export interface FormDefinition {
  formSettings: FormSettings;
  fields: Field[];
  logic?: LogicRules;
}

// ============================================================================
// FORM SETTINGS
// ============================================================================

export interface FormSettings {
  name: string;
  status: FormStatus;
  settings: StyleSettings;
}
