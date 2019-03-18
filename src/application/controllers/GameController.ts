import { JsonController, Post, Body, OnUndefined } from 'routing-controllers';
import { di } from '@framework';
import { Type } from '@diType';
import { Logger } from 'pino';

import { GameManager } from '../../inf/game/GameManager';

import { GameRules, Goal } from '../../domain/game';

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

  @OnUndefined(204)
  @Post('/pause')
  public pauseGame(@Body() gameData: { gameId: number }): void {
    const { gameId } = gameData;
    this.logger.info(`Pause game: ${gameId}`);
    this.gameManager.pauseGame(gameId);
  }

  @OnUndefined(204)
  @Post('/resume')
  public resumeGame(@Body()
  gameData: {
    gameId: number;
    gameRules: GameRules;
    goals: Goal[];
    playTime: number;
  }): void {
    const { gameId, gameRules, goals, playTime } = gameData;
    this.gameManager.resumeGame(gameId, gameRules, goals, playTime);
    this.logger.info(`Resume game: ${gameId}`);
  }
}
