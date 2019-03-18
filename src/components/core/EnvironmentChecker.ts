import { Environment } from './Environment';

/**
 * Utility for environment related stuff.
 * Only for dependency stub usage
 *
 * @class EnvironmentChecker
 */
export class EnvironmentChecker {
  private currentEnv: string;

  /**
   * Creates an instance of EnvironmentChecker.
   * @param {string} env Sets current environment
   */
  constructor(env: string) {
    this.currentEnv = env;
  }

  /**
   * Returns true if envList contain currentEnv value
   *
   * @param {string[]} envList
   * @returns {boolean}
   */
  public hasEnvIn(envList: string[]): boolean {
    return envList.some(envName =>  this.currentEnv === envName);
  }

  public isProd(): boolean {
    return this.currentEnv === Environment.PROD;
  }

  public isDev(): boolean {
    return this.currentEnv === Environment.DEV;
  }
}
