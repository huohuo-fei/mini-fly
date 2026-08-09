import { EasedMove } from '../../../../../utils/Animate';
import { IMiniPlaneEffectType } from '../../type';
import { BaseEffect } from './baseEffect';
import type { PlaneEffect } from './planeEffects';
// 飞机大战中需要的各种特效管理
export class LifeEffect extends BaseEffect {
  endX: number;
  endY: number;
  move: EasedMove;
  constructor(
    sprite: HTMLImageElement | null,
    cx: number,
    cy: number,
    planeEffect: PlaneEffect,
    type: IMiniPlaneEffectType,
    other?: any,
    cb?:() =>void,

  ) {
    super(sprite, cx, cy, planeEffect, type,other,cb);
    this.spriteConfig.w = this.sprite?.width || 0;
    this.spriteConfig.h = this.sprite?.height || 0;
    this.spriteConfig.frames = 60;
    this.spriteConfig.tw = 20;
    this.spriteConfig.th = 20;

    this.endX = other.posx;
    this.endY = other.posy;

    this.move = new EasedMove(
      { x: this.spriteConfig.tx, y: this.spriteConfig.ty },
      { x: this.endX, y: this.endY },
      this.spriteConfig.frames,
      'easeInOutQuad'
    );
  }

  animate(ctx: CanvasRenderingContext2D) {
    // 绘制精灵图
    if (this.sprite) {
      const { w, h, tw, th, frames, cFrame } = this.spriteConfig;
      const { x, y } = this.move.getCurrentPosition();
      ctx.translate(x, y);
      const sx = 0;
      const sy = 0;
      const sw = w;
      const sh = h;
      const dw = tw;
      const dh = th;
      const dx = 0;
      const dy = 0;
      ctx.drawImage(this.sprite, sx, sy, sw, sh, dx, dy, dw, dh);
      if (cFrame < frames - 1) {
        this.spriteConfig.cFrame++;
        this.move.update();
      } else {
        this.spriteConfig.cFrame = 0;
        this.planeEffect.removeEffect(this);
        this.cb && this.cb();
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    this.animate(ctx);
    ctx.restore();
  }
}
