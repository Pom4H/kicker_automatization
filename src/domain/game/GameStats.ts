import { Goal } from './Goal';
import { GameStatus } from './GameStatus';

class GameStats {
  public id: number;
  public goals: Goal[];
  public status: GameStatus;

  constructor(id: number, goals: Goal[], status: GameStatus) {
    this.id = id;
    this.goals = goals;
    this.status = status;
  }
}

export { GameStats };
