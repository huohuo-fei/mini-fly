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

export class MiniScreen implements IMiniScreen {
  gamList = new Set<IMiniGam>();
  canvas: HTMLCanvasElement;
  height: number;
  width: number;
  gamManager: IMiniGamManager;
  gamAcion: IMiniAction;
  activeGam: IMiniGam | null = null;
  ctx: CanvasRenderingContext2D | null;
  aniTime: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
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
  }

  initAni() {
    if (!this.activeGam) {
      this.activeGam = this.gamManager.getActiveGam();
    }
    // this.aniTime = setInterval(() => {
      this.draw();
    // }, 22);

    requestAnimationFrame(() => {
      this.initAni();
    })
  }

  pauseAni() {
    if (this.aniTime) {
      clearInterval(this.aniTime);
      this.aniTime = null;
      console.log('渲染终止');
    }
  }

  setActiveGam(gam: IMiniGam) {
    this.activeGam = gam;
  }

  actionTransfer(params: IMiniActParams) {
    this.gamManager.receiveTransfer(params);
  }

  draw() {
    this.ctx?.clearRect(0, 0, this.width, this.height);
    this.ctx?.beginPath()
    if (this.activeGam) {
      if (this.ctx) {
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
