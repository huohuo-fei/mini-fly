import { PlaneBase } from './planeBase';
import type { PlaneBody } from './planeBody';
import type { PlaneBullet } from './planeBullet';
import type { PlaneBulletBox } from './PlaneBulletBox';
import type { HitInfo, PlaneUnitParams } from './type';

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

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.transform(...this.matrix.toCanvasTransform());
    this.planeBody?.render(ctx);
    // this.bullet?.render(ctx);
    for (let i = 0; i < this.bulletBoxList.length; i++) {
      this.bulletBoxList[i].render(ctx);
    }
    ctx.restore();
  }

  // 同步最新的战机位置
  syncAttackerPos(x: number, y: number) {
    this.attackerX = x;
    this.attackerY = y;
  }

  // 遍历子弹
  traverseBullet(callback: (bullet: PlaneBullet) => boolean) {
    for (let i = 0; i < this.bulletBoxList.length; i++) {
      const bulletBox = this.bulletBoxList[i];
      for (let i = 0; i < bulletBox.bullets.length; i++) {
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
  isHitUnit(bullet: PlaneBullet): HitInfo | null {
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
    this.planeBody = null;
    for (let i = 0; i < this.bulletBoxList.length; i++) {
      this.bulletBoxList[i].stopBullet();
    }
  }

  // 判断是否需要销毁当前作战单元
  isDestroy() {
    return true;
  }
}
