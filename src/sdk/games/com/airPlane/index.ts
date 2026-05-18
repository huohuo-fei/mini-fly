// 飞机大战
import type { IMiniActParams, IMiniGam, IMiniGameParams } from '../../../type';
import { PlaneAttacker } from './units/attacker/planeAttacker';

import { PlaneBg } from './units/background/planeBg';
import { PlaneEnemy } from './units/enemy/planeEnemy';
import { PlaneEffect } from './units/effect/planeEffects';
import type { IMiniPlaneEffectType } from './type';


export class MiniFly implements IMiniGam {
  planeBackground: PlaneBg;
  planeAttacker: PlaneAttacker;
  planeEnemy: PlaneEnemy;

  planeEffect: PlaneEffect;
  constructor(gameParams: IMiniGameParams) {
    this.planeBackground = new PlaneBg();
    this.planeAttacker = new PlaneAttacker(gameParams);
    this.planeEnemy = new PlaneEnemy(gameParams,this)
    this.planeEffect = new PlaneEffect()
  }

  // render 方法
  render(ctx: CanvasRenderingContext2D) {
    this.planeBackground.render(ctx);
    this.planeAttacker.render(ctx);
    this.planeEnemy.render(ctx);
    this.planeEffect.render(ctx)
    this.bulletHitEnemy()
  }

  // 子弹击中敌人
  bulletHitEnemy() {
    for(let i = 0; i < this.planeAttacker.bullets.length; i++) {
      const bullet = this.planeAttacker.bullets[i];
      if (this.planeEnemy.isHitEnemy(bullet)) {
        this.planeAttacker.bullets.splice(i, 1);
        // 每次判断，减少一个敌机 不做冗余循环
        break
      }
    }

  }

  // 生成一个爆炸图
  createEffect(type:IMiniPlaneEffectType,x:number,y:number) {
    this.planeEffect.createEffect(type,x,y)
  }

  // 更新局内分数
  updateScore(score:number) {
    this.planeAttacker.updateScore(score)
  }

  actionStart(action: IMiniActParams) {
    console.log('action', action);
  }

  actionEnd(p: IMiniActParams) {
    console.log('p', p);
  }
  actionDoing(p: IMiniActParams) {
    this.planeAttacker.actionDoing(p)
  }


}
