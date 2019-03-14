/**
 * @fileOverview Common error class
 */
import { SerializedError, SerializableError } from './SerializableError';
import { HttpErrorCode } from './HttpErrorCode';

class InternalServerError extends SerializableError<{ stack?: string }> {
  public static readonly DEFAULT_MESSAGE = 'Internal server error';

  protected code: string;

  constructor(error: string | Error) {
    let message: string;
    let stack: string | undefined;

    if (typeof error === 'string') {
      message = error;
    } else {
      message = error.message || InternalServerError.DEFAULT_MESSAGE;
      stack = error.stack;
    }

    super(message);
    this.code = 'InternalServerError';
    this.httpCode = HttpErrorCode.INTERNAL_SERVER_CODE;
    this.stack = stack;
  }

  public static fromError(error: Error): InternalServerError {
    return new InternalServerError(error);
  }

  public static fromMessage(message: string): InternalServerError {
    return new InternalServerError(message);
  }

  public serialize(): SerializedError<{ stack?: string }> {
    return {
      code: this.code,
      message: this.message,
      httpCode: this.httpCode,
      errorData: {
        stack: this.stack
      }
    };
  }
}

export { InternalServerError };
