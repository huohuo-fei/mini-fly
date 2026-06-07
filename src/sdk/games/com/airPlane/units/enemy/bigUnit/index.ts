import type { IMiniGam } from '../../../../../../type';
import { Matrix3, Vector2 } from '../../../../../../utils/Matrix3';
import type { PlaneEnemy } from '../planeEnemy';
import { EasedMove } from '../../../../../../utils/Animate';
import { BigEnemyBullet } from './bullet';
import { IMiniPlaneEffectType, type IBigEnemyConfig } from '../../../type';
import type { PlaneBullet } from '../../attacker/planeBullet';
import { BigEnemyMissile } from './missile';

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

  heath: number = 20;

  // 子弹定时器
  timer: number | null = null;

  planeEnemy: PlaneEnemy;

  // 子弹列表
  bulletList: BigEnemyBullet[] = [];

  // 导弹列表
  missileList: BigEnemyMissile[] = [];

  // 是否已经死亡
  isDead: boolean = false;

  constructor(planeEnemy: PlaneEnemy, config: IBigEnemyConfig) {
    this.planeEnemy = planeEnemy;
    Object.assign(this, config);
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
        const bullet = new BigEnemyBullet(x, y, vx, vy, this);
        this.bulletList.push(bullet);
      }

      {
        const cx = Math.cos(this.angle + Math.PI / 2);
        const cy = Math.sin(this.angle + Math.PI / 2);
        const x = this.matrix.elements[6] + radius * cx;
        const y = this.matrix.elements[7] + radius * cy;
        const vx = cx * speed;
        const vy = cy * speed;
        const bullet2 = new BigEnemyBullet(x, y, vx, vy, this);
        this.bulletList.push(bullet2);
      }

      {
        const cx = Math.cos(this.angle + Math.PI);
        const cy = Math.sin(this.angle + Math.PI);
        const x = this.matrix.elements[6] + radius * cx;
        const y = this.matrix.elements[7] + radius * cy;
        const vx = cx * speed;
        const vy = cy * speed;
        const bullet3 = new BigEnemyBullet(x, y, vx, vy, this);
        this.bulletList.push(bullet3);
      }

      {
        const cx = Math.cos(this.angle + (Math.PI * 3) / 2);
        const cy = Math.sin(this.angle + (Math.PI * 3) / 2);
        const x = this.matrix.elements[6] + radius * cx;
        const y = this.matrix.elements[7] + radius * cy;
        const vx = cx * speed;
        const vy = cy * speed;
        const bullet3 = new BigEnemyBullet(x, y, vx, vy, this);
        this.bulletList.push(bullet3);
      }
    }, this.shootCooldown);
  }

  buildMissile() {
    if (this.missileList.length) return;
    // 生成导弹逻辑
    const p1 = new Vector2(this.matrix.elements[6], this.matrix.elements[7]);
    const planePos = this.planeEnemy.getPlanePos();
    const missile = new BigEnemyMissile(
      new Vector2(p1.x, p1.y),
      new Vector2(planePos.x, planePos.y),
      this
    );

    this.missileList.push(missile);
  }

  removeBullet(bullet: BigEnemyBullet) {
    const index = this.bulletList.indexOf(bullet);
    if (index > -1) {
      this.bulletList.splice(index, 1);
    }
  }

  removeMissile(missile: BigEnemyMissile) {
    const index = this.missileList.indexOf(missile);
    if (index > -1) {
      this.missileList.splice(index, 1);

      // 此时需要申请一个爆炸帧 todo:需要判断战机是否被命中
      this.planeEnemy.miniFly.createEffect(IMiniPlaneEffectType.EXPLODE,missile.planeX,missile.planeY);
      this.planeEnemy.removeBigEnemy(this)

    }
  }

  isHit(planeBullet: PlaneBullet) {
    const { x: bx, y: by } = planeBullet.config;
    const x = this.matrix.elements[6];
    const y = this.matrix.elements[7];
    const { radius } = this;
    const combat = planeBullet.config.combat;
    const v1 = new Vector2(bx - x, by - y);

    // 已经处于死亡状态
    if (this.isDead) {
      return {
        flag: false,
        isDead: this.isDead,
        x: x,
        y: y,
        score: 0,
      };
    }
    if (v1.length() < radius) {
      this.heath -= combat;

      if (this.heath <= 0) {
        this.isDead = true;
        this.buildMissile();
        return {
          flag: true,
          isDead: this.isDead,
          x: x,
          y: y,
          score: 500,
        };
      } else {
        return {
          flag: true,
          isDead: this.isDead,
          x: x,
          y: y,
          score: 100,
        };
      }
    } else {
      return {
        flag: false,
        isDead: this.isDead,
        x: x,
        y: y,
        score: 0,
      };
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
    // 开启入场动画
    if (!this.move) {
      const { x, targetHeight } = this;
      this.move = new EasedMove({ x: x, y: 0 }, { x: x, y: targetHeight }, 100);
    }
    const moveUpdate = this.move.update();
    const { x, y } = this.move.getCurrentPosition();
    this.matrix.makeTranslation(x, y);

    if (!moveUpdate) {
      this.buildBullet();
      this.matrix.rotate(this.angle);
      this.angle += this.angleSpeed;
      this.angle = this.angle % (Math.PI * 2);
    }

    // 导弹
    for (let i = 0; i < this.missileList.length; i++) {
      this.missileList[i].render(ctx);
    }

    // 当前大头兵没有被击毁
    if (!this.isDead) {
      // 螺旋子弹
      for (let i = 0; i < this.bulletList.length; i++) {
        this.bulletList[i].render(ctx);
      }

      ctx.save();
      ctx.transform(...this.matrix.toCanvasTransform());
      this.drawBox(ctx);
      ctx.restore();
    }
  }

  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = () => {};
}
