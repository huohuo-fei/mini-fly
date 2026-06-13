import type { IMiniGam } from '../../../../../type';
import { myBulletConfig } from '../../config';
import {
  MyBulletType,
  type IMiniPlaneMainParams,
  type MyBulletConfig,
} from '../../type';
import { PlaneBullet } from './planeBullet';

export class PlaneBullelBox implements IMiniGam {
  planeWidth: number = 0;
  planeHeight: number = 0;
  shootCooldown: number = 0;
  attackerX: number = 0;
  attackerY: number = 0;

  // 子弹
  bullets: PlaneBullet[] = [];
  bulletType = MyBulletType.NORMAL;
  bulletTimer: number | null = null;
  size: number = 3;

  constructor(params: IMiniPlaneMainParams) {
    this.planeWidth = params.w;
    this.planeHeight = params.h;
    this.shootCooldown = params.shootCooldown;
    this.buildBullet();
    this.updatePos(params.x, params.y)
  }

  buildBullet() {
    if (!this.bulletTimer) {
      this.bulletTimer = setInterval(() => {
        const config = JSON.parse(
          JSON.stringify(myBulletConfig)
        ) as MyBulletConfig;
        const speedY = config.speedY;
        const cx = this.attackerX ;
        const cy = this.attackerY 

        if (this.size === 1) {
          config.x = cx;
          config.y = cy;
          const bullet = new PlaneBullet(this.bulletType, this, config);
          this.bullets.push(bullet);
        } else if (this.size === 2) {
          config.x = cx - config.w;
          config.y = cy;
          const bullet = new PlaneBullet(this.bulletType, this, config);
          this.bullets.push(bullet);
          config.x = cx + config.w;
          config.y = cy;
          const bullet2 = new PlaneBullet(this.bulletType, this, config);
          this.bullets.push(bullet2);
        } else if (this.size === 3) {
          config.x = cx - config.w * 2;
          config.y = cy;
          const bullet = new PlaneBullet(this.bulletType, this, config);
          this.bullets.push(bullet);
          config.x = cx + config.w * 2;
          config.y = cy;
          const bullet2 = new PlaneBullet(this.bulletType, this, config);
          this.bullets.push(bullet2);
          config.x = cx;
          config.y = cy;
          config.speedY = speedY * 1.05;

          const bullet3 = new PlaneBullet(this.bulletType, this, config);
          this.bullets.push(bullet3);
        }
      }, this.shootCooldown);
    }
  }

  addBulletSize() {
    if (this.size < 3) {
      this.size++; 
    }
  } 

  removeBullet(bullet: PlaneBullet) {
    const index = this.bullets.indexOf(bullet);
    if (index > -1) {
      this.bullets.splice(index, 1);
    }
  }

  updatePos(x: number, y: number) {
    this.attackerX = x;
    this.attackerY = y;
  }

  /**
   * 渲染方法，用于绘制游戏中的所有子弹
   * @param ctx Canvas的2D渲染上下文，用于绘制图形
   */
  render(ctx: CanvasRenderingContext2D) {
    // 遍历所有子弹数组，对每个子弹执行渲染操作
    for (let i = 0; i < this.bullets.length; i++) {
      const b = this.bullets[i]; // 获取当前子弹对象
      b.render(ctx); // 调用子弹自身的渲染方法，传入渲染上下文
    }
  }

  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = () => {};
}
