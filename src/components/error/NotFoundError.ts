/**
 * @fileOverview Error, which occurs when entity not found or does not exists
 */
import { upperFirst } from 'lodash';
import { SerializableError } from './SerializableError';
import { HttpErrorCode } from './HttpErrorCode';

class NotFoundError extends SerializableError {
  protected code: string;
  protected httpCode: number;

  constructor(entityName: string, message?: string) {
    const name = upperFirst(entityName);
    const errorMessage = message || `${name} not found`;
    super(errorMessage);

    this.httpCode = HttpErrorCode.NOT_FOUND_CODE;
    this.code = `${name}NotFoundError`;
  }
}

export { NotFoundError };
