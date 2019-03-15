import { JsonController, Post, OnUndefined, Body } from 'routing-controllers';
import { di } from '@framework';
import { Type } from '@diType';
import { Logger } from 'pino';

import { GameManager } from '../../inf/game/GameManager';

@JsonController('/api')
export class UserActivityController {
  @di.inject(Type.AppLogger) private logger!: Logger;

  private gameManager: GameManager;

  constructor() {
    this.gameManager = new GameManager();
  }

  @Post('/start')
  @OnUndefined(204)
  public async startGame(@Body() gameData: { id: number }): Promise<void> {
    this.gameManager.createNewGame(gameData.id);
    this.logger.info('Start Game!');
  }

  @Post('/stop')
  @OnUndefined(204)
  public async stopGame(): Promise<void> {
    this.logger.info('Stop Game!');
  }
}
