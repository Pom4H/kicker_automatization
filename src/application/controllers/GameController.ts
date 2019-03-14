import { JsonController, Post, OnUndefined } from 'routing-controllers';
import { di } from '@framework';
import { Type } from '@diType';

import { Logger } from 'pino';

@JsonController('/api')
export class UserActivityController {
  @di.inject(Type.AppLogger) private logger!: Logger;

  @Post('/start')
  @OnUndefined(204)
  public async startGame(): Promise<void> {
    this.logger.info('Start Game!');
  }

  @Post('/stop')
  @OnUndefined(204)
  public async stopGame(): Promise<void> {
    this.logger.info('Stop Game!');
  }
}
