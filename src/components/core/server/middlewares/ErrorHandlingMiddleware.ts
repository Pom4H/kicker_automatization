import { ILogger } from '../../log/ILogger';
import { Request, Response, NextFunction } from 'express';
import { Middleware, HttpError, ExpressErrorMiddlewareInterface, NotFoundError,
  InternalServerError,
  BadRequestError } from 'routing-controllers';

import { inject, Type } from '../../di';

enum HttpCode {
  BadRequest = 400,
  NotFound = 404,
  InternalServer = 500,
  EntityTooLarge = 413,
}

type BodyParserError = {
  status: number,
  type: 'entity.too.large'
    | 'encoding.unsupported'
    | 'request.aborted'
    | 'request.size.invalid'
    | 'stream.encoding.set'
    | 'parameters.too.many'
    | 'charset.unsupported'
    | 'encoding.unsupported';
  limit?: number;
  expected?: number;
  length?: number;
};

@Middleware({ type: 'after', priority: 1 })
export class ErrorHandlingMiddleware implements ExpressErrorMiddlewareInterface {
  @inject(Type.AppLogger)
  protected logger!: ILogger;

  public error(error: Error, {}: Request, response: Response, next: NextFunction) {
    const extractedError = this.extractError(error);
    this.logError(extractedError);

    const coreHttpError = (extractedError instanceof HttpError)
      ? extractedError
      : this.createCoreHttpError(extractedError);

    let code: number;
    let data: any;
    if (coreHttpError) {
      code = this.identifyHttpCode(coreHttpError);
      data = coreHttpError.httpCode;
    } else {
      code = this.identifyHttpCode(extractedError);
      data = extractedError;
    }

    response.status(code).json(data);
    next();
  }

  protected extractError(error: Error): Error {
    const anyError: any = error;
    return (anyError.errors && (anyError.errors instanceof Error))
      ? anyError.errors
      : error;
  }

  protected logError(error: Error): void {
    const code = this.identifyHttpCode(error);
    (code === HttpCode.InternalServer)
      ? this.logger.fatal(error as any)
      : this.logger.error(error as any);
  }

  protected createCoreHttpError(error: Error): HttpError | null {
    let result = null;
    const code = this.identifyHttpCode(error);

    switch (code) {
      case HttpCode.BadRequest:
        result = new BadRequestError(error.message);
        break;

      case HttpCode.NotFound:
        result = new NotFoundError(error.message);
        break;

      case HttpCode.InternalServer:
        result = new InternalServerError(error.message);
        break;

      case HttpCode.EntityTooLarge:
        const bodyParserError = error as any as BodyParserError;
        if (undefined !== bodyParserError.limit && undefined !== bodyParserError.length) {
          result = new NotFoundError(
            `${error.message} (request ${bodyParserError.length}, limit ${bodyParserError.limit})`,
          );
        } else {
          result = new NotFoundError(error.message);
        }
        break;

    }

    return result;
  }

  protected identifyHttpCode(error: Error): number {
    let code = HttpCode.InternalServer;
    if (error instanceof HttpError) {
      code = error.httpCode;
    } else if (error instanceof HttpError) {
      code = error.httpCode as HttpCode;
    } else if (undefined !== (error as any as BodyParserError).status) {
      code = (error as any as BodyParserError).status;
    }
    return code;
  }

}
