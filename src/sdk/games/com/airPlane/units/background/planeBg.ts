import type { IMiniGameParams } from '../../../../..';
import { MiniBase } from '../../../../../miniBase/miniBase';
export class PlaneBg extends MiniBase {
  gameParams: IMiniGameParams;
  constructor(params: IMiniGameParams) {
    super();
    this.gameParams = params; 
  }
  render(ctx: CanvasRenderingContext2D) {
    const {canvasHeight,canvasWidth} = this.gameParams
    ctx.save();
    let grad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    grad.addColorStop(0, '#03071e');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0,canvasWidth, canvasHeight);

    for (let i = 0; i < 200; i++) {
      if (i % 2 === 0) continue;
      ctx.fillStyle = `rgba(255,240,200,${
        0.3 + Math.sin(Date.now() * 0.002 + i) * 0.2
      })`;
      ctx.fillRect((i * 131) % canvasWidth, (i * 57) % canvasHeight, 2, 2);
    }

    ctx.restore();
    // this.drawRect(ctx);
  }

  /**
   * 绘制矩形边框的方法
   * @param ctx CanvasRenderingContext2D - Canvas 2D渲染上下文
   */
  drawRect(ctx: CanvasRenderingContext2D) {
    ctx.save(); // 保存当前Canvas上下文状态
    ctx.strokeStyle = 'red'; // 设置描边颜色为白色
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, this.gameParams.canvasWidth, this.gameParams.canvasHeight); // 绘制矩形边框，从左上角(0,0)开始，宽度和高度为Canvas画布的宽高
    ctx.restore(); // 恢复之前保存的Canvas上下文状态
  }
}
