import { Vector2 } from '../../../../../../utils/Matrix3';
import type { PlaneEnemy } from '../planeEnemy';
import { EasedMove } from '../../../../../../utils/Animate';
import {
  IMiniPlaneEffectType,
  type IBigEnemyConfig,
  EnemyType,
} from '../../../type';
import { PlaneUnit } from '../../../base/planeUnit';
import {
  PlaneBulletType,
  type PlaneBulletParams,
  type PlaneUnitParams,
  type HitInfo,
  BulletCamp,
} from '../../../base/type';
import { BigBody } from './bigBody';
import { planeBigBullet } from '../../../config';
import type { PlaneBullet } from '../../../base/planeBullet';
import { PlaneMissile } from '../../../base/planeMissile';
import { MiniFlyState } from '../../../state/flyState';
import { MINI_GAME_OVER, MiniScreen } from '../../../../../..';

export class BigEnemyUnit extends PlaneUnit {
  type: EnemyType = EnemyType.BIG;
  config: IBigEnemyConfig;
  move: EasedMove | null = null;
  angle: number = 0;
  rotateBullet: boolean = false;
  planeEnemy: PlaneEnemy;

  missileList: PlaneMissile[] = [];
  missileHeight: number = 200;
  missileStep: number = 0.003;

  // 子弹生成逻辑
  bulletLastTime: number = 0;
  bulletConfig: PlaneBulletParams = planeBigBullet;

  constructor(
    params: PlaneUnitParams,
    config: IBigEnemyConfig,
    planeEnemy: PlaneEnemy,
  ) {
    super(params);
    this.config = JSON.parse(JSON.stringify(config)) as IBigEnemyConfig;
    this.planeEnemy = planeEnemy;
    this.unitHeight = this.config.radius * 2;
    this.unitWidth = this.config.radius * 2;
    this.planeBody = new BigBody({
      bodyWidth: this.config.radius,
      bodyHeight: this.config.radius,
      bodyX: this.config.x,
      bodyY: this.unitY,
      speedX: this.speedX,
      speedY: this.speedY,
    });

    this.updatePos(this.config.x, this.unitY);
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
    const size = 4;

    if (deltaTime >= this.config.shootCooldown) {
      const bulletParams = JSON.parse(
        JSON.stringify(this.bulletConfig)
      ) as PlaneBulletParams;
      this.bulletLastTime = time;
      bulletParams.bulletX = this.unitX;
      bulletParams.bulletY = this.unitY;
      const angle = this.angle;

      for (let i = 0; i < size; i++) {
        const vx = Math.cos(angle + (Math.PI / 2) * i);
        const vy = Math.sin(angle + (Math.PI / 2) * i);
        bulletParams.direction = [vx, vy];
        this.planeEnemy.miniFly.planeBullets.addBulletByParams(
          PlaneBulletType.Normal,
          BulletCamp.Enemy,
          bulletParams
        );
      }
    }
  }

  buildMissile(p1: Vector2, p2: Vector2) {
    if (this.missileList.length) return;
    let checkHeight = this.missileHeight;
    if (p1.x < this.missileHeight) {
      checkHeight *= -1;
    }
    const missile = new PlaneMissile(
      p1,
      p2,
      checkHeight,
      this.missileStep,
      (dotPos: Vector2) => {
        // 需要申请一个爆炸特效
        this.planeEnemy.requestEffect(
          IMiniPlaneEffectType.EXPLODE,
          dotPos.x,
          dotPos.y
        );
        this.missileList = [];

        // 销毁当前实例
        this.planeEnemy.removeBigEnemy(this);
        this.missileHitPlane(dotPos.x, dotPos.y, 20);
      }
    );
    this.missileList.push(missile);
  }

  beforeRender(): void {
    this.aniMove();
    if (this.rotateBullet && this.planeBody?.enable) {
      this.createBullet();
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    super.render(ctx);
    for (const missile of this.missileList) {
      missile.render(ctx);
    }
  }

  aniMove() {
    const { x: startX, targetHeight, angleSpeed } = this.config;
    if (!this.move) {
      this.move = new EasedMove(
        { x: startX, y: 0 },
        { x: startX, y: targetHeight },
        100
      );
    }
    const moveUpdate = this.move.update();

    // tip:这里在动画结束之后依然需要调用
    // 是由于 下面的旋转矩阵是全量旋转，每次都需要一个新的位移矩阵，所以需要每次都更新
    const { x, y } = this.move.getCurrentPosition();
    this.updatePos(x, y);

    if (!moveUpdate && this.planeBody?.enable) {
      this.rotateBullet = true;
      this.matrix.rotate(this.angle);
      this.angle += angleSpeed;
      this.angle = this.angle % (Math.PI * 2);
    }
  }

  isHitUnit(bullet: PlaneBullet): HitInfo | null {
    if (!this.planeBody?.enable) return null;

    const { bulletWidth, bulletX, bulletY, combat } = bullet.params;
    const { unitX, unitY } = this;
    const v1 = new Vector2(unitX, unitY);
    const v2 = new Vector2(bulletX, bulletY);
    const dis = v1.sub(v2).length();
    if (dis <= this.config.radius + bulletWidth / 2) {
      this.health -= combat;
      const dead = this.health <= 0;

      // 击中后需要判断是否死亡
      if (dead) {
        const attackerPos = this.planeEnemy.getPlanePos();
        this.buildMissile(
          new Vector2(this.unitX, this.unitY),
          new Vector2(attackerPos.x, attackerPos.y)
        );

        this.planeBody.enable = false;
      }
      return {
        x: unitX,
        y: unitY,
        score: this.score,
        dead,
      };
    }

    return null;
  }

  damageWithScore(damageNum: number) {
    // return
    // 如果机体已经消亡
    if (!this.planeBody?.enable) return null;

    // 机体生命值减小
    this.health -= damageNum;
    const dead = this.health <= 0;
    if (dead) {
      const attackerPos = this.planeEnemy.getPlanePos();
      this.buildMissile(
        new Vector2(this.unitX, this.unitY),
        new Vector2(attackerPos.x, attackerPos.y)
      );

      this.planeBody.enable = false;
    }

    return this.score;
  }

  // 导弹是否命中战机
  missileHitPlane(x: number, y: number, r: number) {
    const planePos = this.planeEnemy.getPlanePos();
    // this.attackerX = planePos.x;
    // this.attackerY = planePos.y;

    const vec1 = new Vector2(planePos.x, planePos.y);
    const vec2 = new Vector2(x, y);
    const dis = vec1.sub(vec2).length();

    if (dis > r) {
      // 距离大于爆炸半径 没有影响
    } else {
      this.planeEnemy.screen.emit(MINI_GAME_OVER, {
        score:MiniFlyState.score,
        time: MiniFlyState.duration,
        des:'游戏结束'
      });
    }
  }
}
