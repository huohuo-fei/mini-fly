import type { EnemyJoker } from ".";
import { PlaneBody } from "../../../base/planeBody";
import type { PlaneBodyParams } from "../../../base/type";

export class JokerBody extends PlaneBody{
  joker: EnemyJoker;
  constructor(params: PlaneBodyParams, joker:EnemyJoker ) {
    super(params);
    this.joker = joker;

  }

  render(ctx: CanvasRenderingContext2D){
    const { bodyWidth,bodyHeight } = this;
    const color = this.joker.config.color
    ctx.save();
    ctx.strokeStyle = color;
    ctx.strokeRect(-bodyWidth / 2, -bodyHeight / 2, bodyWidth, bodyHeight);
    ctx.restore();
  }
}