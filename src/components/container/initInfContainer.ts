import { Container } from 'inversify';
import { getConfigFacotry, EnvironmentChecker } from '@framework';
import { Type } from '@diType';

import { ServiceDiscovery as ServicesConfig, SensorListConfig } from '@config';

import { IServiceDiscovery } from '../restClient/IServiceDiscovery';
import { ServiceDiscovery } from '../restClient/ServiceDiscovery';

import { ISensorService } from '../../inf/sensor/ISensorService';
import { SensorService } from '../../inf/sensor/SensorService';
import { DummySensorService } from '../../inf/sensor/DummySensorService';
import { GameManager } from '../../inf/game/GameManager';

export async function initInfContainer(container: Container, options: { envName: string }): Promise<void> {
  const envChecker = new EnvironmentChecker(process.env[options.envName] as string);
  const configFactory = getConfigFacotry(container);
  const gameManager = new GameManager();
  await gameManager.init();
  container.bind<EnvironmentChecker>(Type.EnvironmentChecker).toConstantValue(envChecker);

  container
    .bind<IServiceDiscovery>(Type.ServiceDiscovery)
    .toConstantValue(new ServiceDiscovery(configFactory.create(ServicesConfig) as any));

  container.bind<GameManager>(Type.GameManager).toConstantValue(gameManager);

  envChecker.isProd() ?
  container
    .bind<ISensorService>(Type.SensorService)
    .toConstantValue(new SensorService(configFactory.create(SensorListConfig))) :
  container
    .bind<ISensorService>(Type.SensorService)
    .toConstantValue(new DummySensorService());
}
