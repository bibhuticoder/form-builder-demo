/**
 * Validation Result Builder
 * Helper class for building validation results
 */

import { ValidationError, ValidationResult } from '../types/validation';

export class ValidationResultBuilder {
  private errors: ValidationError[] = [];

  addError(path: string, message: string, type: string = 'validation'): this {
    this.errors.push({ path, message, type });
    return this;
  }

  addErrors(errors: ValidationError[]): this {
    this.errors.push(...errors);
    return this;
  }

  build(): ValidationResult {
    return {
      valid: this.errors.length === 0,
      errors: this.errors,
    };
  }
}
