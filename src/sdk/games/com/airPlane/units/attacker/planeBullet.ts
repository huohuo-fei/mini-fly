import type { IMiniActParams, IMiniGam } from '../../../../../type';

import type { MyBulletConfig, MyBulletType } from '../../type';
import { myBulletConfig } from '../../config';
import type { PlaneBullelBox } from './planeBulletBox';
import { Matrix3 } from '../../../../../utils/Matrix3';

export class PlaneBullet implements IMiniGam {
  config: MyBulletConfig;
  type: MyBulletType;
  bulletBox: PlaneBullelBox;
  matrix: Matrix3 = new Matrix3();

  constructor(
    type: MyBulletType,
    bulletBox: PlaneBullelBox,
    params?: MyBulletConfig
  ) {
    if (params) {
      this.config = JSON.parse(JSON.stringify(params));
    } else {
      this.config = JSON.parse(JSON.stringify(myBulletConfig));
    }
    this.bulletBox = bulletBox;
    this.type = type;
    this.matrix.makeTranslation(this.config.x, this.config.y);
  }

  updatePos() {
    this.config.y -= this.config.speedY;
    this.matrix.makeTranslation(this.config.x, this.config.y);
  }

  updateSate() {
    if (this.config.y < -this.config.h * 3) {
      // 此时 需要移除当前单位
      this.bulletBox.removeBullet(this);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    const {w, h } = this.config;
    ctx.save();
    ctx.translate(this.matrix.elements[6], this.matrix.elements[7])
    ctx.shadowColor = 'red';
    ctx.fillStyle = '#ffcc44';
    ctx.shadowBlur = 8;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.restore();
    this.updatePos();
    this.updateSate();
  }
  actionStart = (p: IMiniActParams) => {};
  actionEnd = (p: IMiniActParams) => {};
  actionDoing = (p: IMiniActParams) => {};
}
