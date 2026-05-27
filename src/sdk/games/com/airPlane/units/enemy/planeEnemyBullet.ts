import type { IMiniActParams, IMiniGam } from '../../../../../type';
import type { PlaneEnemyUnit } from './planeEnemyUnit';
import { bulletConfig } from '../../config';
import type { IMiniPlaneEnemyBullets, MiniPlaneEnemyType } from '../../type';
import { Matrix3 } from '../../../../../utils/Matrix3';

export class PlaneEnemyBullet implements IMiniGam {
  bulletType: MiniPlaneEnemyType;
  planeEnemyUnit: PlaneEnemyUnit;
  enemyBullet: IMiniPlaneEnemyBullets;
  lastTime: number;

  matrix: Matrix3 = new Matrix3();
  constructor(type: MiniPlaneEnemyType, planeEnemyUnit: PlaneEnemyUnit) {
    this.bulletType = type;
    this.planeEnemyUnit = planeEnemyUnit;
    this.lastTime = Date.now();

    // 先都是普通子弹  todo 区分
    this.enemyBullet = JSON.parse(JSON.stringify(bulletConfig));

    this.buildEnemyBullet();
  }

  buildEnemyBullet() {
    const { speedY, h } = this.planeEnemyUnit.enemyUnit;
    const { cx, cy } = this.planeEnemyUnit;
    // 将子弹中心和敌方飞机中心对齐
    this.enemyBullet.x += cx;
    this.enemyBullet.y += cy + h / 2;

    this.matrix.makeTranslation(this.enemyBullet.x, this.enemyBullet.y);

    this.enemyBullet.speedY += speedY;
  }

  updatePos() {
    const temp = Date.now();
    const diff = temp - this.lastTime;
    this.lastTime = temp;
    this.enemyBullet.y += (this.enemyBullet.speedY * diff) / 100;
    this.matrix.makeTranslation(this.enemyBullet.x, this.enemyBullet.y);
  }

  updateSate() {
    if (this.enemyBullet.y > this.planeEnemyUnit.canvasHeight) {
      // 此时 需要移除当前单位
      this.planeEnemyUnit.planeEnemy.removeBullet(this);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    const { w, color } = this.enemyBullet;
    ctx.save();
    ctx.translate(this.matrix.elements[6], this.matrix.elements[7]);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, w / 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
    this.updatePos();
    this.updateSate();
  }
  actionStart = (p: IMiniActParams) => {};
  actionEnd = (p: IMiniActParams) => {};
  actionDoing = (p: IMiniActParams) => {};
}
