import { GameStatus } from './GameStatus';
import { Goal } from './Goal';
import { Team } from './Team';
import { GameStats } from './GameStats';
import { RedGates, BlackGates } from '../../inf/game/Gates';

class Game {
  public readonly id: number;
  private readonly goals: Map<Team, Goal[]>;
  private _status: GameStatus;
  private gates: [RedGates, BlackGates];

  constructor(id: number, gates: [RedGates, BlackGates], goals?: Map<Team, Goal[]>) {
    this.id = id;
    this.gates = gates;
    this.goals = goals || new Map<Team, Goal[]>();
    this._status = GameStatus.INPROCESS;
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

  public unwatch(): void {
    this.gates.forEach(gate => gate.unwatch());
  }
}

export { Game };
