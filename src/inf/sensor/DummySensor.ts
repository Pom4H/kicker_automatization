import { Sensor } from './Sensor';

class DummySensor implements Sensor {
  public listener: any;

  public watch(callback: any): void {
    this.listener = callback;
  }

  public unwatch(): void {
    delete this.listener;
  }

  public call(): void {
    this.listener();
  }
}

export { DummySensor };
