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
import { AttackerType, type MiniPlaneToolType } from '../../type';
import type { ToolShieldConfig } from '../tools/type';
import { ToolPlaneShield } from '../tools/toolShield';

export class PlaneMain extends PlaneUnit {
  bulletGap: number = 8;
  isSub: boolean = false;
  type: AttackerType = AttackerType.MAIN;
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
    if (this.isSub) {
      this.reduceBullet();
      return;
    }
    const len = this.bulletBoxList.length;
    if (len >= 3) {
      this.isSub = true;
      this.reduceBullet();
      return;
    }

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
      this.bulletBoxList[0].updatePos(this.unitX - this.bulletGap, this.unitY);
      this.bulletBoxList[0].refreshTimer();
      this.bulletBoxList.push(bullet);
    } else if (len === 2) {
      bulletParams.bulletX = this.unitX;
      bulletParams.bulletY = this.unitY - 10;
      const bullet = new PlaneMainBullet(
        PlaneBulletType.Normal,
        bulletParams,
        this
      );
      for (let i = 0; i < this.bulletBoxList.length; i++) {
        // this.bulletBoxList[i].stopBullet()
        const bullet = this.bulletBoxList[i];
        if (i === 0) {
          bullet.updatePos(this.unitX - this.bulletGap * 1.5, this.unitY);
        } else if (i === 1) {
          bullet.updatePos(this.unitX + this.bulletGap * 1.5, this.unitY);
        }
        bullet.refreshTimer();
      }
      this.bulletBoxList.push(bullet);
    }
  }

  // 减少子弹数
  reduceBullet() {
    const len = this.bulletBoxList.length;
    if (len <= 1) {
      this.isSub = false;
      this.addBullet();
      return;
    }

    if (len === 3) {
      // this.bulletBoxList.pop()
      for (let i = 0; i < this.bulletBoxList.length; i++) {
        // this.bulletBoxList[i].stopBullet()
        const bullet = this.bulletBoxList[i];
        if (i === 0) {
          bullet.updatePos(this.unitX - this.bulletGap, this.unitY);
          bullet.refreshTimer();
        } else if (i === 1) {
          bullet.updatePos(this.unitX + this.bulletGap, this.unitY);
          bullet.refreshTimer();
        } else {
          bullet.stopBullet();
        }
      }
    } else if (len === 2) {
      // this.bulletBoxList.pop();
      const one = this.bulletBoxList[0];
      one.updatePos(this.unitX, this.unitY);
      one.refreshTimer();
      const two = this.bulletBoxList[1];
      two.stopBullet();
    }
  }

  // 添加工具
  addTool(type: MiniPlaneToolType) {
    if(this.tools.length > 0) return
    console.log('create tool');
    
    const shieldConfig: ToolShieldConfig = {
      w: this.unitWidth,
      h: this.unitHeight,
      x: this.unitX,
      y: this.unitY,
    };

    const tool = new ToolPlaneShield(shieldConfig,this);
    this.tools.push(tool);
  }

  updatePosX(x: number) {
    // 更新玩家位置 (平滑跟随鼠标/手指)
    this.unitX = x;
    this.matrix.makeTranslation(this.unitX, this.unitY);

    // 在子弹减少时，去除已经没有子弹的弹道
    const ind = this.bulletBoxList.findIndex((bullet) => !bullet.enable);
    if (ind > -1) {
      this.bulletBoxList.splice(ind, 1);
    }

    // const len = this.bulletBoxList.length;
    // 只更新 存在定时器的子弹弹道
    const len = this.bulletBoxList.filter(
      (bullet) => bullet.bulletTimer !== null
    ).length;
    for (let i = 0; i < this.bulletBoxList.length; i++) {
      let bulletX = this.unitX;
      if (len === 1) {
        bulletX = this.unitX;
      } else if (len === 2) {
        if (i === 0) {
          bulletX = bulletX - this.bulletGap;
        } else {
          bulletX = bulletX + this.bulletGap;
        }
      } else if (len === 3) {
        if (i === 0) {
          bulletX = bulletX - this.bulletGap * 1.5;
        } else if (i === 1) {
          bulletX = bulletX + this.bulletGap * 1.5;
        }
      }
      const bullet = this.bulletBoxList[i];
      bullet.updatePosX(bulletX);
    }

    // 更新工具坐标
    for (let i = 0; i < this.tools.length; i++) {
      const tool = this.tools[i];
      tool.updatePos(this.unitX,this.unitY);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);
    for (let i = 0; i < this.tools.length; i++) {
      const tool = this.tools[i];
      tool.render(ctx);
    }

    // console.log(this.bulletBoxList);
    
  }

  actionDoing = (p: IMiniActParams) => {
    const { x } = p;
    this.updatePosX(x);
  };
}
