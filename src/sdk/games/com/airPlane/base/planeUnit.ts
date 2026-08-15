import { MiniBase } from '../../../../miniBase/miniBase';
import type { AttackerType } from '../units/attacker/type';
import { EnemyType } from '../units/enemy/type';
import type { PlaneBody } from './planeBody';
import type { PlaneBullet } from './planeBullet';
import type { PlaneToolBase } from './planeToolBase';
import type { HitInfo, PlaneUnitParams } from './type';
import { nanoid } from 'nanoid';

export abstract class PlaneUnit extends MiniBase {
  canvasWidth: number = 0;
  canvasHeight: number = 0;
  unitWidth: number = 0;
  unitHeight: number = 0;
  unitX: number = 0;
  unitY: number = 0;
  speedX: number = 0;
  speedY: number = 0;
  shootCooldown: number = 0;
  health: number = 0;
  type: EnemyType | AttackerType = EnemyType.BOSS;

  // 是否无敌
  noHit: boolean = false;
  planeBody: PlaneBody | null = null;

  tools: PlaneToolBase[] = [];

  // 外层战机的位置
  attackerX: number = 0;
  attackerY: number = 0;

  score: number = 0;
  deadScore: number = 0;

  id: string = nanoid();
  constructor(params: PlaneUnitParams) {
    super();
    this.parseParams(params);
  }

  parseParams(params: PlaneUnitParams) {
    this.canvasHeight = params.canvasHeight;
    this.canvasWidth = params.canvasWidth;
    this.unitWidth = params.unitWidth;
    this.unitHeight = params.unitHeight;
    this.unitX = params.unitX;
    this.unitY = params.unitY;
    this.speedX = params.speedX;
    this.speedY = params.speedY;
    this.shootCooldown = params.shootCooldown;
    this.health = params.health;
    this.score = params.score;
  }

  render(ctx: CanvasRenderingContext2D) {
    this.beforeRender();
    ctx.save();
    ctx.transform(...this.matrix.toCanvasTransform());

    // 绘制机体
    this.planeBody?.enable && this.planeBody.render(ctx);

    ctx.restore();
    this.invisible();
    this.checkState();
  }

  // 移除工具
  removeTool(tool: PlaneToolBase) {
    const ind = this.tools.findIndex((item) => item === tool);
    if (ind !== -1) {
      this.tools.splice(ind, 1);
    }
  }

  // 判断子弹是否击中当前作战单元
  // 需要判断当前机体是否处于激活状态
  isHitUnit(bullet: PlaneBullet): HitInfo | null {
    if (!this.planeBody?.enable) return null;
    const { bulletHeight, bulletWidth, bulletX, bulletY, combat } =
      bullet.params;
    const { unitHeight, unitWidth, unitX, unitY } = this;
    const disX = Math.abs(bulletX - unitX);
    const disY = Math.abs(bulletY - unitY);
    if (
      disX < unitWidth / 2 + bulletWidth / 2 &&
      disY < unitHeight / 2 + bulletHeight / 2
    ) {
      this.health -= combat;
      const dead = this.health <= 0;

      if (dead && this.planeBody) {
        // 机体死亡
        this.planeBody.enable = false;
        this.bodyDead();
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

  // 当前body 超出了可视范围，改变机体的状态
  invisible() {
    const { unitX, unitY, unitWidth, unitHeight, canvasHeight, canvasWidth } =
      this;

    const t = unitY + unitHeight;
    const l = unitX + unitWidth;
    const b = unitY - unitHeight;
    const r = unitX - unitWidth;

    if (t < 0 || l < 0 || b > canvasHeight || r > canvasWidth) {
      // 不可见的范围
      this.planeBody?.enable && (this.planeBody.enable = false);
    } else {
      // 可见范围
    }
  }

  // 依据机体 和 子弹弹道的状态，判断是否需要销毁当前作战单元 从画布移除
  checkState() {
    const bodyEnable = this.planeBody?.enable;
    if (!bodyEnable) {
      this.removeUnit();
    }
  }

  // 直接扣除生命值
  damageWithScore(damageNum: number) {
    // 如果机体已经消亡
    if (!this.planeBody?.enable) return null;

    // 机体生命值减小
    this.health -= damageNum;
    const dead = this.health <= 0;
    if (dead && this.planeBody) {
      // 机体死亡
      this.planeBody.enable = false;
      this.bodyDead();
      // 机体死亡后 需要执行销毁
    }

    return this.score;
  }

  // 在渲染之前需要的操作，更新坐标 检测是否有必要在当前帧渲染...
   beforeRender(){};

  // 销毁整个作战单元的回调
   removeUnit(){};

  // 机体被子弹击中后的死亡事件
   bodyDead(){};
}
