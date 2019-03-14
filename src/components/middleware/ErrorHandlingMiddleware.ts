import { di, ILogger } from '@framework';
import { Request, Response, NextFunction } from 'express';
import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { ErrorExtractor, HttpErrorCode } from '@error';

type NormalizedError<T = { stack?: string; }> = {
  code: string;
  httpCode: number;
  message: string;
  errorData?: T;
};

@Middleware({ type: 'after' })
export class ErrorHandlingMiddleware implements ExpressErrorMiddlewareInterface {
  @di.inject(di.Type.AppLogger)
  protected logger!: ILogger;
  private errorExtractor: ErrorExtractor;

  constructor() {
    this.errorExtractor = new ErrorExtractor();
  }

  public error(error: Error, _request: Request, response: Response, next: NextFunction) {
    const extractedError: NormalizedError = this.errorExtractor.extract(error);
    this.logError(extractedError);

    const { httpCode, code, message, errorData } = extractedError;
    if (errorData) {
      errorData.stack = undefined;
    }
    response.status(httpCode).json({ code, message, ...errorData });
    next();
  }

  protected logError(error: NormalizedError): void {
    if (error.httpCode === HttpErrorCode.INTERNAL_SERVER_CODE) {
      this.logger.fatal(error);
    } else {
      this.logger.error(error);
    }
  }

}
