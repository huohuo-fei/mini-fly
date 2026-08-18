import { PlaneCreater } from '../base/planeCreater';
import type { PlaneUnitParams } from '../base/type';
import type { ISquadronConfig } from '../units/enemy/type';

export abstract class SquadronCreater extends PlaneCreater {
  params: PlaneUnitParams = {
    unitWidth: 80,
    unitHeight: 60,
    unitX: 0,
    unitY: 0,
    speedX: 0,  // 需要传入
    speedY: 0, 
    shootCooldown: 10,
    canvasHeight: 0, //this.gameParams.canvasHeight,
    canvasWidth: 0, // this.gameParams.canvasWidth,
    health: 10,
    score: 100,
  };

  config: ISquadronConfig = {
    count: 5,
    angle: Math.PI / 6,
    w: 60,
    h: 60,
    startX: 20,
    startY: 200,
    gap: 20,
    health: 14,
  };

  tip: string = '敌机编队来袭'

}
