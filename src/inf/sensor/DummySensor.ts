import { Sensor } from './Sensor';

class DummySensor implements Sensor {
  public listener?: Function;

  public watch(callback: Function): void {
    this.listener = callback();
  }

  public unwatch(): void {
    delete this.listener;
  }

  public unwatchAll(): void {
    delete this.listener;
  }

  public call(): void {
    if (this.listener) {
      this.listener();
    }
  }
}

export { DummySensor };
