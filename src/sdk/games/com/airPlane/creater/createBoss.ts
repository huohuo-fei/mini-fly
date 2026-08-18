import { PlaneCreater } from '../base/planeCreater';
import type { PlaneUnitParams } from '../base/type';
import type { IBossConfig } from '../units/enemy/type';

export abstract class BossCreater extends PlaneCreater {
  params: PlaneUnitParams = {
    unitWidth: 180,
    unitHeight: 140,
    unitX: 0,
    unitY: 0,
    speedX: 0,
    speedY: 0,
    shootCooldown: 10,
    canvasHeight:0, 
    canvasWidth: 0,
    health: 1000,
    score: 20, // 总分数 health * score / 2
  }

  config: IBossConfig = {
    frame: 140,
    w: 180,
    h: 160,
    targetHeight: 200,
  }

  tip: string = 'BOSS来袭'

}
