import type { PlaneEnemySquadron } from '.';
import type { IMiniActParams, IMiniGam } from '../../../../../../type';
import { EasedMoveInfinite } from '../../../../../../utils/Animate';
import { Matrix3 } from '../../../../../../utils/Matrix3';

export class SquadronsBullet implements IMiniGam {
  matrix: Matrix3 = new Matrix3();
  w: number = 4;
  h: number = 4;
  radius: number = 4;
  color: string = 'yellow';
  move: EasedMoveInfinite;
  squadron: PlaneEnemySquadron;

  constructor(x: number, y: number, ex: number, ey: number,squadron:PlaneEnemySquadron) {
    this.squadron = squadron
    this.matrix.makeTranslation(x, y);
    this.move = new EasedMoveInfinite({ x, y }, { x: ex, y: ey }, 200);
  }

  render(ctx: CanvasRenderingContext2D) {
    // 注意：这里的坐标是世界坐标
    const { radius } = this;
    const { x, y } = this.move.getCurrentPosition();
    this.matrix.makeTranslation(x, y);

    ctx.save();
    ctx.translate(this.matrix.elements[6], this.matrix.elements[7]);
    ctx.strokeStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
    this.move.update();
    this.destroy()
  }

  // todo:后续将要优化  统一做销毁的逻辑抽取
  destroy() {
    // if (this.matrix.elements[7] > 800) {
    //   this.squadron.removeBullet(this);
    // }
  }

  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = () => {};
}
