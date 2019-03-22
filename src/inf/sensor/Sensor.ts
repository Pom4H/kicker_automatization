import { ValueCallback } from 'onoff';

interface Sensor {
  watch(callback: ValueCallback): void;
  unwatch(callback?: ValueCallback): void;
  unwatchAll(): void;
}

export { Sensor };
