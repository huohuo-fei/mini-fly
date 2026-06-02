import type { IMiniGam } from '../../../../../../type';
import { Matrix3 } from '../../../../../../utils/Matrix3';
import type { PlaneEnemy } from '../planeEnemy';
import { EasedMove } from '../../../../../../utils/Animate';
import { BigEnemyBullet } from './bullet';
import type { IBigEnemyConfig } from '../../../type';

export class BigEnemyUnit implements IMiniGam {
  matrix: Matrix3 = new Matrix3();
  x: number = 100;
  speed: number = 1;
  targetHeight: number = 200;
  move: EasedMove | null = null;
  shootCooldown: number = 600;
  radius: number = 20;
  angle: number = 0;
  angleSpeed: number = 0.01;

  // 子弹定时器
  timer: number | null = null;

  planeEnemy: PlaneEnemy;

  // 子弹列表
  bulletList: BigEnemyBullet[] = [];

  constructor(planeEnemy: PlaneEnemy,config:IBigEnemyConfig) {
    this.planeEnemy = planeEnemy;
    Object.assign(this,config);
  }

  buildBullet() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      // 生成子弹逻辑
      const { speed, radius } = this;

      // 四个方向的子弹
      {
        const cx = Math.cos(this.angle);
        const cy = Math.sin(this.angle);
        const vx = cx * speed;
        const vy = cy * speed;
        const x = this.matrix.elements[6] + radius * cx;
        const y = this.matrix.elements[7] + radius * cy;
        const bullet = new BigEnemyBullet(x, y, vx, vy,this);
        this.bulletList.push(bullet);
      }

      {
        const cx = Math.cos(this.angle + Math.PI / 2);
        const cy = Math.sin(this.angle + Math.PI / 2);
        const x = this.matrix.elements[6] + radius * cx;
        const y = this.matrix.elements[7] + radius * cy;
        const vx = cx * speed;
        const vy = cy * speed;
        const bullet2 = new BigEnemyBullet(x, y, vx, vy,this);
        this.bulletList.push(bullet2);
      }

      {
        const cx = Math.cos(this.angle + Math.PI);
        const cy = Math.sin(this.angle + Math.PI);
        const x = this.matrix.elements[6] + radius * cx;
        const y = this.matrix.elements[7] + radius * cy;
        const vx = cx * speed;
        const vy = cy * speed;
        const bullet3 = new BigEnemyBullet(x, y, vx, vy,this);
        this.bulletList.push(bullet3);
      }

      {
        const cx = Math.cos(this.angle + (Math.PI * 3) / 2);
        const cy = Math.sin(this.angle + (Math.PI * 3) / 2);
        const x = this.matrix.elements[6] + radius * cx;
        const y = this.matrix.elements[7] + radius * cy;
        const vx = cx * speed;
        const vy = cy * speed;
        const bullet3 = new BigEnemyBullet(x, y, vx, vy,this);
        this.bulletList.push(bullet3);
      }
    }, this.shootCooldown);
  }

  removeBullet(bullet: BigEnemyBullet) {
    const index = this.bulletList.indexOf(bullet);
    if (index > -1) {
      this.bulletList.splice(index, 1);
    }
  }

  drawBox(ctx: CanvasRenderingContext2D) {
    const { radius } = this;
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
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.move) {
      const { x, targetHeight } = this;
      this.move = new EasedMove({ x: x, y: 0 }, { x: x, y: targetHeight }, 100);
    }
    const moveUpdate = this.move.update();

    for (let i = 0; i < this.bulletList.length; i++) {
      this.bulletList[i].render(ctx);
    }

    const { x, y } = this.move.getCurrentPosition();
    this.matrix.makeTranslation(x, y);

    if (!moveUpdate) {
      this.buildBullet();
      this.matrix.rotate(this.angle);
      this.angle += this.angleSpeed;
    }

    ctx.save();
    ctx.transform(...this.matrix.toCanvasTransform());
    this.drawBox(ctx);
    ctx.restore();
  }

  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = () => {};
}
