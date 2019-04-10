import { GameStats } from '../../domain/game/GameStats';
import { ServiceWrapper } from '../../components/restClient/ServiceWrapper';

export class StatsServiceWrapper extends ServiceWrapper {
  public async getGameState(): Promise<GameStats> {
    return await this.get('/game');
  }

  public async sendStats(gameStats: GameStats): Promise<void> {
    await this.trySendStats(gameStats);
  }

  protected async trySendStats(gameStats: GameStats): Promise<void> {
    try {
      await this.put('/game', { ...gameStats });
    } catch (error) {
      if (error.code === 'EAI_AGAIN') {
        await this.trySendStats(gameStats);
      }
    }
  }

  protected get serviceName(): string {
    return 'api';
  }

  protected get serviceToken(): string {
    return 'token';
  }
}
