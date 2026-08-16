import type {
  IMiniScreen,
  IMiniGam,
  IMiniGamManager,
  IMiniAction,
  IMiniActParams,
} from '../type';
import { MiniGamManager } from '..';
import { MiniGameType } from '../utils/common';
import { MiniAction } from '../action';
import { EventBus } from '../miniBase/eventBus';
import { Matrix3 } from '../utils/Matrix3';

export class MiniScreen extends EventBus implements IMiniScreen {
  gamList = new Set<IMiniGam>();
  canvas: HTMLCanvasElement;
  height: number;
  width: number;
  gamManager: IMiniGamManager;
  gamAcion: IMiniAction;
  activeGam: IMiniGam | null = null;
  ctx: CanvasRenderingContext2D | null;
  aniId: number | null = null;
  matrix: Matrix3 = new Matrix3();

  // 屏幕适配功能 //
  // 设计稿的尺寸
  designArr: number[] = [750, 1334];
  // 外部canvas 尺寸 css
  outSize: number[] = [0, 0];
  // 在经过缩放后，canvas 的绘图尺寸
  drawSize: number[] = [0, 0];

  // 最新的时间，用于判断每帧之间的间隔
  lastTime: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.outSize = [canvas.width, canvas.height];
    this.ctx = canvas.getContext('2d');
    this.adaptSize();

    this.height = canvas.height;
    this.width = canvas.width;

    this.gamManager = new MiniGamManager(this, {
      type: MiniGameType.FLY,
      canvasHeight: this.drawSize[1],
      canvasWidth: this.drawSize[0],
    });

    this.gamAcion = new MiniAction(canvas, this, {
      type: MiniGameType.FLY,
      canvasHeight: this.drawSize[1],
      canvasWidth: this.drawSize[0],
    });
    this.initAni();
  }

  initAni() {
    this.testDPR();
  }

  testFps() {
    let frameCount = 0;
    let lastTime = performance.now();

    const countFrame = () => {
      frameCount++;
      const currentTime = performance.now();
      // 每秒统计一次
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        this.testDraw('fps', fps);
        // 重置
        frameCount = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(countFrame);
    };

    // 启动检测
    requestAnimationFrame(countFrame);
  }

  testDPR() {
    const dpr = window.devicePixelRatio;
    this.testDraw('dpr', dpr);
  }

  testDraw(titls: string, fps: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.save();
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`${titls}: ${fps}`, this.width - 100, 20);
    ctx.restore();
  }

  // 适配尺寸
  // 对不同的屏幕做适配，保证设计尺寸的比例不变
  adaptSize() {
    const { designArr, outSize } = this;
    const DESIGN_W = designArr[0];
    const DESIGN_H = designArr[1];

    const DESIGN_RATIO = DESIGN_W / DESIGN_H;
    const screenRatio = outSize[0] / outSize[1];
    const dpr = window.devicePixelRatio;

    // 依据当前的屏幕比例，进行缩放
    this.canvas.width = outSize[0] * dpr;
    this.canvas.height = outSize[1] * dpr;
    this.canvas.style.width = outSize[0] + 'px';
    this.canvas.style.height = outSize[1] + 'px';

    // 统一宽高比
    let scaleX, scaleY;
    if (screenRatio > DESIGN_RATIO) {
      // 屏幕更扁 → 以高度为基准缩放，宽度居中
      scaleY = this.canvas.height / DESIGN_H;
      scaleX = scaleY; // 等比缩放
      this.drawSize = [DESIGN_H * screenRatio, DESIGN_H ];
    } else {
      // 屏幕更瘦 → 以宽度为基准缩放，高度居中
      scaleX = this.canvas.width / DESIGN_W;
      scaleY = scaleX; // 等比缩放
      this.drawSize = [DESIGN_W , DESIGN_W / screenRatio];
    }
    this.matrix = new Matrix3().scale(scaleX, scaleY);
    
  }

  pauseAni() {
    if (this.aniId !== null) {
      cancelAnimationFrame(this.aniId);
      this.activeGam?.pauseRender && this.activeGam.pauseRender();
      console.log('渲染终止');
    }
  }
  aniLoop(timestamp: number) {
    // 计算出增量时间，用于控制每个动画的移动量
    const deltaTime = (timestamp - this.lastTime) / 1000;
    this.draw(deltaTime);
    this.lastTime = timestamp;

    this.aniId = requestAnimationFrame((timestamp) => {
      this.aniLoop(timestamp);
    });
  }

  startAni() {
    this.lastTime = performance.now();
    if (!this.activeGam) {
      this.activeGam = this.gamManager.getActiveGam();
    }
    this.aniId = requestAnimationFrame((timestamp) => {
      this.aniLoop(timestamp);
    });
  }

  resetGame() {
    this.activeGam = this.gamManager.resetGame();
  }

  setActiveGam(gam: IMiniGam) {
    this.activeGam = gam;
  }

  getGameInfo() {
    const info = this.activeGam?.exportGameInfo();
    if (info) {
      return info;
    }
    return {
      score: 0,
      time: 0,
      des: '',
    };
  }

  actionTransfer(params: IMiniActParams) {
    this.gamManager.receiveTransfer(params);
  }

  draw(deltaTime: number) {
    if (this.activeGam) {
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.save();
        this.ctx.transform(...this.matrix.toCanvasTransform());
        this.ctx.beginPath();
        // 先更新再渲染  --- 后续优化统一
        this.activeGam.update(deltaTime);
        this.activeGam.render(this.ctx);
        this.drawRect(this.ctx);
        this.ctx.restore();
      } else {
        this.pauseAni();
      }
    } else {
      console.log('no active game');
      this.pauseAni();
    }
  }

  drawRect(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, this.designArr[0], this.designArr[1]);
    ctx.restore();
  }
}
