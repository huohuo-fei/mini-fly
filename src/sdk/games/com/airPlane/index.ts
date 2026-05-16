// 飞机大战
import type { IMiniActParams, IMiniGam, IMiniGameParams } from '../../../type';
import { PlaneAttacker } from './units/planeAttacker';

import { PlaneBg } from './units/planeBg';
import { PlaneEnemy } from './units/planeEnemy';
export class MiniFly implements IMiniGam {
  planeBackground: PlaneBg;
  planeAttacker: PlaneAttacker;
  planeEnemy: PlaneEnemy;
  constructor(gameParams: IMiniGameParams) {
    this.planeBackground = new PlaneBg();
    this.planeAttacker = new PlaneAttacker(gameParams);
    this.planeEnemy = new PlaneEnemy(gameParams)
  }

  // render 方法
  render(ctx: CanvasRenderingContext2D) {
    this.planeBackground.render(ctx);
    this.planeAttacker.render(ctx);
    this.planeEnemy.render(ctx);
  }

  actionStart(action: IMiniActParams) {
    console.log('action', action);
  }

  actionEnd(p: IMiniActParams) {
    console.log('p', p);
  }
  actionDoing(p: IMiniActParams) {
    const {x} = p
    this.planeAttacker.updatePosX(x)
  }


}
