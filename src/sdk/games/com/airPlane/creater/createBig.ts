import { PlaneCreater } from '../base/planeCreater';
import type { PlaneUnitParams } from '../base/type';
import type { IBigEnemyConfig } from '../type';

export class BigCreater extends PlaneCreater {
  params: PlaneUnitParams = {
    unitWidth: 0,
    unitHeight: 0,
    unitX: 0,
    unitY: 0,
    speedX: 1,
    speedY: 1,
    shootCooldown: 600,
    canvasHeight: 0, // this.gameParams.canvasHeight,
    canvasWidth: 0, // this.gameParams.canvasWidth,
    health: 10,
    score: 200,
  };

  config: IBigEnemyConfig = {
    x: 100,
    speed: 1,
    targetHeight: 100,
    shootCooldown: 600,
    radius: 20,
    angleSpeed: 0.01,
  };

}
