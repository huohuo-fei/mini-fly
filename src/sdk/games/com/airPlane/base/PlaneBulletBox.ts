import { PlaneBase } from './planeBase';
import { PlaneBullet } from './planeBullet';
import type { PlaneUnit } from './planeUnit';
import {
  PlaneBulletType,
  type PlaneBulletParams,
  type PlaneUnitParams,
} from './type';

export class PlaneBulletBox extends PlaneBase {
  // 各种类型的子弹共有的参数
  type: PlaneBulletType = PlaneBulletType.Normal;
  bullets: PlaneBullet[] = [];
  bulletTimer: number | null = null;
  params: PlaneBulletParams;
  planeUnit: PlaneUnit;

  constructor(
    type: PlaneBulletType,
    params: PlaneBulletParams,
    planeUnit: PlaneUnit
  ) {
    super();
    this.type = type;
    this.params = JSON.parse(JSON.stringify(params)) as PlaneBulletParams;
    this.planeUnit = planeUnit;
    this.buildBullet();
  }

  buildBullet() {
    switch (this.type) {
      case PlaneBulletType.Normal:
        this.buildNormalBullet();
        return;
      case PlaneBulletType.Spiral:
        this.buildSpiralBullet();
        return;
    }
  }

  buildNormalBullet() {
    if (!this.bulletTimer) {
      this.bulletTimer = setInterval(() => {
        const config = JSON.parse(
          JSON.stringify(this.params)
        ) as PlaneBulletParams;
        const bullet = new PlaneBullet(this.type, this, config);
        this.bullets.push(bullet);
      }, this.params.shootCooldown);
    }
  }

  buildSpiralBullet() {
    if (!this.bulletTimer) {
      this.bulletTimer = setInterval(() => {
        const config = JSON.parse(
          JSON.stringify(this.params)
        ) as PlaneBulletParams;

        // 螺旋子弹 需要更改子弹的发射角度
        const angle = this.params.bulletAngle || 0;
        const angleSpeed = this.params.bulletAngleSpeed || 0;
        const vx = Math.cos(angle);
        const vy = Math.sin(angle);
        config.direction = [vx, vy];
        const bullet = new PlaneBullet(this.type, this, config);
        this.bullets.push(bullet);

        const nextAngle = angle + angleSpeed;

        this.params.bulletAngle = nextAngle % (Math.PI * 2);
      }, this.params.shootCooldown);
    }
  }

  updatePosX(x: number) {
    this.params.bulletX = x;
  }

  updatePos(x: number, y: number) {
    this.params.bulletX = x;
    this.params.bulletY = y;
  }

  updatePosY(y: number) {
    this.params.bulletY = y;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    // 将画布复原为初始状态
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (let i = 0; i < this.bullets.length; i++) {
      const b = this.bullets[i];
      b.render(ctx);
    }
    ctx.restore();
  }

  removeBullet(bullet: PlaneBullet) {
    const ind = this.bullets.indexOf(bullet);
    if (ind > -1) {
      this.bullets.splice(ind, 1);
      return true;
    }

    return false;
  }
}
