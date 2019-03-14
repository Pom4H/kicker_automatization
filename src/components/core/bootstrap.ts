import { Environment } from './Environment';
import 'reflect-metadata';
import 'source-map-support/register';

export const bootstrap = (envName: string) => {
  if (!process.env[envName]) {
    throw new Error(`Environment variable ${envName} is not set`);
  }
  const supportedEnvironment = Object.keys(Environment).map(key => Environment[key as any]);

  if (!supportedEnvironment.includes(process.env[envName] as string)) {
    throw new Error(
      `Invalid env ${envName} value: ${process.env[envName]}!` +
      ` Env var should be one of: ${supportedEnvironment.join(', ')}`
    );
  }

};
