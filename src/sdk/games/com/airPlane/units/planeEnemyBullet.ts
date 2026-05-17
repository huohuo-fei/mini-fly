import type {
  IMiniActParams,
  IMiniGam,
  IMiniPlaneEnemyBullets,
} from '../../../../type';
import type { MiniPlaneEnemyType } from '../../../../utils/common';
import type { PlaneEnemyUnit } from './planeEnemyUnit';
import { bulletConfig } from '../config';

export class PlaneEnemyBullet implements IMiniGam {
  bulletType: MiniPlaneEnemyType;
  planeEnemyUnit: PlaneEnemyUnit;
  enemyBullet: IMiniPlaneEnemyBullets;
  lastTime: number;
  constructor(type: MiniPlaneEnemyType, planeEnemyUnit: PlaneEnemyUnit) {
    this.bulletType = type;
    this.planeEnemyUnit = planeEnemyUnit;
    this.lastTime = Date.now();

    // 先都是普通子弹  todo 区分
    this.enemyBullet = JSON.parse(JSON.stringify(bulletConfig));

    this.buildEnemyBullet();
  }

  buildEnemyBullet() {
    const { speedY, x, y, h, w } = this.planeEnemyUnit.enemyUnit;
    // this.enemyBullet.x += x + w / 2 - this.enemyBullet.w / 2;
    // this.enemyBullet.y += y + h;

    // 将子弹中心和敌方飞机中心对齐
    this.enemyBullet.x += x + w / 2 - this.enemyBullet.w / 2 ;
    this.enemyBullet.y += y + h;
    
    this.enemyBullet.speedY += speedY;
  }

  updatePos() {
    const temp = Date.now();
    const diff = temp - this.lastTime;
    this.lastTime = temp;
    this.enemyBullet.y += (this.enemyBullet.speedY * diff) / 100;
  }

  updateSate() {
    if (this.enemyBullet.y > this.planeEnemyUnit.canvasHeight) {
      // 此时 需要移除当前单位
      this.planeEnemyUnit.planeEnemy.removeBullet(this);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    const { w, h, x, y,color } = this.enemyBullet;
    ctx.beginPath()
    ctx.save()
    ctx.fillStyle = color;
    ctx.moveTo(x + w, y + h / 2);
    ctx.arc(x + w / 2, y + h / 2, w/2, 0, 2 * Math.PI);
    ctx.fill()
    ctx.restore()
    this.updatePos();
    this.updateSate()
  }
  actionStart = (p: IMiniActParams) => {};
  actionEnd = (p: IMiniActParams) => {};
  actionDoing = (p: IMiniActParams) => {};
}
