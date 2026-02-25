export type AutomationValidationError = {
  path: string;
  message: string;
  type: string;
};

export type AutomationValidationResult = {
  valid: boolean;
  errors: AutomationValidationError[];
};
