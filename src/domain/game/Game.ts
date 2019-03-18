import { GameStatus } from './GameStatus';
import { Goal } from './Goal';
import { Team } from './Team';
import { GameStats } from './GameStats';

class Game {
  public readonly id: number;
  private readonly goals: Map<Team, Goal[]>;
  private _status: GameStatus;

  constructor(id: number, goals?: Map<Team, Goal[]>) {
    this.id = id;
    this.goals = goals || new Map<Team, Goal[]>();
    this._status = GameStatus.READY;
  }

  public scoreGoal(team: Team): number {
    const goal = new Goal(team);
    const teamGoals = this.goals.get(team) || [];
    teamGoals.push(goal);
    this.goals.set(team, teamGoals);
    return teamGoals.length;
  }

  public showStats(): GameStats {
    const redTeamGoals = this.goals.get(Team.RED) || [];
    const blackTeamGoals = this.goals.get(Team.BLACK) || [];
    const goals = [...redTeamGoals, ...blackTeamGoals];
    return new GameStats(this.id, goals, this._status);
  }

  set status(status: GameStatus) {
    this._status = status;
  }

  get status(): GameStatus {
    return this._status;
  }
}

export { Game };
