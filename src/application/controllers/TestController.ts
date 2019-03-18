import { JsonController, Post, Body, OnUndefined } from 'routing-controllers';
import { di } from '@framework';
import { Type } from '@diType';
import { Logger } from 'pino';

import { DummySensorService } from '../../inf/sensor/DummySensorService';
import { Point } from '../../inf/point/point';

@JsonController('/test/api')
export class UserActivityController {
  @di.inject(Type.AppLogger) private logger!: Logger;
  @di.inject(Type.SensorService) private sensorService!: DummySensorService;

  @OnUndefined(204)
  @Post('/goal')
  public startGame(@Body() gameData: { point: Point }): void {
    this.logger.warn(`Init test goal to point: ${gameData.point}`);
    this.sensorService.callPoint(gameData.point);
  }
}
