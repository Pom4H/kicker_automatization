import { Sensor } from './Sensor';

export interface ISensorService {
  createSensor(point: string): Sensor;
}
