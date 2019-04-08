import { ValueCallback } from 'onoff';

type GoalAction = ValueCallback;

interface Gates {
  watch(action: GoalAction): void;
  unwatch(action?: GoalAction): void;
  unwatchAll(): void;
}

interface RedGates extends Gates {}
interface BlackGates extends Gates {}

export { RedGates, BlackGates };
