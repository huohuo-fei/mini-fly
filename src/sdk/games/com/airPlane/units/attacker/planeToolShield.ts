import type { IMiniActParams, IMiniGam } from '../../../../../type';
import { Matrix3 } from '../../../../../utils/Matrix3';
import { type IMiniPlaneMainParams } from '../../type';

export class PlaneShield implements IMiniGam {
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
  time: number = 10000;

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
    this.attackerX = x;
    this.cx = this.attackerX + this.planeWidth / 2;
    this.matrix.makeTranslation(this.attackerX, this.attackerY);
  }

  changeState(state: boolean) {
    if (this.enable) return;
    this.enable = state;
    setTimeout(() => {
      this.enable = false;
    }, this.time);
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.enable) return;

    const { planeWidth } = this;
    const shieldRadius = planeWidth;
    if (!this.offScreenCanvas) {
      this.offScreenCanvas = document.createElement('canvas');
    }
    this.offScreenCanvas.width = shieldRadius * 2;
    this.offScreenCanvas.height = shieldRadius;
    const offScreenCtx = this.offScreenCanvas.getContext('2d');
    if (!offScreenCtx) return;
    offScreenCtx.clearRect(0, 0, shieldRadius * 2, shieldRadius);

    // 做一个线性渐变，从内到外，颜色从透明到不透明
    const gradient = ctx.createLinearGradient(0, 0, shieldRadius * 2, 0);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    // 绘制护盾主体
    offScreenCtx.beginPath();
    offScreenCtx.fillStyle = gradient;
    offScreenCtx.fillRect(0, 0, shieldRadius * 2, shieldRadius);
    offScreenCtx.fill();

    offScreenCtx.globalCompositeOperation = 'source-in';
    offScreenCtx.beginPath();
    offScreenCtx.moveTo(shieldRadius, shieldRadius);
    offScreenCtx.arc(shieldRadius, shieldRadius, shieldRadius, Math.PI, 2 * Math.PI);
    offScreenCtx.closePath();
    const outerGlowGrad = offScreenCtx.createRadialGradient(
      shieldRadius,
      shieldRadius,
      shieldRadius - 10,
      shieldRadius,
      shieldRadius,
      shieldRadius
    );
    outerGlowGrad.addColorStop(0, 'rgba(0, 180, 240, 0)');
    outerGlowGrad.addColorStop(0.8, 'rgba(0, 200, 255, 0.35)');
    outerGlowGrad.addColorStop(1, 'rgba(0, 210, 255, 0.92)');
    offScreenCtx.fillStyle = outerGlowGrad;
    offScreenCtx.fill();

    ctx.save();
    ctx.translate(this.matrix.elements[6], this.matrix.elements[7]);
    ctx.drawImage(this.offScreenCanvas, -shieldRadius,-shieldRadius);
    ctx.restore();
  }

  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = (p: IMiniActParams) => {
    const { x } = p;
    this.updatePosX(x);
  };
}
