import type { IMiniActParams, IMiniGam } from '../../../../../type';
import { PlaneExplodeConfig } from '../../config';
import { IMiniPlaneEffectType, type SpriteConfig } from '../../type';
import type { PlaneEffect } from './planeEffects';
// 飞机大战中需要的各种特效管理
export class BaseEffect implements IMiniGam {
  type: IMiniPlaneEffectType;
  planeEffect: PlaneEffect;
  spriteConfig: SpriteConfig;
  sprite: HTMLImageElement | null = null;
  delay: number = 0;

  constructor(sprite: HTMLImageElement | null, cx: number, cy: number,planeEffect:PlaneEffect,type:IMiniPlaneEffectType) {
    this.type = type
    this.spriteConfig = JSON.parse(JSON.stringify(PlaneExplodeConfig));
    this.planeEffect = planeEffect;
    this.spriteConfig.tx = cx - this.spriteConfig.tw / 2;
    this.spriteConfig.ty = cy - this.spriteConfig.th / 2;
    this.sprite = sprite;
  }

  animate(ctx: CanvasRenderingContext2D) {
    // 绘制精灵图
    if (this.sprite) {
      const { x, y, w, h, tx, ty, tw, th, frames, cFrame, delayF } =
        this.spriteConfig;

      const sx = x + w * cFrame;
      const sy = y;
      const sw = w;
      const sh = h;
      const dx = tx;
      const dy = ty;
      const dw = tw;
      const dh = th;
      ctx.drawImage(this.sprite, sx, sy, sw, sh, dx, dy, dw, dh);
      this.delay++;
      if (this.delay > delayF) {
        this.delay = 0;
        if (cFrame < frames - 1) {
          this.spriteConfig.cFrame++;
        } else {
          this.spriteConfig.cFrame = 0;
          this.planeEffect.removeEffect(this);
        }
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    this.animate(ctx);
  }

  actionStart = (p: IMiniActParams) => {};
  actionEnd = (p: IMiniActParams) => {};
  actionDoing = (p: IMiniActParams) => {};
}
