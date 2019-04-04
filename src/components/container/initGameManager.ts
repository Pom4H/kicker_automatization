import { Container } from 'inversify';
import { Type } from '@diType';

import { GameManager } from '../../inf/game/GameManager';

export async function initGameManager(container: Container): Promise<void> {

  container.bind<GameManager>(Type.GameManager).toConstantValue(await new GameManager().init());
}
