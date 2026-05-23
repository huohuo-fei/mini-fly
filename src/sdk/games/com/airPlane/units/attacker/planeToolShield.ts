import type { IMiniActParams, IMiniGam } from '../../../../../type';
import { type IMiniPlaneMainParams } from '../../type';

export class PlaneShield implements IMiniGam {
  planeWidth: number = 0;
  planeHeight: number = 0;
  attackerX: number = 0;
  attackerY: number = 0;
  cx: number = 0;
  cy: number = 0;

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
  }

  updatePosX(x: number) {
    this.attackerX = x;
    this.cx = this.attackerX + this.planeWidth / 2;
  }

  changeState(state: boolean) {

    if(this.enable)return
    this.enable = state;
    setTimeout(() => {
      this.enable = false;
    }, this.time);
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.enable) return;

    const { planeWidth, cx, cy } = this;
    if (!this.offScreenCanvas) {
      this.offScreenCanvas = document.createElement('canvas');
    }
    this.offScreenCanvas.width = planeWidth * 2;
    this.offScreenCanvas.height = planeWidth;
    const offScreenCtx = this.offScreenCanvas.getContext('2d');
    if (!offScreenCtx) return;
    offScreenCtx.clearRect(0, 0, planeWidth * 2, planeWidth);

    // 做一个线性渐变，从内到外，颜色从透明到不透明
    const gradient = ctx.createLinearGradient(0, 0, planeWidth * 2, 0);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    // 绘制护盾主体
    offScreenCtx.beginPath();
    offScreenCtx.fillStyle = gradient;
    offScreenCtx.fillRect(0, 0, planeWidth * 2, planeWidth);
    offScreenCtx.fill();

    offScreenCtx.globalCompositeOperation = 'source-in';
    offScreenCtx.beginPath();
    offScreenCtx.moveTo(planeWidth, planeWidth);
    offScreenCtx.arc(planeWidth, planeWidth, planeWidth, Math.PI, 2 * Math.PI);
    offScreenCtx.closePath();
    const outerGlowGrad = offScreenCtx.createRadialGradient(
      planeWidth,
      planeWidth,
      planeWidth - 10,
      planeWidth,
      planeWidth,
      planeWidth
    );
    outerGlowGrad.addColorStop(0, 'rgba(0, 180, 240, 0)');
    outerGlowGrad.addColorStop(0.8, 'rgba(0, 200, 255, 0.35)');
    outerGlowGrad.addColorStop(1, 'rgba(0, 210, 255, 0.92)');
    offScreenCtx.fillStyle = outerGlowGrad;
    offScreenCtx.fill();
    ctx.drawImage(this.offScreenCanvas, cx - planeWidth, cy - planeWidth);
  }

  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = (p: IMiniActParams) => {
    const { x } = p;
    this.updatePosX(x);
  };
}
