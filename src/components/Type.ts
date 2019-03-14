import { di } from '@framework';

export const Type = {
  ... di.Type,
  EnvironmentChecker: Symbol('EnvironmentChecker'),

  GameManager: Symbol('GameManager'),
  SensorService: Symbol('SensorService'),
};
