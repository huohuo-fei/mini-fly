import type {  IMiniScreen,  IMiniGam,  IMiniGamManager } from '../type';
import { MiniGamManager } from '..';
import { MiniGameType } from '../utils/common';


export class MiniScreen implements IMiniScreen {
  gamList = new Set<IMiniGam>();
  canvas: HTMLCanvasElement;
  height: number;
  width: number;
  gamManager:IMiniGamManager
  activeGam: IMiniGam | null = null;
  ctx: CanvasRenderingContext2D | null;
  aniTime: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.height = canvas.height;
    this.width = canvas.width;
    this.ctx = canvas.getContext('2d');
    this.gamManager = new MiniGamManager(this,{type:MiniGameType.FLY})
    this.initAni();
  }

  initAni() {

    if(!this.activeGam){
      this.activeGam = this.gamManager.getActiveGam()
    }
    this.aniTime = setInterval(() => {
      this.draw();
    }, 30);
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

  draw() {
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
