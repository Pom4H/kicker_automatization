import { Gpio } from 'onoff';

import { Sensor } from './Sensor';
import { SensorConfig, SensorListConfig } from '@config';
import { ISensorService } from './ISensorService';

class SensorService implements ISensorService {

  private sensorListConfig: SensorListConfig;

  constructor(sensorListConfig: SensorListConfig) {
    this.sensorListConfig = sensorListConfig;
  }

  public createSensor(point: string): Sensor {
    const sensorConfig = this.getSensorConfig(point);
    const { gpio, direction, edge, options } = sensorConfig;
    const sensor = new Gpio(gpio, direction, edge, options);
    
    return sensor; 
  }

  private getSensorConfig(point: string): SensorConfig {
    const sensorConfig = this.sensorListConfig.sensors.find(sensorConfig => sensorConfig.point === point);
    if (!sensorConfig) {
      throw new Error(`Sensor config for point: ${point} is not found!`);
    }
    return sensorConfig;
  }
}

export { SensorService };
