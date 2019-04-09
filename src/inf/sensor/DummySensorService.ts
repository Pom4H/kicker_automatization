import { di } from '@framework';
import { Type } from '@diType';
import { Logger } from 'pino';

import { ISensorService } from './ISensorService';
import { Sensor } from './Sensor';
import { Point } from '../point/Point';
import { DummySensor } from './DummySensor';

class DummySensorService implements ISensorService {
  private sensorMap: Map<Point, Sensor>;

  @di.inject(Type.AppLogger) private logger!: Logger;

  constructor() {
    this.sensorMap = new Map<Point, Sensor>();
  }

  public createSensor(point: Point): Sensor {
    const sensor = new DummySensor();
    this.sensorMap.set(point, sensor);
    return sensor;
  }

  public callPoint(point: Point) {
    const sensor: any = this.sensorMap.get(point);

    if (sensor && sensor.listener) {
      sensor.call();

      setTimeout(() => {
        sensor.call();
      }, 100);
    }
  }

  public createSensorHandler(callback: Function): any {
    let firstDetectionTime: number;
    let secondDetectionTime: number;
    return () => {
      if (firstDetectionTime) {
        secondDetectionTime = Date.now();
        const detectionTimeMs = secondDetectionTime - firstDetectionTime;
        if (detectionTimeMs > 1000) {
          this.logger.error(`Too slow detection: ${detectionTimeMs} ms!`);
        } else if (detectionTimeMs > 10) {
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
}

export { DummySensorService };
