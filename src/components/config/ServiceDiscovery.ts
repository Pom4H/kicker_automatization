import { Config } from '@framework';
import { IsNotEmpty, IsString } from 'class-validator';

export class ServiceDiscovery extends Config {
  @IsNotEmpty()
  @IsString()
  public api!: string;

  @IsNotEmpty()
  @IsString()
  public token!: string;

  public getName(): string {
    return 'services';
  }
}
