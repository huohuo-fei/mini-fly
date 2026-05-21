import type { IMiniActParams, IMiniGam } from '../../../../../type';

import type { MyBulletConfig, MyBulletType } from '../../type';
import { myBulletConfig } from '../../config';
import type { PlaneAttacker } from './planeAttacker';

export class PlaneBullet implements IMiniGam {
  config: MyBulletConfig;
  type: MyBulletType;
  attacker: PlaneAttacker;

  constructor(
    type: MyBulletType,
    attacker: PlaneAttacker,
    params?: MyBulletConfig
  ) {
    if (params) {
      this.config = JSON.parse(JSON.stringify(params));
    } else {
      this.config = JSON.parse(JSON.stringify(myBulletConfig));
    }
    this.attacker = attacker;
    this.type = type;
  }

  updatePos() {
    this.config.y -= this.config.speedY;
  }

  updateSate() {
    if (this.config.y < -this.config.h * 3) {
      // 此时 需要移除当前单位
      this.attacker.removeBullet(this);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this.config;
    ctx.save();
    ctx.shadowColor = 'red';
    ctx.fillStyle = '#ffcc44';
    ctx.shadowBlur = 8;
    ctx.fillRect(x, y, w, h);
    ctx.restore();
    this.updatePos();
    this.updateSate();
  }
  actionStart = (p: IMiniActParams) => {};
  actionEnd = (p: IMiniActParams) => {};
  actionDoing = (p: IMiniActParams) => {};
}
