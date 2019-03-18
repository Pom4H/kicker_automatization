import * as path from 'path';
import { Container } from 'inversify';
import { Type } from './Type';

import { ConfigFactory } from './config/lib';
import { LoggerFactory, ILogger } from './log';
import { LoggingConfig, ServerConfig } from './config';

/**
 * Init Logger, Configs, Db Connection
 */
export const bindMainComponents = async(container: Container, options: { baseDir: string; envName: string; }) => {
  const configFactory = new ConfigFactory(
    path.resolve(options.baseDir, '../config'),
    process.env[options.envName] as string
  );

  const loggerFactory = new LoggerFactory();
  const loggingConfig = configFactory.create(LoggingConfig);

  container.bind<ConfigFactory>(Type.ConfigFactory).toConstantValue(configFactory);
  container.bind<ServerConfig>(Type.ServerConfig).toConstantValue(configFactory.create(ServerConfig));

  container.bind<ILogger>(Type.AppLogger).toConstantValue(loggerFactory.create(loggingConfig.application));
  container.bind(Type.AccessLogger).toConstantValue(loggerFactory.create(loggingConfig.access));

};

export const getConfigFacotry = (container: Container): ConfigFactory => {
  return container.get<ConfigFactory>(Type.ConfigFactory);
};
