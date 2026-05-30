import type { IMiniActParams, IMiniGam } from '../../../../../type';
import { MiniUtils } from '../../../../../utils/MiniUtils';

import planeExplodSvg from '@/assets/game/plane/explod.svg';
import planeLifeSvg from '@/assets/game/plane/life.svg';
import planeAttackerSvg from '@/assets/game/plane/attacker_bg.svg';
import { BaseEffect } from './baseEffect';
import { IMiniPlaneEffectType } from '../../type';
import { LifeEffect } from './lifeEffect';
// 飞机大战中需要的各种特效管理
export class PlaneEffect implements IMiniGam {
  // 特效资源加载完毕
  loaded: boolean = false;
  effectList: BaseEffect[] = [];

  constructor() {
    // 加载所有的特效资源 使用 all
    MiniUtils.loadImageList([planeExplodSvg,planeLifeSvg,planeAttackerSvg]).then((img) => {
      this.loaded = true;
    });
  }

  // 依据类型和位置生成一个特效
  createEffect(type: IMiniPlaneEffectType, x: number, y: number, other?: any,cb?:() => void) {
    let effect = null;
    switch (type) {
      case IMiniPlaneEffectType.EXPLODE:
        effect = new BaseEffect(
          MiniUtils.getImage(planeExplodSvg),
          x,
          y,
          this,
          type,
          other,
          cb
        );
        break;
      case IMiniPlaneEffectType.LIFE:
        effect = new LifeEffect(
          MiniUtils.getImage(planeLifeSvg),
          x,
          y,
          this,
          type,
          other,
          cb
        );
        break;
      
    }

    if(effect){
      this.effectList.push(effect);
    }else{
      console.warn('effect is null');
      
    }
  }

  removeEffect(effect: BaseEffect) {
    const index = this.effectList.indexOf(effect);
    if (index > -1) {
      this.effectList.splice(index, 1);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.loaded) return;
    for (let i = 0; i < this.effectList.length; i++) {
      this.effectList[i].render(ctx);
    }
  }

  actionStart = (p: IMiniActParams) => {};
  actionEnd = (p: IMiniActParams) => {};
  actionDoing = (p: IMiniActParams) => {};
}
