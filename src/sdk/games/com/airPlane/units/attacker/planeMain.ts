import type { IMiniActParams } from '../../../../../type';
import { PlaneUnit } from '../../base/planeUnit';
import {
  PlaneBulletType,
  type PlaneBulletParams,
  type PlaneUnitParams,
  type HitInfo,
} from '../../base/type';
import { PlaneMainBody } from './planeMainBody';
import { PlaneMainBullet } from './planeMainBullet';
import { planeMainBulletConfig } from '../../config';
import { AttackerType, type MiniPlaneToolType } from '../../type';
import type { ToolShieldConfig } from '../tools/type';
import { ToolPlaneShield } from '../tools/toolShield';
import type { PlaneBullet } from '../../base/planeBullet';
import type { PlaneAttacker } from './planeAttacker';

export class PlaneMain extends PlaneUnit {
  planeAtt: PlaneAttacker;

  // 每列子弹的横向间隔
  bulletGap: number = 8;

  // 测试功能
  isSub: boolean = false;
  type: AttackerType = AttackerType.MAIN;

  noHitStartDur: number = 0;
  noHitTime: number = 3 * 1000;
  constructor(params: PlaneUnitParams, planeAtt: PlaneAttacker) {
    super(params);
    this.planeAtt = planeAtt;
    this.updatePosX(this.unitX);
    this.planeBody = new PlaneMainBody(
      {
        bodyWidth: this.unitWidth,
        bodyHeight: this.unitHeight,
        bodyX: this.unitX,
        bodyY: this.unitY,
        speedX: this.speedX,
        speedY: this.speedY,
      },
      this
    );

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
    if (this.tools.length > 0) return;
    console.log('create tool');

    const shieldConfig: ToolShieldConfig = {
      w: this.unitWidth,
      h: this.unitHeight,
      x: this.unitX,
      y: this.unitY,
    };

    const tool = new ToolPlaneShield(shieldConfig, this);
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
      tool.updatePos(this.unitX, this.unitY);
    }
  }

  beforeRender() {
    // 更新无敌状态
    if (this.noHit) {
      // this.noHitTimer--;
      const newDur = this.planeAtt.miniFly.flyState.duration;
      if (newDur - this.noHitStartDur > this.noHitTime) {
        this.noHit = false;
        this.planeAtt.closeInvincibleText()
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);
    for (let i = 0; i < this.tools.length; i++) {
      const tool = this.tools[i];
      tool.render(ctx);
    }
  }

  isHitUnit(bullet: PlaneBullet): HitInfo | null {
    if (!this.planeBody?.enable || this.noHit) return null;
    const { bulletHeight, bulletWidth, bulletX, bulletY } = bullet.params;
    const { unitHeight, unitWidth, unitX, unitY } = this;
    const disX = Math.abs(bulletX - unitX);
    const disY = Math.abs(bulletY - unitY);
    if (
      disX < unitWidth / 2 + bulletWidth / 2 &&
      disY < unitHeight / 2 + bulletHeight / 2
    ) {
      const dead = false;

      // 修改无敌状态 并记录时刻
      this.noHit = true;
      this.noHitStartDur = this.planeAtt.miniFly.flyState.duration;

      return {
        x: unitX,
        y: unitY,
        score: this.score,
        dead: dead,
      };
    }
    return null;
  }

  actionDoing = (p: IMiniActParams) => {
    const { x } = p;
    this.updatePosX(x);
  };
}
