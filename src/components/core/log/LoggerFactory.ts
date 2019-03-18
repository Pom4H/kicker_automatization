import * as pino from 'pino';
import { ILogger } from './ILogger';

type LoggerConfig = {
  level: string;
  name: string;
};

export class LoggerFactory {
  public create(config: LoggerConfig): ILogger {
    return pino(config);
  }
}
