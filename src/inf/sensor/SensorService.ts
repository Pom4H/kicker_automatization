import { Gpio, ValueCallback } from 'onoff';
import { di } from '@framework';
import { Type } from '@diType';
import { Logger } from 'pino';

import { Sensor } from './Sensor';
import { SensorConfig, SensorListConfig } from '@config';
import { ISensorService } from './ISensorService';

class SensorService implements ISensorService {

  @di.inject(Type.AppLogger) private logger!: Logger;
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

  public createSensorHandler(callback: any): ValueCallback {
    let firstDetectionTime: number;
    let secondDetectionTime: number;
    return (err, value) => {
      if (err) {
        throw err;
      }
      if (!value) {
        secondDetectionTime = Date.now();
        const detectionTimeMs = secondDetectionTime - firstDetectionTime;
        if (detectionTimeMs > this.sensorListConfig.maxDetectionTime) {
          this.logger.error(`Too slow detection: ${detectionTimeMs} ms!`);
        } else if (detectionTimeMs > this.sensorListConfig.minDetectionTime) {
          this.logger.info(`Succeed detection: ${detectionTimeMs} ms!`);
          callback();
        } else {
          this.logger.error(`Too fast detection: ${detectionTimeMs} ms!`);
        }
      } else {
        firstDetectionTime = Date.now();
      }
    };
  }

  private getSensorConfig(point: string): SensorConfig | never {
    const sensorConfig = this.sensorListConfig.sensors.find(sensorConfig => sensorConfig.point === point);
    if (!sensorConfig) {
      this.logger.fatal(`Sensor config for point: ${point} is not found!`);
      throw process.exit(1);
    }
    return sensorConfig;
  }
}

export { SensorService };
