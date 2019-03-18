import { ISensorService } from './ISensorService';
import { Sensor } from './Sensor';
import { Point } from '../../inf/point/point';
import { DummySensor } from './DummySensor';

class DummySensorService implements ISensorService {
  private sensorMap: Map<Point, Sensor>;

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
    }
  }
}

export { DummySensorService };
