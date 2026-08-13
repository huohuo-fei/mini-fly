import { MiniBase } from '../../../../miniBase/miniBase';
import { Matrix3, Vector2 } from '../../../../utils/Matrix3';
import type { PlaneBullets } from '../bullet';
import {
  PlaneBulletType,
  type PlaneBulletParams,
  PlaneBulletShape,
  BulletCamp,
} from './type';

export class PlaneBullet extends MiniBase {
  type: PlaneBulletType = PlaneBulletType.Normal;
  params: PlaneBulletParams;
  bulletBox: PlaneBullets;
  matrix: Matrix3 = new Matrix3();
  dirVec: Vector2 = new Vector2();
  theat: number = 0;
  camp:BulletCamp = BulletCamp.Player
  // 移除的tag 当子弹击中敌人时，会标记为true 表示当前子弹已近被消耗
  removeTag: boolean = false;
  constructor(
    type: PlaneBulletType,
    camp:BulletCamp,
    bulletBox: PlaneBullets,
    params: PlaneBulletParams,
  ) {
    super();
    this.params = JSON.parse(JSON.stringify(params));
    this.bulletBox = bulletBox;
    this.type = type;
    this.camp = camp
    this.matrix.makeTranslation(this.params.bulletX, this.params.bulletY);
    this.dirVec.set(...this.params.direction).normalize();
    this.theat = Math.atan2(this.dirVec.y, this.dirVec.x);
  }

  updatePos(deltaTime:number) {
    const { speedX, speedY } = this.params;
    const deltaX = Math.cos(this.theat) * speedX;
    const deltaY = Math.sin(this.theat) * speedY;
    this.params.bulletX += deltaX * deltaTime;
    this.params.bulletY += deltaY * deltaTime;
    this.matrix.makeTranslation(this.params.bulletX, this.params.bulletY);
  }

  update(deltaTime: number): void {
    this.updatePos(deltaTime);
    
  }
  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.matrix.elements[6], this.matrix.elements[7]);
    ctx.beginPath();

    if (this.params.shape === PlaneBulletShape.Circle) {
      this.drawCircle(ctx);
    } else if (this.params.shape === PlaneBulletShape.Rect) {
      this.drawRect(ctx);
    }

    ctx.restore();
  }
  

  drawCircle(ctx: CanvasRenderingContext2D) {
    const { bulletWidth } = this.params;
    ctx.fillStyle = '#ff8866';
    ctx.arc(0, 0, bulletWidth / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  drawRect(ctx: CanvasRenderingContext2D) {
    const { bulletWidth, bulletHeight } = this.params;
    ctx.shadowColor = 'red';
    ctx.fillStyle = '#ffcc44';
    ctx.shadowBlur = 8;
    ctx.fillRect(
      -bulletWidth / 2,
      -bulletHeight / 2,
      bulletWidth,
      bulletHeight
    );
  }
}
