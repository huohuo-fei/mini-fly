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

export class MiniScreen extends EventBus implements IMiniScreen {
  gamList = new Set<IMiniGam>();
  canvas: HTMLCanvasElement;
  height: number;
  width: number;
  gamManager: IMiniGamManager;
  gamAcion: IMiniAction;
  activeGam: IMiniGam | null = null;
  ctx: CanvasRenderingContext2D | null;
  aniTime: number | null = null;
  aniId: number | null = null;
  stopFlag: boolean = false;

  lastTime: number = 0;
  FRAME_INTERVAL = 1000 / 88;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.height = canvas.height;
    this.width = canvas.width;
    this.ctx = canvas.getContext('2d');
    this.gamManager = new MiniGamManager(this, {
      type: MiniGameType.FLY,
      canvasHeight: this.height,
      canvasWidth: this.width,
    });
    this.gamAcion = new MiniAction(canvas, this);

    // this.initAni();
  }

  initAni() {
    let frameCount = 0;
    let lastTime = performance.now();

    const countFrame = () => {
      frameCount++;
      const currentTime = performance.now();
      // 每秒统计一次
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        this.testDraw(fps);
        // 重置
        frameCount = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(countFrame);
    };

    // 启动检测
    requestAnimationFrame(countFrame);
  }

  testDraw(fps: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.save();
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`FPS: ${fps}`, this.width - 100, 20);
    ctx.restore();
  }

  pauseAni() {
    if (this.aniId !== null) {
      this.stopFlag = true;
      cancelAnimationFrame(this.aniId);
      this.activeGam?.pauseRender && this.activeGam.pauseRender();
      this.aniTime = null;
      console.log('渲染终止');
    }
  }
  aniLoop(timestamp: number) {
    const deltaTime = (timestamp - this.lastTime) / 1000;

    // console.log(deltaTime, 'deltaTime');

    // 超过了帧间隔时间，执行动画
    this.draw(deltaTime);
    this.lastTime = timestamp;

    this.aniId = requestAnimationFrame((timestamp) => {
      this.aniLoop(timestamp);
    });
  }

  startAni() {
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
    this.ctx?.clearRect(0, 0, this.width, this.height);
    this.ctx?.beginPath();
    if (this.activeGam) {
      if (this.ctx) {
        // 先更新再渲染  --- 后续优化统一
        this.activeGam.update(deltaTime);
        this.activeGam.render(this.ctx);
      } else {
        this.pauseAni();
      }
    } else {
      console.log('no active game');
      this.pauseAni();
    }
  }
}
