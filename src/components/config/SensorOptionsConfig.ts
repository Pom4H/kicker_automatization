import { IsNumber, IsBoolean } from 'class-validator';

export class SensorOptionsConfig {
  @IsNumber()
  public debounceTimeout?: number;

  @IsBoolean()
  public activeLow?: boolean;

  @IsBoolean()
  public reconfigureDirection?: boolean;
}
