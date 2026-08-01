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
import {
  AttackerType,
  IMiniPlaneEffectType,
  MiniPlaneToolType,
} from '../../type';
import type { ToolShieldConfig } from '../tools/type';
import { ToolPlaneShield } from '../tools/toolShield';
import type { PlaneBullet } from '../../base/planeBullet';
import type { PlaneAttacker } from './planeAttacker';
import { MiniFlyState } from '../../state/flyState';
import type { TextUnit } from '../textTip/textUnit';

export class PlaneMain extends PlaneUnit {
  planeAtt: PlaneAttacker;

  // 每列子弹的横向间隔
  bulletGap: number = 8;

  type: AttackerType = AttackerType.MAIN;

  // 无敌状态已经持续的时间
  noHitStartDur: number = 0;
  // 每次进入无敌状态的总时间
  noHitTime: number = 3 * 1000;
  noHitText: TextUnit | null = null;

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
    const len = this.bulletBoxList.length;
    if (len >= 3) {
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

  // 击中后 重新设置子弹数量
  resetBullet() {
    for (let i = 0; i < this.bulletBoxList.length; i++) {
      const bullet = this.bulletBoxList[i];
      if (i === 0) {
        bullet.updatePos(this.unitX, this.unitY);
        bullet.refreshTimer();
      } else {
        bullet.stopBullet();
      }
    }
  }

  // 添加工具
  addTool(type: MiniPlaneToolType) {
    // if (this.tools.length > 0) return;
    // console.log('create tool');

    const toolInd = this.tools.findIndex((tool) => tool.type === type);

    if (toolInd > -1) {
      // todo:相同的工具是否可以叠加使用
      // const tool = this.tools[toolInd];
    } else {
      const shieldConfig: ToolShieldConfig = {
        w: this.unitWidth,
        h: this.unitHeight,
        x: this.unitX,
        y: this.unitY,
      };
      const tool = new ToolPlaneShield(shieldConfig, this);
      this.tools.push(tool);
    }
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
      const newDur = MiniFlyState.duration;
      if (newDur - this.noHitStartDur > this.noHitTime) {
        this.noHit = false;
        this.closeInvincibleText();
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

  // 判断是否被敌机的子弹击中
  // 战机处于无敌状态时，不能被选中
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
      // 被子弹击中后，需要执行的逻辑：
      let dead = false;

      // 1.重置子弹列数
      this.resetBullet();
      // 2.护盾情况
      const ind = this.tools.findIndex(
        (tool) => tool.type === MiniPlaneToolType.SHIELD
      );
      if (ind > -1 && !(this.tools[ind] as ToolPlaneShield).blinkState) {
        // 此时有护盾,并且护盾还未击碎
        (this.tools[ind] as ToolPlaneShield).forceBlink();
      } else {
        // 此时没有护盾，或者护盾已经处于击碎状态，则执行正常的战损逻辑
        this.noHit = true;
        this.noHitStartDur = MiniFlyState.duration;
        const lifeVal = MiniFlyState.life;
        if (lifeVal > 1) {
          this.planeAtt.miniFly.createEffect(
            IMiniPlaneEffectType.DAMAGE,
            unitX,
            unitY
          );
        } else {
          this.planeAtt.miniFly.createEffect(
            IMiniPlaneEffectType.EXPLODE,
            unitX,
            unitY
          );
          dead = true;
          console.log('战机阵亡，游戏结束');
        }
        MiniFlyState.life -= 1;
        this.showInvincibleText();
      }

      return {
        x: unitX,
        y: unitY,
        score: this.score,
        dead: dead,
      };
    }
    return null;
  }

  // 无敌提示文字
  showInvincibleText() {
    // 追加一个提示文字
    const canvasWidth = this.canvasWidth;
    const cx = canvasWidth / 2;
    const h = 50;
    const t1 = {
      text: '✦✦ 无敌 ✦✦',
      x: cx,
      y: h,
      color: '#00ff66',
      fontSize: 14,
    };

    this.noHitText = this.planeAtt.miniFly.planeText.addText(t1);
  }

  // 关闭文字
  closeInvincibleText() {
    if (this.noHitText) {
      this.planeAtt.miniFly.planeText.removeText(this.noHitText);
    }
  }

  actionDoing = (p: IMiniActParams) => {
    const { x } = p;
    this.updatePosX(x);
  };
}
