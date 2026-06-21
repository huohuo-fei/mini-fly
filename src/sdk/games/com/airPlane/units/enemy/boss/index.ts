import { EasedMove } from '../../../../../../utils/Animate';
import {
  type IBossConfig,
} from '../../../type';
import {
  planeBossDotBullet,
} from '../../../config';
import { PlaneUnit } from '../../../base/planeUnit';
import {
  PlaneBulletType,
  type PlaneBulletParams,
  type PlaneUnitParams,
} from '../../../base/type';
import { BossBody } from './bossBody';
import { BossBullet } from './bossBullet';


export class EnemyBoss extends PlaneUnit {
  config: IBossConfig;
  move: EasedMove | null = null;

  // 螺旋子弹配置
  rotateTimer: number | null = null;
  rotateTimeout: number = 100;
  angle: number = 0;
  angleSpeed: number = 0.042;
  bulletSpeed: number = 1;

  // 编队子弹配置  todo:抽取编队 可以使之任意嵌套
  constructor(params: PlaneUnitParams, config: IBossConfig) {
    super(params);
    this.config = JSON.parse(JSON.stringify(config)) as IBossConfig;

    this.planeBody = new BossBody({
      bodyWidth: this.unitWidth,
      bodyHeight: this.unitHeight,
      bodyX: this.unitX,
      bodyY: this.unitY,
      speedX: this.speedX,
      speedY: this.speedY,
    });

    this.updatePos(this.unitX, this.unitY);
  }

  updatePos(x: number, y: number) {
    this.unitX = x;
    this.unitY = y;
    this.matrix.makeTranslation(x, y);
  }

  buildDotBullet() {
    if (this.bulletBoxList.length) return;
    const bulletParams = JSON.parse(
      JSON.stringify(planeBossDotBullet)
    ) as PlaneBulletParams;

    const disHalf = 10;

    // 竖直两列
    bulletParams.bulletX = this.unitX - disHalf;
    bulletParams.bulletY = this.unitY;
    const bullet1 = new BossBullet(PlaneBulletType.Normal, bulletParams, this);

    bulletParams.bulletX = this.unitX + disHalf;
    bulletParams.bulletY = this.unitY;
    const bullet2 = new BossBullet(PlaneBulletType.Normal, bulletParams, this);
    this.bulletBoxList.push(bullet1, bullet2);

    // 斜着两列
    const angle1 = Math.PI / 3;
    const x1 = Math.cos(angle1);
    const y1 = Math.sin(angle1);
    const p1x = disHalf * Math.sin(Math.PI - angle1);
    const p1y = disHalf * Math.cos(Math.PI - angle1);

    bulletParams.bulletX = this.unitX + p1x;
    bulletParams.bulletY = this.unitY + p1y;
    bulletParams.direction = [x1, y1];
    const bullet3 = new BossBullet(PlaneBulletType.Normal, bulletParams, this);

    bulletParams.bulletX = this.unitX - 2 * p1x;
    bulletParams.bulletY = this.unitY - p1y;

    const bullet4 = new BossBullet(PlaneBulletType.Normal, bulletParams, this);
    this.bulletBoxList.push(bullet3, bullet4);

    const angle2 = Math.PI - angle1;
    const x2 = Math.cos(angle2);
    const y2 = Math.sin(angle2);

    bulletParams.bulletX = this.unitX + 2 * p1x;
    bulletParams.bulletY = this.unitY - p1y;
    bulletParams.direction = [x2, y2];
    const bullet5 = new BossBullet(PlaneBulletType.Normal, bulletParams, this);

    bulletParams.bulletX = this.unitX - p1x;
    bulletParams.bulletY = this.unitY + p1y;
    const bullet6 = new BossBullet(PlaneBulletType.Normal, bulletParams, this);
    this.bulletBoxList.push(bullet5, bullet6);
  }

  buildRotateBullet() {
    if (this.rotateTimer) return;
    this.rotateTimer = 1;
    const { unitX, unitY } = this;

    const bulletParams = JSON.parse(
      JSON.stringify(planeBossDotBullet)
    ) as PlaneBulletParams;
    bulletParams.bulletX = unitX;
    bulletParams.bulletY = unitY;
    bulletParams.type = PlaneBulletType.Spiral;
    bulletParams.shootCooldown = 100
    const bullet = new BossBullet(PlaneBulletType.Spiral, bulletParams, this);

    this.bulletBoxList.push(bullet);
  }

  render(ctx: CanvasRenderingContext2D) {
    const { unitX } = this;
    const { frame, targetHeight } = this.config;
    if (!this.move) {
      this.move = new EasedMove(
        { x: unitX, y: 0 },
        { x: unitX, y: targetHeight },
        frame
      );
    }
    const moveUpdateIng = this.move.update();

    if (!moveUpdateIng) {
      // this.buildDotBullet();
      this.buildRotateBullet();
    }
    const { x, y } = this.move.getCurrentPosition();
    this.matrix.makeTranslation(x, y);
    this.updatePos(x, y);
    this.angle += this.angleSpeed;
    this.angle = this.angle % (Math.PI * 2);

    // for(let i = 0; i < this.bossBulletDotList.length; i++){
    //   const bullet = this.bossBulletDotList[i]
    //   bullet.updatePos(x, y);
    //   bullet.render(ctx);
    // }
    // this.bullet?.updatePos(x, y);
    super.render(ctx);
  }
}
