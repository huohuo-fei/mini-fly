import { PlaneBody } from "../../../base/planeBody";


export class BossBody extends PlaneBody{
  render(ctx: CanvasRenderingContext2D) {
    const { bodyWidth,bodyHeight } = this;
    ctx.save();
    ctx.strokeStyle = 'white';
    ctx.strokeRect(-bodyWidth / 2, -bodyHeight / 2, bodyWidth, bodyHeight);
    ctx.restore();
  }
}