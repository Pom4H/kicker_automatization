import { Config } from '@framework';
import { IsNotEmpty, IsString } from 'class-validator';

export class ServiceDiscovery extends Config {
  @IsNotEmpty()
  @IsString()
  public serverApi!: string;

  @IsNotEmpty()
  @IsString()
  public serverToken!: string;

  public getName(): string {
    return 'services';
  }
}
