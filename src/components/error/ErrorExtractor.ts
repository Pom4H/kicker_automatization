import { SerializedError, SerializableError } from './SerializableError';
import { InternalServerError } from './InternalServerError';

class ErrorExtractor {
  public extract(error: Error): SerializedError {
    let serializedError: SerializedError;
    if (this.isDomainError(error)) {
      serializedError = this.createCoreError(error);
    } else {
      serializedError = this.createInternalServerError(error);
    }
    return serializedError;
  }

  protected createCoreError(error: SerializableError): SerializedError {
    const errorData = error.serialize();
    return errorData;
  }

  protected createValidationError(error: SerializableError): SerializedError {
    const errorData = error.serialize();
    return errorData;
  }

  protected createInternalServerError(error: Error): SerializedError {
    const internalServerError = InternalServerError.fromError(error);
    return internalServerError.serialize();
  }

  private isDomainError(error: Error): error is SerializableError {
    return error instanceof SerializableError;
  }

}

export { ErrorExtractor };
