import { PlaneCreater } from '../base/planeCreater';
import type { PlaneUnitParams } from '../base/type';
import type { IBigEnemyConfig, IBossConfig } from '../type';

export class BossCreater extends PlaneCreater {
  params: PlaneUnitParams = {
    unitWidth: 80,
    unitHeight: 60,
    unitX: 250,
    unitY: 0,
    speedX: 0,
    speedY: 0,
    shootCooldown: 10,
    canvasHeight:0, // this.gameParams.canvasHeight,
    canvasWidth: 0,// this.gameParams.canvasWidth,
    health: 1000,
    score: 20,
  }

  config: IBossConfig = {
    frame: 140,
    w: 80,
    h: 60,
    targetHeight: 100,
  }
}
