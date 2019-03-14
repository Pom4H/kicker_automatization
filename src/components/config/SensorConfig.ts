import { IsNotEmpty, IsString, IsNumber, ValidateNested } from 'class-validator';
import { Direction, Edge, Options } from 'onoff';
import { SensorOptionsConfig } from './SensorOptionsConfig';

export class SensorConfig {
  @IsNotEmpty()
  @IsString()
  public point!: string;

  @IsNotEmpty()
  @IsNumber()
  public gpio!: number;

  @IsString()
  public direction!: Direction;
  
  @IsString()
  public edge?: Edge;
  
  @ValidateNested()
  public options?: Options;

  constructor() {
    this.options = new SensorOptionsConfig();
  }
}
