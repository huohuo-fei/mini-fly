import type { BigEnemyUnit } from '.';
import { MiniUtils } from '../../../../../..';
import type { IMiniGam } from '../../../../../../type';
import { EasedMoveInfinite } from '../../../../../../utils/Animate';
import { Matrix3, Vector2 } from '../../../../../../utils/Matrix3';
import planeMissileSvg from '@/assets/game/plane/missile.svg';

export class BigEnemyMissile implements IMiniGam {
  matrix: Matrix3 = new Matrix3();
  w: number = 24;
  h: number = 48;
  radius: number = 4;
  color: string = 'yellow';
  move: EasedMoveInfinite | null = null;

  speedX: number = 0;
  speedY: number = 0;

  bigEnemy: BigEnemyUnit;

  // 椭圆轨迹参数
  cx: number = 0;
  cy: number = 0;
  r1: number = 0;
  r2: number = 0;
  rotate: number = 0;
  planeX: number = 0;
  planeY: number = 0;

  // 导弹参数
  // 弧度/秒 (基准速度，速度系数1时约 1.8 rad/s -> 完整一圈约3.5秒)
  angleStep: number = 0.01;
  // 速度系数
  angle: number = 0;

  missileImg: HTMLImageElement | null = null;

  constructor(p1: Vector2, planePos: Vector2, bigEnemy: BigEnemyUnit) {
    const cx = (p1.x + planePos.x) / 2;
    const cy = (p1.y + planePos.y) / 2;
    this.planeX = planePos.x;
    this.planeY = planePos.y;
    const newV = p1.sub(planePos);
    const len = newV.length();
    this.cx = cx;
    this.cy = cy;
    this.r1 = len / 2;
    this.r2 = len / 4;
    this.rotate = Math.atan2(newV.y, newV.x);
    // this.matrix = new Matrix3().makeRotation(this.rotate);

    this.bigEnemy = bigEnemy;
    this.missileImg = MiniUtils.getImage(planeMissileSvg);
  }

  render(ctx: CanvasRenderingContext2D) {
    // 注意：这里的坐标是世界坐标
    const { cx, cy, rotate, angleStep } = this;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotate);
    ctx.bezierCurveTo;
    // ctx.beginPath();
    // ctx.ellipse(0, 0, r1, r2, 0, 0, Math.PI * 2);
    // ctx.strokeStyle = 'red';
    // ctx.lineWidth = 1;
    // ctx.shadowBlur = 0;
    // ctx.stroke();
    this.drawMissile(ctx);
    ctx.restore();

    this.angle += angleStep;
    this.angle = this.angle % (Math.PI * 2);
    this.destroy();
  }

  drawMissile(ctx: CanvasRenderingContext2D) {
    ctx.save();

    // 绘制导弹
    const bx = this.r1 * Math.cos(this.angle);
    const by = this.r2 * Math.sin(this.angle);

    const halfH = this.h / 2;
    const halfW = this.w / 2;

    // 这里需要调整导弹的方向
    ctx.translate(bx, by);
    ctx.rotate(this.angle);
    ctx.beginPath();
    // ctx.strokeStyle = 'yellow';
    // ctx.strokeRect(-halfW, -halfH, this.w, this.h);
    // ctx.stroke();

    if (this.missileImg) {
      ctx.scale(1, -1);
      ctx.drawImage(this.missileImg, -halfW, -halfH, this.w, this.h);
    }
    ctx.restore();
  }

  // todo:后续将要优化  统一做销毁的逻辑抽取
  destroy() {
    if (this.angle >= Math.PI) {
      this.bigEnemy.removeMissile(this);
    }
  }

  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = () => {};
}
