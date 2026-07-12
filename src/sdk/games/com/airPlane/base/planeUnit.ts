import { PlaneBase } from './planeBase';
import type { PlaneBody } from './planeBody';
import type { PlaneBullet } from './planeBullet';
import type { PlaneBulletBox } from './PlaneBulletBox';
import type { HitInfo, PlaneUnitParams } from './type';
import { nanoid } from 'nanoid';

export class PlaneUnit extends PlaneBase {
  canvasWidth: number = 0;
  canvasHeight: number = 0;
  unitWidth: number = 0;
  unitHeight: number = 0;
  unitX: number = 0;
  unitY: number = 0;
  speedX: number = 0;
  speedY: number = 0;
  shootCooldown: number = 0;
  health: number = 0;

  planeBody: PlaneBody | null = null;
  bulletBoxList: PlaneBulletBox[] = [];

  // 外层战机的位置
  attackerX: number = 0;
  attackerY: number = 0;

  score: number = 0;
  deadScore: number = 0;

  id: string = nanoid();
  constructor(params: PlaneUnitParams) {
    super();
    this.parseParams(params);
  }

  parseParams(params: PlaneUnitParams) {
    this.canvasHeight = params.canvasHeight;
    this.canvasWidth = params.canvasWidth;
    this.unitWidth = params.unitWidth;
    this.unitHeight = params.unitHeight;
    this.unitX = params.unitX;
    this.unitY = params.unitY;
    this.speedX = params.speedX;
    this.speedY = params.speedY;
    this.shootCooldown = params.shootCooldown;
    this.health = params.health;
    this.score = params.score;
  }

  beforeRender() {}

  render(ctx: CanvasRenderingContext2D) {
    this.beforeRender();
    ctx.save();
    ctx.transform(...this.matrix.toCanvasTransform());

    // 绘制机体
    this.planeBody?.enable && this.planeBody.render(ctx);

    // 绘制子弹
    for (let i = 0; i < this.bulletBoxList.length; i++) {
      const enableBox = this.bulletBoxList[i].enable;
      enableBox && this.bulletBoxList[i].render(ctx);
    }
    ctx.restore();
    this.invisible();
    this.checkState();
  }

  // 同步最新的战机位置
  syncAttackerPos(x: number, y: number) {
    this.attackerX = x;
    this.attackerY = y;
  }

  // 遍历当前所属作战单元下的子弹
  // 由主战机使用
  traverseBullet(callback: (bullet: PlaneBullet) => boolean) {
    for (let i = 0; i < this.bulletBoxList.length; i++) {
      const bulletBox = this.bulletBoxList[i];
      for (let i = 0; i < bulletBox.bullets.length; i++) {
        // 此时拿到了子弹
        // 将当前子弹信息返回出去，
        // 由外层具体的逻辑判断当前子弹是否发生碰撞
        const bullet = bulletBox.bullets[i];
        const flag = callback(bullet);
        if (flag) {
          this.removeBullet(bullet);
          return flag;
        }
      }
    }

    return false;
  }

  // 移除子弹
  removeBullet(bullet: PlaneBullet) {
    for (let i = 0; i < this.bulletBoxList.length; i++) {
      const res = this.bulletBoxList[i].removeBullet(bullet);
      if (res) break;
    }
  }

  // 判断子弹是否击中当前作战单元
  // 需要判断当前机体是否处于激活状态
  isHitUnit(bullet: PlaneBullet): HitInfo | null {
    if (!this.planeBody?.enable) return null;
    const { bulletHeight, bulletWidth, bulletX, bulletY, combat } =
      bullet.params;
    const { unitHeight, unitWidth, unitX, unitY } = this;
    const disX = Math.abs(bulletX - unitX);
    const disY = Math.abs(bulletY - unitY);
    if (
      disX < unitWidth / 2 + bulletWidth / 2 &&
      disY < unitHeight / 2 + bulletHeight / 2
    ) {
      this.health -= combat;
      const dead = this.health <= 0;

      if (dead && this.planeBody) {
        // 机体死亡
        this.planeBody.enable = false;
      }
      return {
        x: unitX,
        y: unitY,
        score: this.score,
        dead: dead,
      };
    }
    return null;
  }

  destroy() {
    this.planeBody?.enable && (this.planeBody.enable = false);
    for (let i = 0; i < this.bulletBoxList.length; i++) {
      this.bulletBoxList[i].stopBullet();
    }
  }
  // 判断是否需要销毁当前作战单元
  isDestroy() {
    return true;
  }

  // 当前body 超出了可视范围，则销毁
  invisible() {
    const { unitX, unitY, unitWidth, unitHeight, canvasHeight, canvasWidth } =
      this;

    const t = unitY + unitHeight;
    const l = unitX + unitWidth;
    const b = unitY - unitHeight;
    const r = unitX - unitWidth;

    if (t < 0 || l < 0 || b > canvasHeight || r > canvasWidth) {
      // 不可见的范围
      this.planeBody?.enable && (this.planeBody.enable = false);
    } else {
      // 可见范围
    }
  }

  checkState() {
    const bodyEnable = this.planeBody?.enable;
    const bulletEnable = this.bulletBoxList.some(
      (bulletBox) => bulletBox.enable
    );
    if (!bodyEnable && !bulletEnable) {
      this.removeUnit();
    }
  }

  removeUnit() {
    console.warn('需要上层实现');
  }
}
