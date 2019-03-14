import { resolve } from 'path';
import { requireFilesFromDir } from './requireConfigObject';

type FullConfiguration = {
  [key: string]: Configuration;
};

type Configuration = {
  [key: string]: any;
};

class ConfigSource {
  private environment: string;
  private configPath: string;
  private defaultConfigPath: string;
  private fullConfig: Map<string, Configuration>;

  constructor(pathToConfigDir: string, env: string) {
    this.environment = env;
    const wildcard = '*';
    const defaultConfigName = 'base';
    this.defaultConfigPath = resolve(pathToConfigDir, defaultConfigName, wildcard);
    this.configPath = resolve(pathToConfigDir, env, wildcard);
    this.fullConfig = new Map<string, Configuration>();
    this.init();
  }

  /*
  * @param {string} name Название файла из папки конфигов. Без расширения
  */
  public getConfig(name: string): Configuration {
    const config = this.fullConfig.get(name);
    if (!config) {
      throw new Error(`Config not found! Name: ${name}`);
    }
    return config;
  }

  public getFull(): FullConfiguration {
    const configObject: FullConfiguration = {};
    [...this.fullConfig].forEach((config) => {
      configObject[config[0]] = config[1];
    });
    return configObject;
  }

  public print(): void {
    console.log(`Env: ${this.environment}`);
    [...this.fullConfig].forEach((config) => {
      try {
        console.log(JSON.stringify(config[1], null, 2));
      } catch (error) {
        console.error(`Error: Config parse error - ${config[0]}`);
      }
    });
  }

  private init(): void {
    requireFilesFromDir([this.defaultConfigPath, this.configPath])
      .forEach((config) => {
        if (this.fullConfig.has(config.name)) {
          this.fullConfig.set(config.name, Object.assign(this.fullConfig.get(config.name), config.content));
        } else {
          this.fullConfig.set(config.name, config.content);
        }
      });
  }
}

export { ConfigSource, Configuration };
