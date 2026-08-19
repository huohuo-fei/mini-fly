import { PlaneUnit } from '../../base/planeUnit';
import {
  PlaneBulletType,
  type PlaneBulletParams,
  type PlaneUnitParams,
  type HitInfo,
  BulletCamp,
} from '../../base/type';
import { PlaneMainBody } from './planeMainBody';

import { MiniPlaneToolType, type ToolShieldConfig } from '../tools/type';
import { ToolPlaneShield } from '../tools/toolShield';
import { PlaneBullet } from '../../base/planeBullet';
import type { PlaneAttacker } from './planeAttacker';
import { MiniFlyState } from '../../state/flyState';
import type { TextUnit } from '../textTip/textUnit';
import { GameModel, MINI_GAME_OVER } from '../../../../..';
import { AttackerType } from './type';
import { planeMainBulletConfig } from './config';
import { IMiniPlaneEffectType } from '../effect/type';

export class PlaneMain extends PlaneUnit {
  planeAtt: PlaneAttacker;

  // 每列子弹的横向间隔
  bulletGap: number = 16;

  type: AttackerType = AttackerType.MAIN;

  // 无敌状态已经持续的时间
  noHitStartDur: number = 0;
  // 每次进入无敌状态的总时间
  noHitTime: number = 3 * 1000;
  noHitText: TextUnit | null = null;

  // 子弹生成逻辑
  bulletLastTime: number = 0;
  bulletConfig: PlaneBulletParams = planeMainBulletConfig;
  bulletSize: number = 2;

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
  }

  // 增加子弹列数
  addBullet() {
    if (this.bulletSize >= 3) return;
    this.bulletSize++;
  }

  // 击中后 重新设置子弹数量
  resetBullet() {
    if(MiniFlyState.model === GameModel.FORMAL){
      this.bulletSize = 1;
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
    // 更新工具坐标
    for (let i = 0; i < this.tools.length; i++) {
      const tool = this.tools[i];
      tool.updatePos(this.unitX, this.unitY);
    }
  }

  updatePos(x: number, y: number) {
    this.unitX = x;
    this.unitY = y;
    this.matrix.makeTranslation(this.unitX, this.unitY);
    // 更新工具坐标
    for (let i = 0; i < this.tools.length; i++) {
      const tool = this.tools[i];
      tool.updatePos(this.unitX, this.unitY);
    }
  }

  beforeRender = () => {
    // 更新无敌状态
    if (this.noHit) {
      const newDur = MiniFlyState.duration;
      if (newDur - this.noHitStartDur > this.noHitTime) {
        this.noHit = false;
        this.closeInvincibleText();
      }
    }

    this.createBullet();
  };

  render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);
    for (let i = 0; i < this.tools.length; i++) {
      const tool = this.tools[i];
      tool.render(ctx);
    }
  }

  createBullet() {
    // 获取游戏时间
    const time = MiniFlyState.duration;
    const deltaTime = time - this.bulletLastTime;

    if (deltaTime >= this.bulletConfig.shootCooldown) {
      const bulletParams = JSON.parse(
        JSON.stringify(this.bulletConfig)
      ) as PlaneBulletParams;
      this.bulletLastTime = time;
      if (this.bulletSize === 1) {
        bulletParams.bulletX = this.unitX;
        bulletParams.bulletY = this.unitY;
        this.planeAtt.miniFly.planeBullets.addBulletByParams(
          PlaneBulletType.Normal,
          BulletCamp.Player,
          bulletParams
        );
      } else if (this.bulletSize === 2) {
        bulletParams.bulletX = this.unitX - this.bulletGap;
        bulletParams.bulletY = this.unitY;
        this.planeAtt.miniFly.planeBullets.addBulletByParams(
          PlaneBulletType.Normal,
          BulletCamp.Player,
          bulletParams
        );
        bulletParams.bulletX = this.unitX + this.bulletGap;
        bulletParams.bulletY = this.unitY;
        this.planeAtt.miniFly.planeBullets.addBulletByParams(
          PlaneBulletType.Normal,
          BulletCamp.Player,
          bulletParams
        );
      } else {
        bulletParams.bulletX = this.unitX - this.bulletGap * 1.5;
        bulletParams.bulletY = this.unitY;
        this.planeAtt.miniFly.planeBullets.addBulletByParams(
          PlaneBulletType.Normal,
          BulletCamp.Player,

          bulletParams
        );
        bulletParams.bulletX = this.unitX + this.bulletGap * 1.5;
        bulletParams.bulletY = this.unitY;
        this.planeAtt.miniFly.planeBullets.addBulletByParams(
          PlaneBulletType.Normal,
          BulletCamp.Player,

          bulletParams
        );
        bulletParams.bulletX = this.unitX;
        bulletParams.bulletY = this.unitY - 20;
        this.planeAtt.miniFly.planeBullets.addBulletByParams(
          PlaneBulletType.Normal,
          BulletCamp.Player,
          bulletParams
        );
      }
    }
  }

  gameEnd() {
    this.planeAtt.screen.emit(MINI_GAME_OVER, {
      score: MiniFlyState.score,
      time: MiniFlyState.duration,
      des: '游戏结束',
    });
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
          this.gameEnd();
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

  // 战机相撞 返回逻辑
  collidePlane(plane: PlaneUnit) {
    const { unitHeight: h1, unitWidth: w1, unitX: x1, unitY: y1 } = plane;
    const { unitHeight: h2, unitWidth: w2, unitX: x2, unitY: y2 } = this;
    if (
      Math.abs(x1 - x2) < (w1 + w2) / 2 &&
      Math.abs(y1 - y2) < (h1 + h2) / 2
    ) {
      // 忽略无敌状态的碰撞
      if (!this.noHit) {
        console.log('碰撞');
        this.gameEnd();
      }
    } else {
    }
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
      fontSize: 24,
    };

    this.noHitText = this.planeAtt.miniFly.planeText.addText(t1);
  }

  // 关闭文字
  closeInvincibleText() {
    if (this.noHitText) {
      this.planeAtt.miniFly.planeText.removeText(this.noHitText);
    }
  }
}
