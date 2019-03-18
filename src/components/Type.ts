import { di } from '@framework';

export const Type = {
  ... di.Type,
  EnvironmentChecker: Symbol('EnvironmentChecker'),

  SensorService: Symbol('SensorService'),
};
