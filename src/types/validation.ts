/**
 * Validation Result Types
 * Error reporting and validation result structures
 */

export interface ValidationError {
  path: string;
  message: string;
  type: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}
