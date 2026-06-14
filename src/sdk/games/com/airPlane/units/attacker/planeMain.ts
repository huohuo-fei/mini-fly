import type { IMiniActParams, IMiniGam } from '../../../../../type';
import { type IMiniPlaneMainParams } from '../../type';
import { Matrix3 } from '../../../../../utils/Matrix3';
import { MiniUtils } from '../../../../../utils/MiniUtils';
import planeAttackerSvg from '@/assets/game/plane/attacker_bg.svg';
import { PlaneUnit } from '../../base/planeUnit';
import { PlaneBulletType, type PlaneBulletParams, type PlaneUnitParams } from '../../base/type';
import { PlaneMainBody } from './planeMainBody';
import { PlaneMainBullet } from './planeMainBullet';
import { planeMainBulletConfig } from '../../config';

export class PlaneMain2 implements IMiniGam {
  planeWidth: number = 0;
  planeHeight: number = 0;

  planeParams: IMiniPlaneMainParams;

  shootCooldown: number = 0;
  attackerX: number = 0;
  attackerY: number = 0;
  matrix: Matrix3 = new Matrix3();

  constructor(params: IMiniPlaneMainParams) {
    this.planeParams = JSON.parse(
      JSON.stringify(params)
    ) as IMiniPlaneMainParams;
    this.planeWidth = params.w;
    this.planeHeight = params.h;
    this.shootCooldown = params.shootCooldown;
    this.attackerX = params.x;
    this.attackerY = params.y;
    this.updatePosX(this.attackerX);
  }

  updatePosX(x: number) {
    // 更新玩家位置 (平滑跟随鼠标/手指)
    this.attackerX = x;
    this.matrix.makeTranslation(this.attackerX, this.attackerY);
  }

  render(ctx: CanvasRenderingContext2D) {
    const { planeWidth, planeHeight } = this;
    ctx.save();
    ctx.translate(this.matrix.elements[6], this.matrix.elements[7]);
    // this.test(ctx, this.attackerX, this.attackerY);
    // 先绘制飞机的外形框
    ctx.strokeStyle = 'red';
    ctx.strokeRect(-planeWidth / 2, -planeHeight / 2, planeWidth, planeHeight);
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#0af';
    ctx.fillStyle = '#7df9ff';
    ctx.beginPath();

    // 绘制一个梭形
    const offsetX = 3;
    const offsetY = 6;
    ctx.moveTo(-planeWidth / 2 + offsetX, offsetY);
    ctx.lineTo(0, -planeHeight / 2);
    ctx.lineTo(planeWidth / 2 - offsetX, offsetY);
    ctx.lineTo(0, planeHeight / 2);
    ctx.fill();
    ctx.fillStyle = '#ffd966';
    ctx.beginPath();
    ctx.rect(-5, -5, 10, 10);
    ctx.fill();
    ctx.restore();
  }

  test(ctx: CanvasRenderingContext2D, x: number, y: number) {
    // setTimeout(() => {
    const { planeWidth, planeHeight } = this;
    const img = MiniUtils.getImage(planeAttackerSvg);
    if (img) {
      ctx.drawImage(
        img,
        -planeWidth / 2,
        -planeHeight / 2,
        planeWidth,
        planeHeight
      );
    }
    // },100);
  }

  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = (p: IMiniActParams) => {
    const { x } = p;
    this.updatePosX(x);
  };
}

export class PlaneMain extends PlaneUnit {
  constructor(params: PlaneUnitParams) {
    super(params);
    this.updatePosX(this.unitX);
    this.planeBody = new PlaneMainBody({
      bodyWidth: this.unitWidth,
      bodyHeight: this.unitHeight,
      bodyX: this.unitX,
      bodyY: this.unitY,
      speedX: this.speedX,
      speedY: this.speedY,
    });

    const bulletParams = JSON.parse(JSON.stringify(planeMainBulletConfig)) as PlaneBulletParams

    bulletParams.bulletX = this.unitX;
    bulletParams.bulletY = this.unitY;
    const bullet = new PlaneMainBullet(PlaneBulletType.Normal,bulletParams,this);
    this.bulletBoxList.push(bullet);

  }

  updatePosX(x: number) {
    // 更新玩家位置 (平滑跟随鼠标/手指)
    this.unitX = x;
    this.matrix.makeTranslation(this.unitX, this.unitY);
    for(const bullet of this.bulletBoxList){
      bullet.updatePosX(this.unitX);
    }
  }

  actionDoing = (p: IMiniActParams) => {
    const { x } = p;
    this.updatePosX(x);
  };
}
