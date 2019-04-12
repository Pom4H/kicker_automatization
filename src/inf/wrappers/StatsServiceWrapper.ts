import { GameStats } from '../../domain/game/GameStats';
import { ServiceWrapper } from '../../components/restClient/ServiceWrapper';

let TRY_COUNT = 0;

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
      TRY_COUNT = 0;
    } catch (error) {
      console.error(error.code);
      if (TRY_COUNT < 20) {
        TRY_COUNT += 1;
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
