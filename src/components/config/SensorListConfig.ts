import { Config } from '@framework';
import { IsArray, ValidateNested } from 'class-validator';
import { SensorConfig } from './SensorConfig';

export class SensorListConfig extends Config {
  @IsArray()
  @ValidateNested({ each: true })
  public sensors!: SensorConfig[];

  constructor() {
    super();
    this.sensors = Array(20).fill(null).map(_sensor => new SensorConfig());
  }

  public getName(): string {
    return 'sensor';
  }
}
