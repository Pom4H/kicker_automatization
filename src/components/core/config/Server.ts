import { Config } from './lib';
import { IsInt, IsNotEmpty, IsString, Max, Min, IsOptional } from 'class-validator';

export class Server extends Config {
  @IsNotEmpty()
  @IsString()
  public host!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1024)
  @Max(65536)
  public port!: number;

  @IsOptional()
  @IsInt()
  public workers?: number;

  public getName(): string {
    return 'server';
  }
}
