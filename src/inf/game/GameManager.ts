import { di } from '@framework';
import { Type } from '@diType';
import { Logger } from 'pino';

import { Point } from '../point/point';

import { ISensorService } from '../../inf/sensor/ISensorService';
import { StatsServiceWrapper } from '../../inf/wrappers/StatsServiceWrapper';

import { GoalAction } from './GoalAction';
import { RedGates, BlackGates } from './Gates';

import { Game, GameStatus, GameRules, Team, Goal } from '../../domain/game';
import { GameIsAlreadyExistError, GameIsNotExistError, GameIsNotOverError } from '../../domain/error';

class GameManager {
  private game: Game | undefined;

  @di.inject(Type.AppLogger) private logger!: Logger;
  @di.inject(Type.SensorService) private sensorService!: ISensorService;

  private statsService: StatsServiceWrapper;

  private redGates: RedGates;
  private blackGates: BlackGates;

  private gameRules: GameRules;

  constructor() {
    this.statsService = new StatsServiceWrapper();
    [this.redGates, this.blackGates] = this.spawnGates();
    this.gameRules = { goalsToWin: 10 };
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
    this.game = new Game(gameId);

    this.redGates.watch(this.makeGoalHandler(Team.BLACK));
    this.blackGates.watch(this.makeGoalHandler(Team.RED));

    this.game.status = GameStatus.INPROCESS;
    this.logger.info(`Game: ${gameId} started!`);
  }

  public stopGame(gameId: number): void | never {
    if (this.game) {
      if (this.game.id === gameId) {
        delete this.game;
      } 
      throw new GameIsNotExistError(`There are no games with ${gameId} id!`);
    } else {
      throw new GameIsNotExistError('There are no started games!');
    }
  }

  public pauseGame(gameId: number) {
    if (this.game) {
      if (this.game.id === gameId) {
        this.game.status === GameStatus.PAUSED;
        const stats = this.game.showStats();
        delete this.game;
        return stats;
      } 
      throw new GameIsNotExistError(`There are no games with ${gameId} id!`);
    } else {
      throw new GameIsNotExistError('There are no started games!');
    }
  }

  public resumeGame(gameId: number, gameRules: GameRules, goals: Goal[], playTime: number): void | never {
    if (this.game) {
      throw new GameIsNotOverError(`Current game: ${this.game.id} is not over!`);
    }
    if (gameRules) {
      this.gameRules = gameRules;
    }
    const redTeamGoals = goals.filter(goal => goal.team === Team.RED);
    const blackTeamGoals = goals.filter(goal => goal.team === Team.BLACK);
    const goalsMap = new Map<Team, Goal[]>();
    goalsMap.set(Team.RED, redTeamGoals);
    goalsMap.set(Team.BLACK, blackTeamGoals);
    this.game = new Game(gameId, goalsMap, playTime);
  }

  private spawnGates(): [RedGates, BlackGates] {
    const redGates = this.sensorService.createSensor(Point.RED_GATES);
    const blackGates = this.sensorService.createSensor(Point.BLACK_GATES);
    return [redGates, blackGates];
  }

  private makeGoalHandler(team: Team): GoalAction {
    return (err, _value) => {
      if (err) {
        throw err;
      }
      if (this.game && this.game.status === GameStatus.INPROCESS) {
        const score = this.game.scoreGoal(team);

        this.logger.info(`GAME[${this.game.id}] SCORE: [${team}] - ${score}`);

        if (score >= this.gameRules.goalsToWin) {
          this.game.status = GameStatus.FINISHED;
          this.statsService.sendStats(this.game.showStats());
          this.gameOver();
        } else {
          this.statsService.sendStats(this.game.showStats());
        }
      } else {
        this.logger.warn(`Not counted goal by ${team} team!`);
      }
    };
  }

  private gameOver() {
    if (this.game) {
      this.redGates.unwatch();
      this.blackGates.unwatch();
      this.logger.info(`Game: ${this.game.id} is over!`);
      delete this.game;
    }
  }
}

export { GameManager };
