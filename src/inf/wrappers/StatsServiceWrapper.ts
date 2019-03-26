import { GameStats } from '../../domain/game/GameStats';
import { ServiceWrapper } from '../../components/restClient/ServiceWrapper';

export class StatsServiceWrapper extends ServiceWrapper {
  public async sendStats(gameStats: GameStats): Promise<void> {
    await this.put('/game', { ...gameStats });
  }

  protected get serviceName(): string {
    return 'api';
  }

  protected get serviceToken(): string {
    return 'token';
  }
}
