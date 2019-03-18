import { Config } from '@framework';
import { IsNotEmpty, IsString } from 'class-validator';

export class ServiceDiscovery extends Config {
  @IsNotEmpty()
  @IsString()
  public statsApi!: string;

  @IsNotEmpty()
  @IsString()
  public statsToken!: string;

  public getName(): string {
    return 'services';
  }
}
