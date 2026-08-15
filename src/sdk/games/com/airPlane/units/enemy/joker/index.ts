import { PlaneUnit } from '../../../base/planeUnit';
import {
  PlaneBulletType,
  type PlaneBulletParams,
  type PlaneUnitParams,
  BulletCamp,
} from '../../../base/type';
import {
} from '../../../type';
import { JokerBody } from './jokerBody';

import type { PlaneEnemy } from '../planeEnemy';
import { MiniFlyState } from '../../../state/flyState';
import { EnemyType, MiniPlaneEnemyType, type IMiniPlaneEnemy } from '../type';
import { enemyConfig1, enemyConfig2, enemyConfig3, planeJokerDotBullet } from '../config';

export class EnemyJoker extends PlaneUnit {
  config: IMiniPlaneEnemy;
  planeEnemy: PlaneEnemy;
  type: EnemyType = EnemyType.JOKER;

  // 子弹生成逻辑
  bulletLastTime: number = 0;
  // joker 配置 没有做数据隔离
  bulletConfig: PlaneBulletParams = planeJokerDotBullet;
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
    this.config = JSON.parse(JSON.stringify(config)) as IMiniPlaneEnemy;

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
    this.bulletConfig.shootCooldown = this.config.shootCooldown;
  }

  updatePos(deltaTime:number) {
    const sp = this.speedY * deltaTime;
    this.unitY += sp;
    this.matrix.translate(0, sp);
  }

  beforeRender(): void {
    this.createBullet()
  }

  update(deltaTime: number): void {
    this.updatePos(deltaTime);
    
  }

  createBullet() {
    // 获取游戏时间
    const time = MiniFlyState.duration;
    const deltaTime = time - this.bulletLastTime;

    if (deltaTime >= this.config.shootCooldown) {
      const bulletParams = JSON.parse(
        JSON.stringify(this.bulletConfig)
      ) as PlaneBulletParams;
      this.bulletLastTime = time;
        bulletParams.bulletX = this.unitX;
        bulletParams.bulletY = this.unitY;
        this.planeEnemy.miniFly.planeBullets.addBulletByParams(
          PlaneBulletType.Normal,
          BulletCamp.Enemy,
          bulletParams
        );
    }
  }

  removeUnit() {
    this.planeEnemy.removeJoker(this);
  }

  bodyDead() {
    this.planeEnemy.generateTool(this);
  }
}
