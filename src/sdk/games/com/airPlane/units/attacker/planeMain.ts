import type { IMiniActParams } from '../../../../../type';
import { PlaneUnit } from '../../base/planeUnit';
import { PlaneBulletType, type PlaneBulletParams, type PlaneUnitParams } from '../../base/type';
import { PlaneMainBody } from './planeMainBody';
import { PlaneMainBullet } from './planeMainBullet';
import { planeMainBulletConfig } from '../../config';

export class PlaneMain extends PlaneUnit {
  constructor(params: PlaneUnitParams) {
    super(params);
    this.updatePosX(this.unitX);
    this.planeBody = new PlaneMainBody({
      bodyWidth: this.unitWidth,
      bodyHeight: this.unitHeight,
      bodyX: this.unitX,
      bodyY: this.unitY,
      speedX: this.speedX,
      speedY: this.speedY,
    });

    const bulletParams = JSON.parse(JSON.stringify(planeMainBulletConfig)) as PlaneBulletParams

    bulletParams.bulletX = this.unitX;
    bulletParams.bulletY = this.unitY;
    const bullet = new PlaneMainBullet(PlaneBulletType.Normal,bulletParams,this);
    this.bulletBoxList.push(bullet);

  }

  updatePosX(x: number) {
    // 更新玩家位置 (平滑跟随鼠标/手指)
    this.unitX = x;
    this.matrix.makeTranslation(this.unitX, this.unitY);
    for(const bullet of this.bulletBoxList){
      bullet.updatePosX(this.unitX);
    }
  }

  actionDoing = (p: IMiniActParams) => {
    const { x } = p;
    this.updatePosX(x);
  };
}
