import { SerializableError } from './SerializableError';
import { HttpErrorCode } from './HttpErrorCode';

class NotAuthorizedError extends SerializableError {
  protected code: string;

  constructor() {
    super('User must be authorized');
    this.code = 'NotAuthorizedError';
    this.httpCode = HttpErrorCode.FORBIDDEN_ERROR_CODE;
  }
}

export { NotAuthorizedError };
