import { di } from '@framework';
import { Type } from '@diType';
import { Logger } from 'pino';

import { Point } from '../point/point';

import { ISensorService } from '../../inf/sensor/ISensorService';
// import { StatsServiceWrapper } from '../../inf/wrappers/StatsServiceWrapper';

import { RedGates, BlackGates } from './Gates';
import { GoalAction } from './GoalAction';

import { Game, GameStatus, GameRules, Team } from '../../domain/game';

class GameManager {
  private currentGame: Game | undefined;

  @di.inject(Type.AppLogger) private logger!: Logger;
  @di.inject(Type.SensorService) private sensorService!: ISensorService;

  // private statsService: StatsServiceWrapper;

  private redGates: RedGates;
  private blackGates: BlackGates;

  private gameRules: GameRules;

  constructor() {
    // this.statsService = new StatsServiceWrapper();
    [this.redGates, this.blackGates] = this.spawnGates();
    this.gameRules = { goalsToWin: 10 };
  }

  public createNewGame(id: number): Game | never {
    if (!this.currentGame || this.currentGame.status === GameStatus.FINISHED) {
      this.currentGame = new Game(id);

      this.redGates.watch(this.getGoalHandlerForTeam(Team.BLACK));
      this.blackGates.watch(this.getGoalHandlerForTeam(Team.RED));

      this.currentGame.status = GameStatus.INPROCESS;
      this.logger.info(`Game: ${id} started!`);
    }
    return this.currentGame;
  }

  private spawnGates(): [RedGates, BlackGates] {
    const redGates = this.sensorService.createSensor(Point.RED_GATES);
    const blackGates = this.sensorService.createSensor(Point.BLACK_GATES);
    return [redGates, blackGates];
  }

  private getGoalHandlerForTeam(team: Team): GoalAction {
    return (err, _value) => {
      if (err) {
        throw err;
      }
      if (this.currentGame && this.currentGame.status === GameStatus.INPROCESS) {
        const score = this.currentGame.scoreGoal(team);
        if (score >= this.gameRules.goalsToWin) {
          this.gameOver();
        } else {
          // this.statsService.sendStats();
        }
      }
    };
  }

  private gameOver() {
    if (this.currentGame) {
      this.currentGame.status = GameStatus.FINISHED;
      this.redGates.unwatch();
      this.blackGates.unwatch();
      this.logger.info(`Game: ${this.currentGame.id} is over!`);
    }
  }

}

export { GameManager };
