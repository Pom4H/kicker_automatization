import { Goal } from './Goal';
import { GameStatus } from './GameStatus';

class GameStats {
  public id: number;
  public goals: Goal[];
  public status: GameStatus;
  public playTime: number;

  constructor(id: number, goals: Goal[], status: GameStatus, playTime: number) {
    this.id = id;
    this.goals = goals;
    this.status = status;
    this.playTime = playTime;
  }
}

export { GameStats };
