import { GameStatus } from './GameStatus';
import { Goal } from './Goal';
import { Team } from './Team';

class Game {
  public readonly id: number;
  private _status: GameStatus;
  private readonly goals: Map<Team, Goal[]>;

  constructor(id: number) {
    this.id = id;
    this.goals = new Map<Team, Goal[]>();
    this._status = GameStatus.READY;
  }

  public scoreGoal(team: Team): number {
    const goal = new Goal(team);
    const teamGoals = this.goals.get(team) || [];
    teamGoals.push(goal);
    this.goals.set(team, teamGoals);
    return teamGoals.length;
  }

  set status(status: GameStatus) {
    this._status = status;
  }

  get status(): GameStatus {
    return this._status;
  }
}

export { Game };
