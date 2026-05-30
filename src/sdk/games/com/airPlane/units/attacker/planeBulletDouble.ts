import type { IMiniActParams, IMiniGam } from '../../../../../type';
import { Matrix3 } from '../../../../../utils/Matrix3';
import { type IMiniPlaneMainParams } from '../../type';
import { EasedMove } from '../../../../../utils/Animate';
import { SHIELD_FRAME_NUM } from '../../config';
import { MiniUtils } from '../../../../../utils/MiniUtils';
import planeAttackerSvg from '@/assets/game/plane/attacker_bg.svg';

export class PlaneBulletDouble implements IMiniGam {
  planeWidth: number = 0;
  planeHeight: number = 0;
  attackerX: number = 0;
  attackerY: number = 0;
  cx: number = 0;
  cy: number = 0;

  matrix: Matrix3 = new Matrix3();

  // 离屏canvas todo:后续由外部统一管理
  offScreenCanvas: HTMLCanvasElement | null = null;
  enable: boolean = false;

  // 护盾总时间
  time: number = 20000;
  // 护盾开始的时间
  curTime: number = 0;
  // 护盾开始闪烁的时间
  blinkTime: number = 16000;
  // 护盾闪烁的帧数
  blinkFrame: number = SHIELD_FRAME_NUM;
  // 护盾闪烁的帧数计数
  blinkFrameCount: number = 0;

  move: EasedMove | null = null;

  tick: number = 20;

  constructor(params: IMiniPlaneMainParams) {
    const playerX = params.x;
    const playerY = params.y;
    this.planeWidth = params.w;
    this.planeHeight = params.h;
    this.updatePos(playerX, playerY);
  }

  updatePos(x: number, y: number) {
    this.attackerX = x;
    this.attackerY = y;
    this.cx = x + this.planeWidth / 2;
    this.cy = y + this.planeHeight / 2;
    this.matrix.makeTranslation(this.attackerX, this.attackerY);
  }

  updatePosX(x: number) {
    if(!this.enable)return
    this.attackerX = x;
    this.cx = this.attackerX + this.planeWidth / 2;
    this.matrix.makeTranslation(this.attackerX, this.attackerY);
  }

  startAni(x:number) {
    if (this.enable) return;
    this.enable = true;
    this.updatePosX(x)
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.enable) return;
    ctx.save();
    ctx.translate(this.matrix.elements[6], this.matrix.elements[7]);
    this.ani(ctx);
    ctx.restore();
  }

  ani(ctx: CanvasRenderingContext2D) {
    const { planeWidth, planeHeight } = this;
    const img = MiniUtils.getImage(planeAttackerSvg);

    if (img) {
      const imgHeight = img.height;
      const imgWidth = img.width;
      const dHeight = planeHeight / 2;
      const sHeight = imgHeight / 2;

      if (!this.move) {
        this.move = new EasedMove(
          { x: imgHeight / 2, y: 0 },
          { x: 0, y: -planeHeight },
          this.tick,
          'linear'
        );
      }

      this.move.update();
      this.tick--;

      const { x, y } = this.move.getCurrentPosition();

      ctx.drawImage(
        img,
        0,
        x,
        imgWidth,
        sHeight,
        -planeWidth / 2,
        y,
        planeWidth,
        dHeight
      );

      if (this.tick < 0) {
        this.tick = 20;
        this.move = null;
        this.enable = false;
      }
    }
  }

  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = () => {};
}
