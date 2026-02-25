import type { AutomationValidationError, AutomationValidationResult } from '../types';

export class AutomationValidationResultBuilder {
  private errors: AutomationValidationError[] = [];

  addError(path: string, message: string, type: string = 'validation'): this {
    this.errors.push({ path, message, type });
    return this;
  }

  addErrors(errors: AutomationValidationError[]): this {
    this.errors.push(...errors);
    return this;
  }

  build(): AutomationValidationResult {
    return {
      valid: this.errors.length === 0,
      errors: this.errors,
    };
  }
}
