import type { Point } from "../type";

// 缓动函数库
export const Easing = {
  // 线性
  linear: (t: number) => t,
  
  // 缓入（加速）
  easeInQuad: (t: number) => t * t,
  
  // 缓出（减速）
  easeOutQuad: (t: number) => t * (2 - t),
  
  // 缓入缓出（先加速后减速）
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  
  // 弹性效果
  easeOutElastic: (t: number) => {
      const c4 = (2 * Math.PI) / 3;
      return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }
};

export class EasedMove {
  private start: Point;
  private end: Point;
  private totalFrames: number;
  private currentFrame: number = 0;
  private easingFunc: (t: number) => number;

  constructor(start: Point, end: Point, totalFrames: number, easing: keyof typeof Easing = 'linear') {
      this.start = { ...start };
      this.end = { ...end };
      this.totalFrames = totalFrames;
      this.easingFunc = Easing[easing];
  }

  getCurrentPosition(): Point {
      const t = this.currentFrame / (this.totalFrames - 1);
      const easedT = this.easingFunc(t);
      
      return {
          x: this.start.x + (this.end.x - this.start.x) * easedT,
          y: this.start.y + (this.end.y - this.start.y) * easedT
      };
  }

  update(): boolean {
      if (this.currentFrame >= this.totalFrames - 1) {
          return false;
      }
      this.currentFrame++;
      return true;
  }
}

// 使用缓动效果
const move = new EasedMove(
  { x: 0, y: 0 }, 
  { x: 100, y: 50 }, 
  60, 
  'easeOutElastic'  // 弹性效果
);