import { PlaneCreater } from '../base/planeCreater';
import type { PlaneUnitParams } from '../base/type';
import { MiniPlaneEnemyType } from '../type';

export abstract class JokerCreater extends PlaneCreater {
  params: PlaneUnitParams = {
    unitWidth: 80,
    unitHeight: 60,
    unitX: 0,
    unitY: 0,
    speedX: 0,
    speedY: 0,
    shootCooldown: 10,
    canvasHeight: 0, // this.gameParams.canvasHeight,
    canvasWidth: 0, // this.gameParams.canvasWidth,
    health: 1000,
    score: 10,
  };

  config = {
    type: MiniPlaneEnemyType.LEVEL1,
  };
}
