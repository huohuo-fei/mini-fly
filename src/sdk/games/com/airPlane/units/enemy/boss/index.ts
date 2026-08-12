import { EasedMove } from '../../../../../../utils/Animate';
import { EnemyType, type IBossConfig } from '../../../type';
import { planeBossDotBullet } from '../../../config';
import { PlaneUnit } from '../../../base/planeUnit';
import {
  PlaneBulletType,
  type PlaneBulletParams,
  type PlaneUnitParams,
  type HitInfo,
  BulletCamp,
} from '../../../base/type';
import { BossBody } from './bossBody';
import type { PlaneBullet } from '../../../base/planeBullet';
import { MiniFlyState } from '../../../state/flyState';
import type { PlaneEnemy } from '../planeEnemy';

export class EnemyBoss extends PlaneUnit {
  type: EnemyType = EnemyType.BOSS;
  planeEnemy: PlaneEnemy;

  config: IBossConfig;
  move: EasedMove | null = null;

  // 螺旋子弹配置
  rotateTimer: number | null = null;
  rotateTimeout: number = 100;
  angle: number = 0;
  angleSpeed: number = 0.042;
  bulletSpeed: number = 1;

  // 子弹生成逻辑
  bulletLastTime: number = 0;
  bulletConfig: PlaneBulletParams = planeBossDotBullet;

  // boss 撤退逻辑
  retreat: boolean = false;

  constructor(
    params: PlaneUnitParams,
    config: IBossConfig,
    planeEnemy: PlaneEnemy
  ) {
    super(params);
    this.config = JSON.parse(JSON.stringify(config)) as IBossConfig;
    this.planeEnemy = planeEnemy;
    this.planeBody = new BossBody(
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

    this.updatePos(this.unitX, this.unitY);
  }

  updatePos(x: number, y: number) {
    this.unitX = x;
    this.unitY = y;
    this.matrix.makeTranslation(x, y);
  }

  createBullet() {
    // 获取游戏时间
    const time = MiniFlyState.duration;
    const deltaTime = time - this.bulletLastTime;

    if (deltaTime >= this.bulletConfig.shootCooldown) {
      const bulletParams = JSON.parse(
        JSON.stringify(planeBossDotBullet)
      ) as PlaneBulletParams;
      this.bulletLastTime = time;
      const disHalf = 10;
      // 竖直两列
      bulletParams.bulletX = this.unitX - disHalf;
      bulletParams.bulletY = this.unitY;
      this.planeEnemy.miniFly.planeBullets.addBulletByParams(
        PlaneBulletType.Normal,
        BulletCamp.Enemy,
        bulletParams
      );

      bulletParams.bulletX = this.unitX + disHalf;
      bulletParams.bulletY = this.unitY;
      this.planeEnemy.miniFly.planeBullets.addBulletByParams(
        PlaneBulletType.Normal,
        BulletCamp.Enemy,
        bulletParams
      );

      // 斜着两列
      const angle1 = Math.PI / 3;
      const x1 = Math.cos(angle1);
      const y1 = Math.sin(angle1);
      const p1x = disHalf * Math.sin(Math.PI - angle1);
      const p1y = disHalf * Math.cos(Math.PI - angle1);

      bulletParams.bulletX = this.unitX + p1x;
      bulletParams.bulletY = this.unitY + p1y;
      bulletParams.direction = [x1, y1];
      this.planeEnemy.miniFly.planeBullets.addBulletByParams(
        PlaneBulletType.Normal,
        BulletCamp.Enemy,
        bulletParams
      );
      bulletParams.bulletX = this.unitX - 2 * p1x;
      bulletParams.bulletY = this.unitY - p1y;
      this.planeEnemy.miniFly.planeBullets.addBulletByParams(
        PlaneBulletType.Normal,
        BulletCamp.Enemy,
        bulletParams
      );

      const angle2 = Math.PI - angle1;
      const x2 = Math.cos(angle2);
      const y2 = Math.sin(angle2);

      bulletParams.bulletX = this.unitX + 2 * p1x;
      bulletParams.bulletY = this.unitY - p1y;
      bulletParams.direction = [x2, y2];
      this.planeEnemy.miniFly.planeBullets.addBulletByParams(
        PlaneBulletType.Normal,
        BulletCamp.Enemy,
        bulletParams
      );

      bulletParams.bulletX = this.unitX - p1x;
      bulletParams.bulletY = this.unitY + p1y;
      this.planeEnemy.miniFly.planeBullets.addBulletByParams(
        PlaneBulletType.Normal,
        BulletCamp.Enemy,
        bulletParams
      );
    }
  }

  beforeRender(): void {
    if (this.retreat) {
      this.retreatRender();
    } else {
      this.enterRender();
    }
    if (this.move) {
      const { x, y } = this.move.getCurrentPosition();
      this.matrix.makeTranslation(x, y);
      this.updatePos(x, y);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    super.render(ctx);
  }

  isHitUnit(bullet: PlaneBullet): HitInfo | null {
    // 撤退 不检测碰撞
    if(this.retreat) return null;
    return super.isHitUnit(bullet);
  }

  removeUnit() {
    this.planeEnemy.removeBoss(this);
    this.planeEnemy.removeEnemyAfterBossDead();
  }

  // 撤退
  bossRetreat() {
    this.retreat = true;
    this.move = null;
    console.log('开始撤退');
  }

  retreatRender() {
    const { unitX, unitHeight } = this;
    const { frame, targetHeight } = this.config;
    if (!this.move) {
      this.move = new EasedMove(
        { x: unitX, y: targetHeight },
        { x: unitX, y: 0 - unitHeight },
        frame
      );
    }
    const moveUpdateIng = this.move.update();
    if (!moveUpdateIng) {
      // this.createBullet();
      // console.log('撤退结束');
      this.planeEnemy.gameOver()
    }
  }

  enterRender() {
    const { unitX, unitHeight } = this;
    const { frame, targetHeight } = this.config;
    if (!this.move) {
      this.move = new EasedMove(
        { x: unitX, y: 0 - unitHeight },
        { x: unitX, y: targetHeight },
        frame
      );
    }
    const moveUpdateIng = this.move.update();

    if (!moveUpdateIng) {
      this.createBullet();
    }
  }
}
