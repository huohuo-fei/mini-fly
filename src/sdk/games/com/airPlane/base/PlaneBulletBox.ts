import type { Vector2 } from '../../../../utils/Matrix3';
import { PlaneBase } from './planeBase';
import { PlaneBullet } from './planeBullet';
import type { PlaneUnit } from './planeUnit';
import {
  PlaneBulletType,
  type PlaneBulletParams,
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

  // 可以提到实现层
  buildBullet() {
    switch (this.type) {
      case PlaneBulletType.Normal:
        this.buildNormalBullet();
        return;
      case PlaneBulletType.Spiral:
        this.buildSpiralBullet();
        return;
      case PlaneBulletType.Trace:
        this.buildTraceBullet();
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

        // const nextAngle = angle + angleSpeed;

        // this.params.bulletAngle = nextAngle % (Math.PI * 2);
      }, this.params.shootCooldown);
    }
  }

  buildTraceBullet() {
    if (!this.bulletTimer) {
      this.bulletTimer = setInterval(() => {
        const config = JSON.parse(
          JSON.stringify(this.params)
        ) as PlaneBulletParams;

        // 追踪子弹 需要更改子弹的发射角度
        const endX = this.planeUnit.attackerX
        const endY = this.planeUnit.attackerY
        const startX = this.params.bulletX
        const startY = this.params.bulletY
        const angle = Math.atan2(endY - startY, endX - startX)
        const vx = Math.cos(angle);
        const vy = Math.sin(angle);
        config.direction = [vx, vy];
        const bullet = new PlaneBullet(this.type, this, config);
        this.bullets.push(bullet);
      }, this.params.shootCooldown);
    }
  }

  buildMissileBullet(p1:Vector2, p2:Vector2,height:number) {
    // 外层实现
    // 1. 计算中点
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;

    // 2. 计算垂直方向 (标准化向量)
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    // 垂直向量: (-dy, dx) 再除以长度得到单位向量
    const nx = -dy / len;
    const ny = dx / len;

    // 3. 计算顶点 (在中点基础上偏移)
    const vertexX = mx + nx * height;
    const vertexY = my + ny * height;
  }

  updatePosX(x: number) {
    this.params.bulletX = x;
  }

  // 更新子弹的起始位置
  updatePos(x: number, y: number) {
    this.params.bulletX = x;
    this.params.bulletY = y;
  }

  updatePosY(y: number) {
    this.params.bulletY = y;
  }

  // 更新子弹的方向
  updateDirection(direction: [number, number]) {
    this.params.direction = direction;
  }

  // 更新旋转角度
  updateAngle(angle: number) {
    this.params.bulletAngle = angle;
  }

  removeBullet(bullet: PlaneBullet) {
    const ind = this.bullets.indexOf(bullet);
    if (ind > -1) {
      this.bullets.splice(ind, 1);
      return true;
    }

    return false;
  }

  stopBullet(){
    if(this.bulletTimer){
      clearInterval(this.bulletTimer)
      this.bulletTimer = null
    }
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


}
