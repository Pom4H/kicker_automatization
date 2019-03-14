import { ValidationError } from 'class-validator';
import { ClassValidatorError, ValidationErrorItems } from '@c7s/http-errors';

class ValidationErrorFactory extends ClassValidatorError {
  public static createValidationErrors(cvErrors: ValidationError[]): ValidationErrorItems {
    return super.createValidationErrors(cvErrors);
  }
}

export { ValidationErrorFactory };
