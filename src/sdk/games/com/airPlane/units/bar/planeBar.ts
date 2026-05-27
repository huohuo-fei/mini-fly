import type { MiniFly } from '../..';
import type { IMiniGam } from '../../../../../type';
import { IMiniPlaneEffectType } from '../../type';
export class PlaneBar implements IMiniGam {
  fontSize = 18;
  scoreVal: number = 0;
  lifeVal: number = 3;
  maxLife: number = 5;
  miniFly: MiniFly;

  constructor(miniFly: MiniFly) {
    this.miniFly = miniFly;
  }
  drawScoreIcon(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.font = `${this.fontSize}px Arial`;
    ctx.fillText(`❤️ ${this.lifeVal}`, 10, 10 + this.fontSize);
    ctx.fillText(`🏆 ${this.scoreVal}`, 10, 10 + this.fontSize * 2.2);
    ctx.restore();
  }

  addScore(val: number) {
    this.scoreVal += val;
  }

  addLife() {
    if (this.lifeVal < this.maxLife || true) {
      const x = this.miniFly.planeAttacker.attackerX;
      const y = this.miniFly.planeAttacker.attackerY;
      this.miniFly.createEffect(IMiniPlaneEffectType.LIFE, x, y, {
        posx: 10,
        posy: 10,
      },() => {
        this.lifeVal += 1;
      });
    }
  }
  subLife(val: number) {
    this.lifeVal -= val;
  }

  render(ctx: CanvasRenderingContext2D) {
    const canvas = ctx.canvas;
    this.drawScoreIcon(ctx);
    // 渲染一个状态栏
  }
  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = () => {};
}
