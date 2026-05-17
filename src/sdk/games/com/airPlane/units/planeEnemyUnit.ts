import type {
  IMiniActParams,
  IMiniGam,
  IMiniPlaneEnemy,
  IMiniPlaneEnemyInfo,
} from '../../../../type';
import { MiniPlaneEnemyType } from '../../../../utils/common';
import { enemyConfig1, enemyConfig2, enemyConfig3 } from '../config';
import type { PlaneBullet } from './planeBullet';
import type { PlaneEnemy } from './planeEnemy';

export class PlaneEnemyUnit implements IMiniGam {
  enemyUnit: IMiniPlaneEnemy;
  lastTime: number;
  canvasWidth: number;
  canvasHeight: number;
  type: MiniPlaneEnemyType;
  enemyInfo: IMiniPlaneEnemyInfo;
  planeEnemy: PlaneEnemy;

  // 子弹相关
  bulletLastTime: number;

  constructor(
    type: MiniPlaneEnemyType,
    canvasWidth: number,
    canvasHeight: number,
    planeEnemy: PlaneEnemy
  ) {
    this.planeEnemy = planeEnemy;
    this.enemyInfo = {
      type,
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    };
    this.lastTime = Date.now();
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.type = type;
    this.enemyUnit = this.buildEnemyUnit();
    this.bulletLastTime = Date.now();
  }

  buildEnemyUnit() {
    const x = 20 + Math.random() * (this.canvasWidth - 50);
    let eConfig: IMiniPlaneEnemy = enemyConfig1;
    if (this.type === MiniPlaneEnemyType.LEVEL2) {
      eConfig = enemyConfig2;
    } else if (this.type === MiniPlaneEnemyType.LEVEL3) {
      eConfig = enemyConfig3;
    } else {
    }
    eConfig = JSON.parse(JSON.stringify(eConfig));
    eConfig.x = x;
    this.enemyInfo.x = x;
    this.enemyInfo.y = eConfig.y;
    this.enemyInfo.w = eConfig.w;
    this.enemyInfo.h = eConfig.h;
    return eConfig;
  }
  updatePos() {
    const temp = Date.now();
    const diff = temp - this.lastTime;
    this.lastTime = temp;
    this.enemyUnit.y += (this.enemyUnit.speedY * diff) / 100;
  }

  updateSate() {
    if (this.enemyUnit.y > this.canvasHeight) {
      // 此时 需要移除当前单位
      this.planeEnemy.removeUnit(this);
    }
  }

  // 生成子弹
  generateBullet() {
    const { shootCooldown } = this.enemyUnit;
    const currentTime = Date.now();
    if (currentTime - this.bulletLastTime >= shootCooldown * 1000) {
      this.bulletLastTime = currentTime;
      this.planeEnemy.addBullet(this.type, this);
    }
  }

  // 碰撞检测
  isHit(bullet: PlaneBullet) {
    const { x, y, w, h } = this.enemyUnit;
    const { x: bx, y: by, w: bw, h: bh } = bullet.config;

    // todo: 添加生命值和分数逻辑
    if (x < bx + bw && x + w > bx && y < by + bh && y + h > by) {
      // 碰撞
      return true;
    } else {
      return false;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h, color } = this.enemyUnit;
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = color;
    ctx.shadowBlur = 6;
    ctx.shadowColor = 'red';
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
    this.updatePos();
    this.updateSate();
    this.generateBullet();
  }
  actionStart = (p: IMiniActParams) => {};
  actionEnd = (p: IMiniActParams) => {};
  actionDoing = (p: IMiniActParams) => {};
}
