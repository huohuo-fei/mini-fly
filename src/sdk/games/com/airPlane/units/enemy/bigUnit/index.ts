import { Vector2 } from '../../../../../../utils/Matrix3';
import type { PlaneEnemy } from '../planeEnemy';
import { EasedMove } from '../../../../../../utils/Animate';
import { IMiniPlaneEffectType, type IBigEnemyConfig, EnemyType } from '../../../type';
import { PlaneUnit } from '../../../base/planeUnit';
import {
  PlaneBulletType,
  type PlaneBulletParams,
  type PlaneUnitParams,
  type HitInfo,
} from '../../../base/type';
import { BigBody } from './bigBody';
import { planeBigBullet } from '../../../config';
import { BigBullet } from './bigBullet';
import type { PlaneBullet } from '../../../base/planeBullet';
import { PlaneMissile } from '../../../base/planeMissile';

export class BigEnemyUnit extends PlaneUnit {
  type:EnemyType = EnemyType.BIG
  config: IBigEnemyConfig;
  move: EasedMove | null = null;
  angle: number = 0;
  rotateBullet: boolean = false;
  planeEnemy: PlaneEnemy;

  missileList: PlaneMissile[] = [];
  missileHeight: number = 200;
  missileStep: number = 0.003;

  constructor(
    params: PlaneUnitParams,
    config: IBigEnemyConfig,
    planeEnemy: PlaneEnemy
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

  buildBullet() {
    if (this.rotateBullet) return;
    this.rotateBullet = true;
    const { unitX, unitY } = this;
    const bulletParams = JSON.parse(
      JSON.stringify(planeBigBullet)
    ) as PlaneBulletParams;
    bulletParams.bulletX = unitX;
    bulletParams.bulletY = unitY;
    bulletParams.type = PlaneBulletType.Spiral;
    // 四个方向
    for (let i = 0; i < 4; i++) {
      const bullet = new BigBullet(PlaneBulletType.Spiral, bulletParams, this);
      this.bulletBoxList.push(bullet);
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
        // this.destroy()
        this.planeEnemy.removeBigEnemy(this);
      }
    );
    this.missileList.push(missile);
  }

  render(ctx: CanvasRenderingContext2D) {
    this.aniMove();

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
    const { x, y } = this.move.getCurrentPosition();
    this.updatePos(x, y);

    if (!moveUpdate && this.planeBody?.enable) {
      this.buildBullet();
      this.matrix.rotate(this.angle);
      this.angle += angleSpeed;
      this.angle = this.angle % (Math.PI * 2);

      for (let i = 0; i < this.bulletBoxList.length; i++) {
        const bullet = this.bulletBoxList[i];
        bullet.updateAngle(this.angle + (Math.PI / 2) * i);
      }
    }
  }

  isHitUnit(bullet: PlaneBullet): HitInfo | null {

    if(!this.planeBody?.enable || this.bulletBoxList.length === 0)return null

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

        for(const bullet of this.bulletBoxList){
          bullet.stopBullet()
        }
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

  removeUnit(): void {
    // this.planeEnemy.removeBigEnemy(this);
  }

  damageWithScore(damageNum: number) {
    // return
    // 如果机体已经消亡  todo:处理子弹
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

      this.planeBody.enable = false
      for(const bullet of this.bulletBoxList){
        bullet.stopBullet()
      }
    }

    return this.score
  }
}
