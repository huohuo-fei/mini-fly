import type { IMiniActParams, IMiniGam } from '../../../../../type';
import { enemyConfig1, enemyConfig2, enemyConfig3 } from '../../config';
import {
  MiniPlaneEnemyType,
  type IMiniPlaneEnemy,
  type IMiniPlaneEnemyInfo,
} from '../../type';
import type { PlaneBullet } from '../attacker/planeBullet';
import type { PlaneEnemy } from './planeEnemy';

export class PlaneEnemyUnit implements IMiniGam {
  enemyUnit: IMiniPlaneEnemy;
  lastTime: number;
  canvasWidth: number;
  canvasHeight: number;
  type: MiniPlaneEnemyType;
  enemyInfo: IMiniPlaneEnemyInfo;
  planeEnemy: PlaneEnemy;
  showHp: boolean = false;
  cx: number = 0;
  cy: number = 0;

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
    this.cx = x + eConfig.w / 2;
    this.cy = eConfig.y + eConfig.h / 2;
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
    this.cy = this.enemyUnit.y + this.enemyUnit.h / 2;
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
      this.showHp = false;
      return false;
    }
  }

  // 获取当前敌机的中心位置
  getPos() {
    return [
      this.enemyUnit.x + this.enemyUnit.w / 2,
      this.enemyUnit.y + this.enemyUnit.h / 2,
    ];
  }

  // 重新计算血条 和分数
  updateHp(bullet: PlaneBullet) {
    this.showHp = true;
    const { combat } = bullet.config;
    const { health } = this.enemyUnit;
    if (health <= 0) {
      console.log('update hp error');
    } else {
      this.enemyUnit.health = health - combat;
    }
  }

  updateHpByNum(num:number) {
    this.showHp = true;
    const { health } = this.enemyUnit;
    if (health <= 0) {
      console.log('update hp error');
    } else {
      this.enemyUnit.health = health - num ;
    }
  }

  // 敌机是否死亡
  isDead() {
    return this.enemyUnit.health <= 0;
  }

  render(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h, color } = this.enemyUnit;
    this.drawHp(ctx);
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

  drawHp(ctx: CanvasRenderingContext2D) {
    if (!this.showHp) return;
    const { x, y, w, health, maxHealth } = this.enemyUnit;
    const hpw = w;
    const hph = 4;
    ctx.beginPath();
    ctx.save();

    // 血条背景色
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, y - 6, hpw, hph);

    ctx.fillStyle = 'red';
    const hp = health / maxHealth;
    ctx.fillRect(x, y - 6, hpw * hp, hph);

    ctx.restore();
  }
  actionStart = (p: IMiniActParams) => {};
  actionEnd = (p: IMiniActParams) => {};
  actionDoing = (p: IMiniActParams) => {};
}
