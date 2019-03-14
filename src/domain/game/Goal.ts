import { Team } from './Team';

export class Goal {
  public team: Team;
  public time: Date;

  constructor(team: Team) {
    this.team = team;
    this.time = new Date();
  }
}
