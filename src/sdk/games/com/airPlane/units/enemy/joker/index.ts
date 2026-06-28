import { PlaneUnit } from '../../../base/planeUnit';
import {
  PlaneBulletType,
  type PlaneBulletParams,
  type PlaneUnitParams,
  type HitInfo,
} from '../../../base/type';
import {
  MiniPlaneEnemyType,
  type IMiniPlaneEnemy,
  EnemyType,
} from '../../../type';
import { JokerBody } from './jokerBody';
import {
  enemyConfig2,
  enemyConfig1,
  enemyConfig3,
  planeBossDotBullet,
} from '../../../config';
import { JokerBullet } from './jokerBullet';
import type { PlaneBullet } from '../../../base/planeBullet';
import type { PlaneEnemy } from '../planeEnemy';

export class EnemyJoker extends PlaneUnit {
  config: IMiniPlaneEnemy;
  planeEnemy: PlaneEnemy;
  type: EnemyType = EnemyType.JOKER;
  constructor(
    params: PlaneUnitParams,
    type: MiniPlaneEnemyType,
    planeEnemy: PlaneEnemy
  ) {
    super(params);

    let config = null;
    if (type === MiniPlaneEnemyType.LEVEL1) {
      config = JSON.parse(JSON.stringify(enemyConfig1));
    } else if (type === MiniPlaneEnemyType.LEVEL2) {
      config = JSON.parse(JSON.stringify(enemyConfig2));
    } else if (type === MiniPlaneEnemyType.LEVEL3) {
      config = JSON.parse(JSON.stringify(enemyConfig3));
    }
    this.config = JSON.parse(JSON.stringify(config)) as IMiniPlaneEnemy
    this.planeEnemy = planeEnemy;
    this.updateParams();

    this.planeBody = new JokerBody(
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

    this.buildBullet();
  }

  buildBullet() {
    const bulletParams = JSON.parse(
      JSON.stringify(planeBossDotBullet)
    ) as PlaneBulletParams;

    bulletParams.shootCooldown = this.config.shootCooldown;

    // 竖直两列
    bulletParams.bulletX = this.unitX;
    bulletParams.bulletY = this.unitY;
    const bullet1 = new JokerBullet(PlaneBulletType.Normal, bulletParams, this);

    this.bulletBoxList.push(bullet1);
  }
  updateParams() {
    this.unitWidth = this.config.w;
    this.unitHeight = this.config.h;
    this.speedX = this.config.speedX;
    this.speedY = this.config.speedY;
    this.health = this.config.health;

    // 随机 X 轴位置  todo:后期优化
    const x = 20 + Math.random() * (this.canvasWidth - 50);
    this.unitX = x + this.config.w / 2;
    this.unitY = this.config.y + this.config.h / 2;
    this.matrix.makeTranslation(this.unitX, this.unitY);
  }

  updatePos() {
    this.unitY += this.speedY;
    this.matrix.translate(0, this.speedY);

    // 更新子弹位置
    this.bulletBoxList.forEach((bullet) => {
      bullet.updatePos(this.unitX, this.unitY);
    });
  }

  render(ctx: CanvasRenderingContext2D): void {
    super.render(ctx);
    this.updatePos();
  }

  isHitUnit(bullet: PlaneBullet): HitInfo | null {
    const res = super.isHitUnit(bullet);
    if (res && res.dead) {
      this.destroy();
    }
    return res;
  }

  destroy(): void {
    super.destroy()
    this.planeEnemy.removeJoker(this);
  }
}
