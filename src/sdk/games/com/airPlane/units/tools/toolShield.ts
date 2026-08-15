import type { IMiniActParams } from '../../../../../type';
import { EasedMove } from '../../../../../utils/Animate';
import { PlaneToolBase } from '../../base/planeToolBase';
import { MiniPlaneToolType, type ToolShieldConfig } from './type';
import type { PlaneUnit } from '../../base/planeUnit';
import { MiniFlyState } from '../../state/flyState';
import { UPDATE_TIME } from '../../state/eventName';
import { SHIELD_FRAME_NUM } from './config';

export class ToolPlaneShield extends PlaneToolBase {
  // 离屏canvas todo:后续由外部统一管理
  offScreenCanvas: HTMLCanvasElement | null = null;
  enable: boolean = false;
  type: MiniPlaneToolType = MiniPlaneToolType.SHIELD;
  listenDurFn: Function = this.listenDur.bind(this);

  // 一次护盾显示的总时间
  totaltime: number = 20000; //20000;
  // 护盾开始闪烁的时间
  blinkTime: number = 15 * 1000;
  // 护盾闪烁的帧数
  blinkFrame: number = SHIELD_FRAME_NUM;
  // 护盾闪烁的帧数计数
  blinkFrameCount: number = 0;

  // 护盾处于闪烁状态的时间
  blinkDuration: number = 4000;
  // 生成护盾的时间标记
  createTime: number = 0;
  // 护盾在游戏内经过的时间
  continueTime: number = 0;
  // 护盾的闪烁状态
  blinkState: boolean = false;

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
    this.registerEvent();
  }

  registerEvent() {
    MiniFlyState.addEvent(UPDATE_TIME, this.listenDurFn);
  }

  initTool() {
    this.enable = true;

    // 获取游戏内的时间
    this.createTime = MiniFlyState.duration;
    this.continueTime = 0;
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
    const { blinkFrame, blinkFrameCount } = this;

    // 处于非闪烁状态 直接放回 false 状态
    if (!this.getBlinkState()) return false;
    // 进入闪烁状态 需要控制闪烁的间隔
    // 闪烁记时
    if (blinkFrameCount >= blinkFrame) {
      // 临时隐藏护盾
      if (blinkFrame > 0) {
        this.blinkFrame--;
        return true;
      }

      // 隐藏时间到，护盾闪烁结束，恢复显示
      this.blinkFrame = SHIELD_FRAME_NUM;
      this.blinkFrameCount = 0;
      return true;
    }
    this.blinkFrameCount += 1;
    return false;
  }

  // 获取闪烁状态
  getBlinkState() {
    const { blinkTime, continueTime, blinkState } = this;
    // 是否处于闪烁状态
    if (continueTime >= blinkTime || blinkState) {
      return true;
    } else {
      return false;
    }
  }

  // 强制改为闪烁状态
  forceBlink() {
    if (this.blinkState) {
      // 已经是闪烁状态 不做处理
    } else {
      // 不是闪烁
      // 需要设置护盾显示的时间 min(剩余时间,闪烁时间)
      this.blinkState = true;
      const residueTime = this.totaltime - this.continueTime;
      const minTime = Math.min(residueTime, this.blinkDuration);
      this.totaltime = this.continueTime + minTime;
    }
  }

  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = (p: IMiniActParams) => {
    const { x } = p;
    this.updatePosX(x);
  };

  // 监听游戏时间
  listenDur(lastTime: number) {
    // 更新最新的游戏时间
    this.continueTime = lastTime - this.createTime;
    if (this.continueTime >= this.totaltime) {
      console.log('销毁护盾');
      this.destroyTool();
    }
  }

  destroyTool() {
    this.enable = false;
    this.move = null;
    MiniFlyState.removeEvent(UPDATE_TIME, this.listenDurFn);
    if (this.mainUnit) {
      this.mainUnit.removeTool(this);
    }
  }
}
