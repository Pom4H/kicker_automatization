import { HttpErrorCode } from './HttpErrorCode';
import { ValidationErrorFactory } from './ValidationErrorFactory';
import { SerializedError, SerializableError } from './SerializableError';
import { InternalServerError } from './InternalServerError';

enum ErrorCode {
    INTERNAL_SERVER_ERROR = 'InternalServerError',
    VALIDATION_ERROR = 'ValidationError'
}

class ErrorExtractor {
  public extract(error: Error): SerializedError {
    let serializedError: SerializedError;
    if (this.isDomainError(error)) {
      serializedError = this.createCoreError(error);
    } else if (this.isValidationError(error)) {
      serializedError = this.createValidationError(error);
    } else {
      serializedError = this.createInternalServerError(error);
    }
    return serializedError;
  }

  protected createCoreError(error: SerializableError): SerializedError {
    const errorData = error.serialize();
    return errorData;
  }

  protected createValidationError(error: Error): SerializedError {
    const validationErrorItems = ValidationErrorFactory.createValidationErrors((error as any).errors);
    return {
      code: ErrorCode.VALIDATION_ERROR,
      message: 'Invalid body',
      httpCode: HttpErrorCode.UNPROCESSABLE_ENTITY,
      errorData: {
        fields: validationErrorItems
      }
    };
  }

  protected createInternalServerError(error: Error): SerializedError {
    const internalServerError = InternalServerError.fromError(error);
    return internalServerError.serialize();
  }

  private isValidationError(error: Error): boolean {
    return Boolean((error as any).errors);
  }

  private isDomainError(error: Error): error is SerializableError {
    return error instanceof SerializableError;
  }

}

export { ErrorExtractor };
