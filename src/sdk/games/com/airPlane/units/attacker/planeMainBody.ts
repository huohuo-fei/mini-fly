import { PlaneBody } from "../../base/planeBody";

export class PlaneMainBody extends PlaneBody{
  render(ctx: CanvasRenderingContext2D) {
    const { bodyWidth,bodyHeight } = this;
    ctx.save();
    // 先绘制飞机的外形框
    ctx.strokeStyle = 'red';
    ctx.strokeRect(-bodyWidth / 2, -bodyHeight / 2, bodyWidth, bodyHeight);
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#0af';
    ctx.fillStyle = '#7df9ff';
    ctx.beginPath();

    // 绘制一个梭形
    const offsetX = 3;
    const offsetY = 6;
    ctx.moveTo(-bodyWidth / 2 + offsetX, offsetY);
    ctx.lineTo(0, -bodyHeight / 2);
    ctx.lineTo(bodyWidth / 2 - offsetX, offsetY);
    ctx.lineTo(0, bodyHeight / 2);
    ctx.fill();
    ctx.fillStyle = '#ffd966';
    ctx.beginPath();
    ctx.rect(-5, -5, 10, 10);
    ctx.fill();
    ctx.restore();
  }
}