import { GameStats } from '../../domain/game/GameStats';
import { ServiceWrapper } from '../../components/restClient/ServiceWrapper';

export class StatsServiceWrapper extends ServiceWrapper {
  public async sendStats(gameStats: GameStats): Promise<void> {
    console.log(gameStats);
    console.log(JSON.stringify(gameStats, null, 3));
    await this.put('/game', { ...gameStats });
  }

  protected get serviceName(): string {
    return 'statsApi';
  }

}
