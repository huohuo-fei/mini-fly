import type { Point } from '../type';

// 缓动函数库
export const Easing = {
  // 线性
  linear: (t: number) => t,

  // 缓入（加速）
  easeInQuad: (t: number) => t * t,

  // 缓出（减速）
  easeOutQuad: (t: number) => t * (2 - t),

  // 缓入缓出（先加速后减速）
  easeInOutQuad: (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,

  // 弹性效果
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
      ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
};

export class EasedMove {
  private start: Point;
  private end: Point;
  private totalFrames: number;
  private currentFrame: number = 0;
  private easingFunc: (t: number) => number;

  constructor(
    start: Point,
    end: Point,
    totalFrames: number,
    easing: keyof typeof Easing = 'linear'
  ) {
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
      y: this.start.y + (this.end.y - this.start.y) * easedT,
    };
  }

  update(): boolean {
    if (this.currentFrame >= this.totalFrames - 1) {
      return false;
    }
    this.currentFrame++;
    return true;
  }

  /**
   * 核心扩展：根据起点、路径上的一个点、该点的时间比例，反推终点
   * @param start 起点
   * @param midPoint 路径中已知的一个点
   * @param midTimeRatio 该点发生的时间比例 (0 ~ 1，不包含0)
   * @param easing 使用的缓动函数
   * @returns 反推计算出的终点
   */
  static calculateEndPoint(
    start: Point,
    midPoint: Point,
    midTimeRatio: number,
    easing: keyof typeof Easing = 'linear'
  ): Point {
    if (midTimeRatio <= 0 || midTimeRatio >= 1) {
      console.error(
        'midTimeRatio 必须在 0 和 1 之间（不包含0和1），否则无法反推方向'
      );
      return midPoint;
    }

    const easingFunc = Easing[easing];
    const easedT = easingFunc(midTimeRatio);

    if (easedT === 0) {
      // 例如 easeInQuad 在 t=0 时 easedT=0，此时无法反推
      console.error('在该时间比例下，缓动进度为0，无法反推终点');
      return midPoint;
    }

    // 反推公式：end = start + (mid - start) / easedT
    return {
      x: start.x + (midPoint.x - start.x) / easedT,
      y: start.y + (midPoint.y - start.y) / easedT,
    };
  }
}

export class EasedMoveInfinite {
  private start: Point;
  private direction: Point; // 归一化后的单位方向向量
  private speed: number;    // 每帧移动的像素距离(速度)
  private currentFrame: number = 0;
  private easingFunc: (t: number) => number;

  /**
   * 无限直线运动构造器
   * @param start 起点
   * @param pathPoint 路径上的任意一点，用于确定方向
   * @param speed 每帧移动的像素数（匀速运动的速度）
   * @param easing 缓动函数（默认linear。注意：如果使用非线性缓动，物体会在前期变速，之后无限期保持匀速）
   */
  constructor(start: Point, pathPoint: Point, speed: number = 2) {
      this.start = { ...start };
      this.speed = speed;
      this.easingFunc = Easing['linear'];

      // 1. 计算方向向量
      const dx = pathPoint.x - start.x;
      const dy = pathPoint.y - start.y;

      // 2. 计算两点间距离 (向量模长)
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance === 0) {
          console.warn("起点和路径点重合，无法确定方向");
          this.direction = { x: 0, y: 0 };
      } else {
          // 3. 归一化：得到单位方向向量 (长度为1)
          // 这样乘以 speed 就能得到精确的位移量
          this.direction = { 
              x: dx / distance, 
              y: dy / distance 
          };
      }
  }

  getCurrentPosition(): Point {
      // 如果起点和路径点重合，则静止不动
      if (this.direction.x === 0 && this.direction.y === 0) {
          return { ...this.start };
      }

      // 计算当前经过的标准化时间 t
      // 因为是无限运动，t 会无限增长，所以这里 t 代表的是“时间倍数”
      const t = this.currentFrame / 60; // 假设 60帧为1个单位时间
      const easedT = this.easingFunc(t);

      // 核心公式：位移 = 速度 * 缓动时间 * 方向
      // 对于 linear，easedT 线性增长，表现为匀速
      // 对于 easeOutQuad，easedT 增长越来越慢，最终趋近于匀速
      const displacement = this.speed * easedT;

      return {
          x: this.start.x + this.direction.x * displacement,
          y: this.start.y + this.direction.y * displacement
      };
  }

  update(): boolean {
      // 无限运动，永远返回 true
      this.currentFrame++;
      return true;
  }
}
