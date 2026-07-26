import { AttackerType } from '../type';
import { PlaneBase } from './planeBase';
import { PlaneBullet } from './planeBullet';
import type { PlaneUnit } from './planeUnit';
import { PlaneBulletType, type PlaneBulletParams } from './type';

export class PlaneBulletBox extends PlaneBase {
  // 各种类型的子弹共有的参数
  type: PlaneBulletType = PlaneBulletType.Normal;
  bullets: PlaneBullet[] = [];
  bulletTimer: number | null = null;
  params: PlaneBulletParams;
  planeUnit: PlaneUnit;

  enable: boolean = false;
  // 子弹发射器上一次生成子弹的时间
  lastTime: number = 0;

  constructor(
    type: PlaneBulletType,
    params: PlaneBulletParams,
    planeUnit: PlaneUnit
  ) {
    super();
    this.enable = true;
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
    const config = JSON.parse(JSON.stringify(this.params)) as PlaneBulletParams;
    const bullet = new PlaneBullet(this.type, this, config);
    this.bullets.push(bullet);
    this.bulletTimer = 1

  }

  buildSpiralBullet() {
    const config = JSON.parse(JSON.stringify(this.params)) as PlaneBulletParams;

    // 螺旋子弹 需要更改子弹的发射角度
    const angle = this.params.bulletAngle || 0;
    const vx = Math.cos(angle);
    const vy = Math.sin(angle);
    config.direction = [vx, vy];
    const bullet = new PlaneBullet(this.type, this, config);
    this.bullets.push(bullet);
    this.bulletTimer = 1
  }

  buildTraceBullet() {
    const config = JSON.parse(JSON.stringify(this.params)) as PlaneBulletParams;

    // 追踪子弹 需要更改子弹的发射角度
    const endX = this.planeUnit.attackerX;
    const endY = this.planeUnit.attackerY;
    const startX = this.params.bulletX;
    const startY = this.params.bulletY;
    const angle = Math.atan2(endY - startY, endX - startX);
    const vx = Math.cos(angle);
    const vy = Math.sin(angle);
    config.direction = [vx, vy];
    const bullet = new PlaneBullet(this.type, this, config);
    this.bullets.push(bullet);
    this.bulletTimer = 1
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

  // 在执行移除子弹的操作之前，做些什么
  // 主要针对的是编队类型的子弹
  // 编队类型是从屏幕外向屏幕内移动
  // 所以最开始的编队内的飞机会触发移除子弹的操作
  beforeRemoveBullet() {
    return true;
  }

  removeBullet(bullet: PlaneBullet) {
    // console.log('removeBullet');
    const res = this.beforeRemoveBullet();
    if (!res) return;
    const ind = this.bullets.indexOf(bullet);
    if (ind > -1) {
      this.bullets.splice(ind, 1);

      // 如果当前的子弹数量为零，则将子弹箱禁用,
      // 不在生成新的子弹 , 并为后续的机体回收做判断条件
      // 此种情况 需要过滤掉主战机的情况
      if (this.bullets.length === 0) {
        if (this.planeUnit.type !== AttackerType.MAIN) {
          this.enable = false;
        }
      }
      return true;
    }

    return false;
  }

  stopBullet() {
    if (this.bulletTimer) {
      clearInterval(this.bulletTimer);
      this.bulletTimer = null;
    }
  }

  // 恢复计时器
  refreshTimer() {
    // this.buildBullet()
    this.stopBullet();
    this.buildBullet();
  }

  // 移除所有在屏子弹
  clearBullet() {
    this.bullets = [];
    if (!this.bulletTimer) {
      this.enable = false;
    }
  }

  // 替换 setinterval 的方法
  // bulletTimer 依然作为 不创建新的子弹 但需要渲染旧子弹的标识 
  loopBuildBullet() {
    const time = new Date().getTime();
    if (time - this.lastTime > this.params.shootCooldown && this.bulletTimer !== null) {
      // 此时要生成新的子弹
      this.buildBullet();
      this.lastTime = time;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    this.loopBuildBullet();
    ctx.save();
    // 将画布复原为初始状态
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (let i = 0; i < this.bullets.length; i++) {
      const b = this.bullets[i];
      b.render(ctx);
    }
    ctx.restore();

    // 补丁：如果没有子弹，则将子弹箱禁用
    if (this.bullets.length === 0 && this.bulletTimer == null) {
      this.enable = false;
    }
  }
}
