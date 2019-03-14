import { GameRules } from './GameRules';
import { GameStatus } from './GameStatus';
import { Goal } from './Goal';
import { Team } from './Team';

class Game {
  private id: number;
  private gameRules: GameRules;
  private goals: Goal[];
  private status: GameStatus;

  constructor(id: number, gameRules?: GameRules) {
    this.id = id;
    this.gameRules = gameRules || { goalsToWin: 10 };
    this.goals = [];
    this.status = GameStatus.READY;
  }

  public scoreGoal(team: Team) {
    const goal = new Goal(team);
    this.goals.push(goal);
  }

  public checkStatus(): GameStatus {
    const redTeamScore = this.goals.filter(goal => goal.team === Team.RED).length;
    const blackTeamScore = this.goals.filter(goal => goal.team === Team.BLACK).length;
    if (redTeamScore >= this.gameRules.goalsToWin, blackTeamScore >= this.gameRules.goalsToWin) {
      this.status = GameStatus.FINISHED;
    }
    return this.status;
  }

  set setStatus(status: GameStatus) {
    this.status = status;
  }

  get getStatus() {
    return this.status;
  }
}

export { Game };
