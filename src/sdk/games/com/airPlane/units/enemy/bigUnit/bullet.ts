import type { BigEnemyUnit } from '.';
import type { IMiniActParams, IMiniGam } from '../../../../../../type';
import { EasedMoveInfinite } from '../../../../../../utils/Animate';
import { Matrix3 } from '../../../../../../utils/Matrix3';

export class BigEnemyBullet implements IMiniGam {
  matrix: Matrix3 = new Matrix3();
  w: number = 4;
  h: number = 4;
  radius: number = 4;
  color: string = 'yellow';
  move: EasedMoveInfinite | null = null

  speedX: number;
  speedY: number;

  bigEnemy: BigEnemyUnit;

  constructor(x: number, y: number, speedX: number, speedY: number,bigEnemy:BigEnemyUnit) {
    this.matrix.makeTranslation(x, y);

    this.speedX = speedX;
    this.speedY = speedY;
 
    this.bigEnemy = bigEnemy;
  }

  render(ctx: CanvasRenderingContext2D) {
    // 注意：这里的坐标是世界坐标
    const { radius } = this;
    ctx.save();
    this.matrix.translate(this.speedX, this.speedY);
    ctx.translate(this.matrix.elements[6], this.matrix.elements[7]);
    ctx.strokeStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
    this.destroy()
  }

  // todo:后续将要优化  统一做销毁的逻辑抽取
  destroy() {
    // if (this.matrix.elements[7] > 800) {
    //   this.squadron.removeBullet(this);
    // }

    const x = this.matrix.elements[6]
    const y = this.matrix.elements[7]

    const {canvasHeight,canvasWidth} = this.bigEnemy.planeEnemy.gameParams

    if(x < -this.radius || x > canvasWidth + this.radius || y < -this.radius || y > canvasHeight + this.radius){
      this.bigEnemy.removeBullet(this)
    }
  }

  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = () => {};
}
