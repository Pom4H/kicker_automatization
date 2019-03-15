import { GoalAction } from './GoalAction';

interface Gates {
  watch(action: GoalAction): void;
  unwatch(): void;
}

interface RedGates extends Gates {}

interface BlackGates extends Gates {}

export { RedGates, BlackGates };
