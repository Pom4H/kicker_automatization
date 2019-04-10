import { Sensor } from './Sensor';
import { ValueCallback } from 'onoff';

export interface ISensorService {
  createSensor(point: string): Sensor;
  createSensorHandler(callback: Function): ValueCallback;
}
