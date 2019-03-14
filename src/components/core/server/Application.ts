import * as Express from 'express';
import * as path from 'path';
import * as cluster from 'cluster';
import { useExpressServer } from 'routing-controllers';
import { ServerConfig } from '../config';
import { ILogger } from '../log';
import { AccessLogMiddlewareFactory } from './middlewares/AccessLogMiddlewareFactory';
import { inject, Type } from '../di';

export class Application {
  @inject(Type.ServerConfig)
  protected config!: ServerConfig;
  @inject(Type.AppLogger)
  protected logger!: ILogger;
  protected app: Express.Application;

  constructor(controllers: Function[] | string[], middlewares: Function[] | string[]) {
    this.app = Express();

    this.app.disable('etag');
    this.app.disable('x-powered-by');

    this.app.use(
      Express.static(path.join(__dirname, '../../../../static'))
  );

    this.app.use((new AccessLogMiddlewareFactory).create());

    useExpressServer(
      this.app,
      {
        controllers,
        middlewares,
        defaultErrorHandler: false,
      },
    );
  }

  public run(): void {
    if (this.config.workers) {
      this.startClusterServer();
    } else {
      this.startServer();
    }
  }

  private startClusterServer(): void {
    if (cluster.isMaster) {
      const workersCount = this.config.workers || 1;
      this.logger.info(`Starting ${workersCount} workers`);
      for (let i = 0; i < workersCount; i = i + 1) {
        cluster.fork();
      }
    } else {
      this.startServer();
    }
  }

  private startServer(): void {
    const { host, port } = this.config;
    this.app.listen({ host, port }, () => {
      this.logger.info(`Server started at http://${host}:${port}`);
    });
  }
}
