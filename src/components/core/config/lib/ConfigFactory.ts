import { plainToClassFromExist } from 'class-transformer';
import { ConfigSource } from './ConfigSource';
import { Config } from './Config';
import { Newable } from './Newable';

export class ConfigFactory {
  private configSource: ConfigSource;

  constructor(pathToConfigDir: string, env: string) {
    this.configSource = new ConfigSource(pathToConfigDir, env);
  }
  
  public create<T extends Config>(configConstructor: Newable<T>): T {
    const config = new configConstructor;
    plainToClassFromExist(
      config,
      Object.assign(config.getDefaults(), this.configSource.getConfig(config.getName()))
      );
    config.validate();
    return config;
  }
}
