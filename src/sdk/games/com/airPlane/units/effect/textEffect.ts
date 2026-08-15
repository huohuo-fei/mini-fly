import { EasedMove } from '../../../../../utils/Animate';
import { BaseEffect } from './baseEffect';
import type { PlaneEffect } from './planeEffects';
import type { IMiniPlaneEffectType, textColorConfig } from './type';
import { textColorMap } from './config';

// 飞机大战中需要的各种特效管理
export class TextEffect extends BaseEffect {
  move: EasedMove | null = null;

  text: string = 'BOSS 来袭';
  durationLeft: number = 100;
  durationPause: number = 100;
  durationRight: number = 100;

  colorConfig: textColorConfig ;
  constructor(
    sprite: HTMLImageElement | null,
    cx: number,
    cy: number,
    planeEffect: PlaneEffect,
    type: IMiniPlaneEffectType,
    other?: any,
    cb?: () => void
  ) {
    super(sprite, cx, cy, planeEffect, type, other, cb);
    this.text = other?.text || '占位文字';
    const colorType = (other?.type) as keyof typeof textColorMap || 'suc';

    this.colorConfig = textColorMap[colorType]

    this.spriteConfig.w = this.sprite?.width || 0;
    this.spriteConfig.h = this.sprite?.height || 0;
    this.spriteConfig.frames = 200;
    this.spriteConfig.tw = 20;
    this.spriteConfig.th = 20;
  }

  animate(ctx: CanvasRenderingContext2D) {
    if (this.move == null) {
      const { width } = ctx.measureText(this.text);
      this.move = new EasedMove(
        { x: -width, y: 200 },
        { x: 500, y: 200 },
        this.spriteConfig.frames,
        'easeWithPause'
      );
    }
    const { frames, cFrame } = this.spriteConfig;
    const { x, y } = this.move.getCurrentPosition();
    ctx.translate(x, y);

    // 深色阴影
    ctx.shadowColor = this.colorConfig.shadowColor;
    ctx.shadowBlur = this.colorConfig.shadowBlur;
    ctx.shadowOffsetX = this.colorConfig.shadowOffsetX;
    ctx.shadowOffsetY = this.colorConfig.shadowOffsetY;

    // 渐变文字
    const grad = ctx.createLinearGradient(0 - 160, 0 - 50,  160,50);
    grad.addColorStop(0, this.colorConfig.colorStart);
    grad.addColorStop(0.4, this.colorConfig.colorMid);
    grad.addColorStop(0.7, this.colorConfig.colorStart);
    grad.addColorStop(1, this.colorConfig.colorEnd);
    ctx.fillStyle = grad;
    ctx.fillText(this.text, 0, 0);

    // 顶部极淡高光 (让文字更有层次)
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = 'rgba(255, 200, 150, 0.06)'
    ctx.fillText(this.text, 0 - 1, 0 - 2);

    if (cFrame < frames - 1) {
      this.spriteConfig.cFrame++;
      this.move.update();
    } else {
      this.spriteConfig.cFrame = 0;
      this.planeEffect.removeEffect(this);
      this.cb && this.cb();
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.font = '900 40px Arial';
    this.animate(ctx);
    ctx.restore();
  }
}
