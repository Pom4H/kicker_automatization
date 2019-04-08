import { Config } from '@framework';
import { IsNumber, IsString, IsBoolean, IsArray, IsNotEmpty, IsIn, ValidateNested } from 'class-validator';
import { Direction, Edge, Options } from 'onoff';

class SensorListConfig extends Config {
  @IsNumber()
  public minDetectionTime!: number;
  
  @IsNumber()
  public maxDetectionTime!: number;

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
class SensorConfig {
  @IsNotEmpty()
  @IsString()
  public point!: string;

  @IsNotEmpty()
  @IsNumber()
  public gpio!: number;

  @IsNotEmpty()
  @IsIn(['in', 'out', 'high', 'low'])
  public direction!: Direction;
  
  @IsIn(['none', 'rising', 'falling', 'both'])
  public edge?: Edge;
  
  @ValidateNested()
  public options?: Options;

  constructor() {
    this.options = new SensorOptionsConfig();
  }
}
class SensorOptionsConfig {
  @IsNumber()
  public debounceTimeout?: number;

  @IsBoolean()
  public activeLow?: boolean;

  @IsBoolean()
  public reconfigureDirection?: boolean;
}

export { SensorConfig, SensorListConfig };
