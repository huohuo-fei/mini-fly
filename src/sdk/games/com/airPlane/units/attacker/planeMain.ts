import type { IMiniActParams } from '../../../../../type';
import { PlaneUnit } from '../../base/planeUnit';
import {
  PlaneBulletType,
  type PlaneBulletParams,
  type PlaneUnitParams,
} from '../../base/type';
import { PlaneMainBody } from './planeMainBody';
import { PlaneMainBullet } from './planeMainBullet';
import { planeMainBulletConfig } from '../../config';

export class PlaneMain extends PlaneUnit {
  bulletGap: number = 8;
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

    const bulletParams = JSON.parse(
      JSON.stringify(planeMainBulletConfig)
    ) as PlaneBulletParams;

    bulletParams.bulletX = this.unitX;
    bulletParams.bulletY = this.unitY;
    const bullet = new PlaneMainBullet(
      PlaneBulletType.Normal,
      bulletParams,
      this
    );
    this.bulletBoxList.push(bullet);
  }

  // 增加子弹列数
  addBullet() {
    const len = this.bulletBoxList.length;
    if (len >= 3) return;

    const bulletParams = JSON.parse(
      JSON.stringify(planeMainBulletConfig)
    ) as PlaneBulletParams;
    if (len === 1) {
      bulletParams.bulletX = this.unitX + this.bulletGap;
      bulletParams.bulletY = this.unitY;
      const bullet = new PlaneMainBullet(
        PlaneBulletType.Normal,
        bulletParams,
        this
      );
      this.bulletBoxList[0].updatePos(this.unitX - this.bulletGap,this.unitY);
      this.bulletBoxList[0].refreshTimer()
      this.bulletBoxList.push(bullet);

    }else if (len === 2){

      bulletParams.bulletX = this.unitX;
      bulletParams.bulletY = this.unitY - 10;
      const bullet = new PlaneMainBullet(
        PlaneBulletType.Normal,
        bulletParams,
        this
      );
      for(let i = 0; i < this.bulletBoxList.length; i++){
        // this.bulletBoxList[i].stopBullet()
        const bullet = this.bulletBoxList[i];
        if( i === 0){
          bullet.updatePos(this.unitX - this.bulletGap * 1.5,this.unitY);
        }else if( i === 1){
          bullet.updatePos(this.unitX + this.bulletGap * 1.5,this.unitY);
        }
        bullet.refreshTimer()

      }
      this.bulletBoxList.push(bullet);
    }
  }

  // 减少子弹数
  reduceBullet() {
    const len = this.bulletBoxList.length;
    if (len <= 1) return;

  }

  updatePosX(x: number) {
    // 更新玩家位置 (平滑跟随鼠标/手指)
    this.unitX = x;
    this.matrix.makeTranslation(this.unitX, this.unitY);
    // for (const bullet of this.bulletBoxList) {
    //   bullet.updatePosX(this.unitX);
    // }

    const len = this.bulletBoxList.length;
    for (let i = 0; i < this.bulletBoxList.length; i++) {
      let bulletX = this.unitX;
      if (len === 1) {
        bulletX = this.unitX;
      } else if (len === 2) {
        if(i === 0){
          bulletX = bulletX - this.bulletGap;
        }else{
          bulletX = bulletX + this.bulletGap;
        }
      }else if( len === 3){
        if(i === 0){
          bulletX = bulletX - this.bulletGap * 1.5;
        }else if(i === 1){
          bulletX = bulletX + this.bulletGap * 1.5;
        }
      }
      const bullet = this.bulletBoxList[i];
      bullet.updatePosX(bulletX);
    }
  }

  actionDoing = (p: IMiniActParams) => {
    const { x } = p;
    this.updatePosX(x);
  };
}
