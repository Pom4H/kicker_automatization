const logger = require('express-pino-logger');
import { ILogger } from '../../log';
import { inject, Type } from '../../di';

export class AccessLogMiddlewareFactory {
  @inject(Type.AccessLogger)
  protected logger!: ILogger;

  public create(): any {
    return logger({
      logger: this.logger
    });
  }
}
