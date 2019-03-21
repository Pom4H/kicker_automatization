import { GameStats } from '../../domain/game/GameStats';
import { ServiceWrapper } from '../../components/restClient/ServiceWrapper';

export class StatsServiceWrapper extends ServiceWrapper {
  protected serviceName: string;
  public async sendStats(gameStats: GameStats): Promise<void> {
    await this.put('/game', { ...gameStats });
  }

  protected get serviceName(): string {
    return 'statsApi';
  }

}
