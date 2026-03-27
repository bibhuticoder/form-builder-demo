/**
 * Email Template Definition
 * Root email structure and configuration
 */

import { EmailStatus } from './enums';
import { EmailStyleSettings } from './styles';
import { EmailBlock } from './blocks';

export interface EmailTemplate {
  templateSettings: TemplateSettings;
  blocks: EmailBlock[];
}

export interface CustomHeader {
  name: string;
  value: string;
}

export interface TemplateSettings {
  name: string;
  subject: string;
  preheader?: string;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
  cc?: string;
  bcc?: string;
  ccBccEnabled?: boolean;
  customHeaders?: CustomHeader[];
  sendAsPlainText?: boolean;
  status: EmailStatus;
  settings: EmailStyleSettings;
  updatedAt?: number;
}
