import type { IMiniGam } from '../../../../../type';
export class PlaneBar implements IMiniGam {
  fontSize = 18;
  scoreVal: number = 0;
  lifeVal: number = 3;
  drawScoreIcon(

    ctx: CanvasRenderingContext2D
  ) {
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

  addLife(val: number) {
    this.lifeVal += val;
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
