/**
 * @fileOverview Common error class
 */
import { HttpErrorCode } from './HttpErrorCode';

type SerializedError<T = {}> = {
  code: string;
  message: string;
  httpCode: number;
  errorData?: T
};

abstract class SerializableError<T = {}> extends Error {
  protected httpCode: number;
  protected abstract code: string;

  constructor(message: string) {
    super(message);
    this.httpCode = HttpErrorCode.BAD_REQUEST_CODE;
  }

  public serialize(): SerializedError<T> {
    return {
      code: this.code,
      message: this.message,
      httpCode: this.httpCode
    };
  }
}

export { SerializedError, SerializableError };
