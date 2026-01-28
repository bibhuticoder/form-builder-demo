/**
 * API Request/Response Types
 * Types for API integration
 */

import { FormDefinition, FormSettings } from './form';
import { Field } from './fields';
import { LogicRules } from './logic';

export interface CreateFormRequest {
  formSettings: FormSettings;
  fields: Field[];
  logic?: LogicRules;
}

export interface UpdateFormRequest extends CreateFormRequest {}

export interface PublishFormRequest {
  formId: string;
}

export interface FormResponse {
  id: string;
  version: number;
  definition: FormDefinition;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
