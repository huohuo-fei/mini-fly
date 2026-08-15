import { MiniUtils } from '../../../../../utils/MiniUtils';

import planeExplodSvg from '@/assets/game/plane/explod.svg';
import planeLifeSvg from '@/assets/game/plane/life.svg';
import { BaseEffect } from './baseEffect';
import { LifeEffect } from './lifeEffect';
import { DamageEffect } from './damageEffect';
import { MiniBase } from '../../../../../miniBase/miniBase';
import { TextEffect } from './textEffect';
import { IMiniPlaneEffectType } from './type';
// 飞机大战中需要的各种特效管理
export class PlaneEffect extends MiniBase {
  // 特效资源加载完毕
  effectList: BaseEffect[] = [];
  effectStore: Map<
    { type: IMiniPlaneEffectType; x: number; y: number },
    BaseEffect
  > = new Map();

  // 依据类型和位置生成一个特效
  createEffect(
    type: IMiniPlaneEffectType,
    x: number,
    y: number,
    other?: any,
    cb?: () => void
  ) {
    for (const [key] of this.effectStore) {
      if (key.type === type && key.x === x && key.y === y) {
        // 同一位置 统一类型 过滤
        return;
      }
    }
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
      case IMiniPlaneEffectType.DAMAGE:
        effect = new DamageEffect(
          MiniUtils.getImage(planeExplodSvg),
          x,
          y,
          this,
          type,
          other,
          cb
        );
        break;
        case IMiniPlaneEffectType.TEXT:
          effect = new TextEffect(
            MiniUtils.getImage(planeExplodSvg),
            x,
            y,
            this,
            type,
            other,
            cb
          );
          break;
    }

    if (effect) {
      this.effectList.push(effect);
      this.effectStore.set({ type, x, y }, effect);
    } else {
      console.warn('effect is null');
    }
  }

  removeEffect(effect: BaseEffect) {
    const index = this.effectList.indexOf(effect);
    if (index > -1) {
      for (const [key, value] of this.effectStore) {
        if (value === effect) {
          this.effectStore.delete(key);
          break;
        }
      }
      this.effectList.splice(index, 1);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.effectList.length; i++) {
      this.effectList[i].render(ctx);
    }
  }

}
