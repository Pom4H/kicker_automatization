import { Config } from './lib';
import { IsNotEmpty, IsEnum, IsString, ValidateNested } from 'class-validator';

export enum LoggerName {
  application = 'application',
  access = 'access',
}

export enum LoggerLevel {
  trace = 'trace',
  debug = 'debug',
  info = 'info',
  warn = 'warn',
  error = 'error',
  fatal = 'fatal'
}

export class LoggerConfig {
  @IsNotEmpty()
  @IsString()
  @IsEnum(LoggerName)
  public name!: LoggerName;

  @IsNotEmpty()
  @IsString()
  @IsEnum(LoggerLevel)
  public level!: LoggerLevel;
}

export class PinoLogging extends Config {
  @IsNotEmpty()
  @ValidateNested()
  public application!: LoggerConfig;

  @IsNotEmpty()
  @ValidateNested()
  public access!: LoggerConfig;

  public getName(): string {
    return 'logging';
  }

  public validate(): void | never {
    super.validate();
    this.validateNested(this.application, LoggerConfig);
    this.validateNested(this.access, LoggerConfig);
  }
}
