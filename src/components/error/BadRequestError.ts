import { SerializableError } from './SerializableError';
import { HttpErrorCode } from './HttpErrorCode';

class BadRequestError extends SerializableError {
  protected code: string;

  constructor(message: string) {
    super(message);
    this.code = 'BadRequestError';
    this.httpCode = HttpErrorCode.BAD_REQUEST_CODE;
  }
}

export { BadRequestError };
