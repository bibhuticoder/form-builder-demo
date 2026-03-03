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

export interface TemplateSettings {
  name: string;
  subject: string;
  preheader?: string;
  status: EmailStatus;
  settings: EmailStyleSettings;
}
