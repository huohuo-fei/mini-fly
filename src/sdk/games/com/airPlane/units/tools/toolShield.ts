import type { IMiniActParams } from '../../../../../type';
import { EasedMove } from '../../../../../utils/Animate';
import { SHIELD_FRAME_NUM } from '../../config';
import { PlaneToolBase } from '../../base/planeToolBase';
import type { ToolShieldConfig } from './type';
import type { PlaneUnit } from '../../base/planeUnit';

export class ToolPlaneShield extends PlaneToolBase {
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

  constructor(params: ToolShieldConfig, mainUnit: PlaneUnit) {
    super();
    this.mainUnit = mainUnit;
    const playerX = params.x;
    const playerY = params.y;
    this.mainWidth = params.w;
    this.mainHeight = params.h;
    this.updatePos(playerX, playerY);
    this.initTool();
  }

  initTool() {
    this.enable = true;
    this.curTime = Date.now();
    setTimeout(() => {
      this.enable = false;
      this.move = null;
      this.destroyTool()
    }, this.time);
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.enable) return;
    if (this.aniBlink()) return;

    const { mainWidth } = this;
    const shieldRadius = mainWidth;
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
    offScreenCtx.arc(
      shieldRadius,
      shieldRadius,
      shieldRadius,
      Math.PI,
      2 * Math.PI
    );
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
    this.aniStart(ctx);
    ctx.drawImage(this.offScreenCanvas, -shieldRadius, -shieldRadius);
    ctx.restore();
  }

  aniStart(ctx: CanvasRenderingContext2D) {
    if (!this.move) {
      this.move = new EasedMove({ x: 0, y: 0 }, { x: 1, y: 1 }, 16, 'linear');
    }

    this.move.update();
    const { x, y } = this.move.getCurrentPosition();
    ctx.scale(x, y);
  }

  aniBlink(): boolean {
    const { blinkFrame, blinkFrameCount, curTime, blinkTime } = this;
    // 是否开启闪烁
    if (Date.now() - curTime < blinkTime) return false;

    // 闪烁记时
    if (blinkFrameCount >= blinkFrame) {
      // 临时隐藏护盾
      if (blinkFrame > 0) {
        this.blinkFrame--;
        return true;
      }

      // 护盾闪烁结束，恢复显示
      this.blinkFrame = SHIELD_FRAME_NUM;
      this.blinkFrameCount = 0;
      return true;
    }
    this.blinkFrameCount += 1;
    return false;
  }

  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = (p: IMiniActParams) => {
    const { x } = p;
    this.updatePosX(x);
  };

  destroyTool() {
    if(this.mainUnit){
      this.mainUnit.removeTool(this);
    }
  }
}
