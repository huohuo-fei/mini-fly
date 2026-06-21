import { PlaneBody } from "../../../base/planeBody";

export class BigBody extends PlaneBody{

  render(ctx: CanvasRenderingContext2D): void {
    const {bodyWidth:radius} = this
    ctx.save()
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'red';
    ctx.stroke();

    // 绘制四个发射点
    ctx.beginPath();
    ctx.strokeStyle = 'aqua';
    ctx.arc(0, -radius, 5, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, radius, 5, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-radius, 0, 5, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(radius, 0, 5, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore()

  }

}