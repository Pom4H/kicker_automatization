import { JsonController, Post, Body, OnUndefined } from 'routing-controllers';
import { di } from '@framework';
import { Type } from '@diType';
import { Logger } from 'pino';

import { GameManager } from '../../inf/game/GameManager';

import { GameRules } from '../../domain/game';

@JsonController('/api')
export class UserActivityController {
  @di.inject(Type.AppLogger) private logger!: Logger;

  private gameManager: GameManager;

  constructor() {
    this.gameManager = new GameManager();
  }

  @OnUndefined(204)
  @Post('/start')
  public startGame(@Body() gameData: { gameId: number; gameRules: GameRules }): void {
    const { gameId, gameRules } = gameData;
    this.logger.info(`Start game: ${gameId}`);
    this.gameManager.createNewGame(gameId, gameRules);
  }

  @OnUndefined(204)
  @Post('/stop')
  public stopGame(@Body() gameData: { gameId: number }): void {
    const { gameId } = gameData;
    this.logger.info(`Stop game: ${gameId}`);
    this.gameManager.stopGame(gameId);
  }
}
