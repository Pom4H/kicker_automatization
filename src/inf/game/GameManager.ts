import { di } from '@framework';
import { Type } from '@diType';
import { Logger } from 'pino';

import { Point } from '../point/point';

import { ISensorService } from '../../inf/sensor/ISensorService';
import { StatsServiceWrapper } from '../../inf/wrappers/StatsServiceWrapper';

import { GoalAction } from './GoalAction';
import { RedGates, BlackGates } from './Gates';

import { Game, GameStatus, GameRules, Team, GameStats, Goal } from '../../domain/game';
import { GameIsAlreadyExistError, GameIsNotExistError, GameIsNotOverError } from '../../domain/error';

class GameManager {
  private game: Game | undefined;

  @di.inject(Type.AppLogger) private logger!: Logger;
  @di.inject(Type.SensorService) private sensorService!: ISensorService;

  private statsService: StatsServiceWrapper;

  private gameRules: GameRules;

  constructor() {
    this.statsService = new StatsServiceWrapper();
    this.gameRules = { goalsToWin: 10 };
  }

  public async init() {
    const gameState = await this.statsService.getGameState();
    if (gameState && gameState.status === GameStatus.INPROCESS) {
      this.restoreGameState(gameState);
      this.logger.info(`game with id ${gameState.id} restored`);
    }
    this.logger.info(`no games with status inprocess`);
    return this;
  }

  public createNewGame(gameId: number, gameRules: GameRules): void | never {
    if (this.game) {
      if (this.game.id === gameId) {
        throw new GameIsAlreadyExistError(`Game: ${this.game.id} is already exist!`);
      }
      throw new GameIsNotOverError(`Current game: ${this.game.id} is not over!`);
    }
    if (gameRules) {
      this.gameRules = gameRules;
    }
    
    const gates = this.spawnGates();
    
    gates[0].watch(this.makeGoalHandler(gameId, Team.BLACK));
    gates[1].watch(this.makeGoalHandler(gameId, Team.RED));

    this.game = new Game(gameId, gates);

    this.game.status = GameStatus.INPROCESS;
    this.logger.info(`Game: ${gameId} started!`);
  }

  public stopGame(gameId: number): void | never {
    if (this.game) {
      if (this.game.id === gameId) {
        this.game.status = GameStatus.CANCELED;
        this.game.unwatch();
        delete this.game;
        this.logger.warn(`Game: ${gameId} is canceled!`);
      } else {
        throw new GameIsNotExistError(`There are no games with ${gameId} id!`);
      }
    } else {
      throw new GameIsNotExistError('There are no started games!');
    }
  }

  private spawnGates(): [RedGates, BlackGates] {
    const redGates = this.sensorService.createSensor(Point.RED_GATES);
    const blackGates = this.sensorService.createSensor(Point.BLACK_GATES);
    return [redGates, blackGates];
  }

  private makeGoalHandler(gameId: number, team: Team): GoalAction {
    let firstDetectionTime = 0;
    let secondDetectionTime = 0;
    return (err, _value) => {
      if (err) {
        throw err;
      }
      if (firstDetectionTime) {
        secondDetectionTime = Date.now();
        if (secondDetectionTime - firstDetectionTime > 10) {
          firstDetectionTime = 0;
          if (this.game && this.game.id === gameId && this.game.status === GameStatus.INPROCESS) {
            const score = this.game.scoreGoal(team);
  
            this.logger.info(`GAME[${gameId}] SCORE: [${team}] - ${score}`);
  
            if (score >= this.gameRules.goalsToWin) {
              this.game.status = GameStatus.FINISHED;
              this.statsService.sendStats(this.game.showStats());
              this.gameOver();
            } else {
              this.statsService.sendStats(this.game.showStats());
            }
          } else {
            this.logger.warn(`GAME[${gameId}] Not counted goal by ${team} team!`);
          }
        }
      } else {
        firstDetectionTime = Date.now();
      }
    };
  }

  private gameOver() {
    if (this.game) {
      this.game.unwatch();
      this.logger.info(`Game: ${this.game.id} is over!`);
      delete this.game;
    }
  }

  private restoreGameState(gameState: GameStats): void {
    const { id, goals } = gameState;

    const redGoals = goals.filter(goal => goal.team === Team.RED);
    const blackGoals = goals.filter(goal => goal.team === Team.BLACK);

    const goalsMap: Map<Team, Goal[]> = new Map();
    goalsMap.set(Team.RED, redGoals);
    goalsMap.set(Team.BLACK, blackGoals);

    const gates = this.spawnGates();
    
    gates[0].watch(this.makeGoalHandler(id, Team.BLACK));
    gates[1].watch(this.makeGoalHandler(id, Team.RED));
    
    this.game = new Game(id, gates, goalsMap);
  }
}

export { GameManager };
