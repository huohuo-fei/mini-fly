import type { IMiniActParams, IMiniGam } from '../../../../../type';
import { MiniUtils } from '../../../../../utils/MiniUtils';

import planeExplodSvg from '@/assets/game/plane/explod.svg';
import { BaseEffect } from './baseEffect';
import type { IMiniPlaneEffectType } from '../../type';
// 飞机大战中需要的各种特效管理
export class PlaneEffect implements IMiniGam {
  // 特效资源加载完毕
  loaded: boolean = false;
  effectList: BaseEffect[] = [];

  constructor() {
    // 加载所有的特效资源 使用 all
    MiniUtils.loadImage(planeExplodSvg).then((img) => {
      this.loaded = true;
    });
  }

  // 依据类型和位置生成一个特效
  createEffect(type: IMiniPlaneEffectType, x: number, y: number) {
    // console.log(type);
    const effect = new BaseEffect(MiniUtils.getImage(planeExplodSvg), x, y,this,type);
    this.effectList.push(effect);
  }

  removeEffect(effect: BaseEffect) {
    const index = this.effectList.indexOf(effect);
    if (index > -1) {
      this.effectList.splice(index, 1);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    if(!this.loaded)return
    for (let i = 0; i < this.effectList.length; i++) {
      this.effectList[i].render(ctx);
    }
  }

  actionStart = (p: IMiniActParams) => {};
  actionEnd = (p: IMiniActParams) => {};
  actionDoing = (p: IMiniActParams) => {};
}
