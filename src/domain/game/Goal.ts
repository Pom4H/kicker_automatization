import { Team } from './Team';

class Goal {
  public team: Team;
  public time: Date;

  constructor(team: Team) {
    this.team = team;
    this.time = new Date();
  }
}

export { Goal };
