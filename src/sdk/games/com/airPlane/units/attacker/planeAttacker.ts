import type {
  IMiniActParams,
  IMiniGam,
  IMiniGameParams,
} from '../../../../../type';
import { MyBulletType, type MyBulletConfig } from '../../type';
import { PlaneBullet } from './planeBullet';
import { myBulletConfig } from '../../config';

export class PlaneAttacker implements IMiniGam {
  PLAYER_WIDTH = 30;
  PLAYER_HEIGHT = 30;
  shootCooldown = 160;
  attackerX: number = 0;
  attackerY: number = 0;
  gameParams: IMiniGameParams;
  cx: number = 0;
  cy: number = 0;

  // 子弹
  bullets: PlaneBullet[] = [];
  bulletType = MyBulletType.NORMAL;
  bulletTimer: number | null = null;
  size: number = 1;

  // 离屏canvas todo:后续由外部统一管理
  offScreenCanvas: HTMLCanvasElement | null = null;

  constructor(params: IMiniGameParams) {
    const playerX = params.canvasWidth / 2 - 15;
    const playerY = params.canvasHeight - 70;
    this.gameParams = params;
    this.updatePos(playerX, playerY);
    this.buildBullet();
  }

  doubleBullet() {
    if (this.size >= 3) return;
    this.size++;
  }

  // 生成子弹
  buildBullet() {
    if (!this.bulletTimer) {
      this.bulletTimer = setInterval(() => {
        const config = JSON.parse(
          JSON.stringify(myBulletConfig)
        ) as MyBulletConfig;
        const speedY = config.speedY;
        const cx = this.attackerX + this.PLAYER_WIDTH / 2 - config.w / 2;
        const cy = this.attackerY - this.PLAYER_HEIGHT;

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

  // 移除子弹
  removeBullet(bullet: PlaneBullet) {
    const index = this.bullets.indexOf(bullet);
    if (index > -1) {
      this.bullets.splice(index, 1);
    }
  }

  updatePos(x: number, y: number) {
    this.attackerX = x;
    this.attackerY = y;
    this.cx = x + this.PLAYER_WIDTH / 2;
    this.cy = y + this.PLAYER_HEIGHT / 2;
  }

  updatePosX(x: number) {
    // 更新玩家位置 (平滑跟随鼠标/手指)
    const { PLAYER_WIDTH, attackerX, gameParams } = this;
    let targetX = x - PLAYER_WIDTH / 2;
    targetX = Math.min(
      Math.max(targetX, 5),
      gameParams.canvasWidth - PLAYER_WIDTH - 5
    );
    let resX = attackerX * 0.85 + targetX * 0.15;

    // 边界限制最终
    resX = Math.min(
      Math.max(resX, 5),
      gameParams.canvasWidth - PLAYER_WIDTH - 5
    );
    this.attackerX = resX;
    this.cx = this.attackerX + this.PLAYER_WIDTH / 2;
  }

  drawPlayer(ctx: CanvasRenderingContext2D) {
    const { PLAYER_WIDTH, PLAYER_HEIGHT, attackerX, attackerY } = this;

    ctx.save();
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#0af';
    ctx.fillStyle = '#7df9ff';
    ctx.beginPath();
    ctx.moveTo(attackerX + PLAYER_WIDTH / 2, attackerY - 5);
    ctx.lineTo(attackerX + PLAYER_WIDTH - 5, attackerY + PLAYER_HEIGHT - 8);
    ctx.lineTo(attackerX + PLAYER_WIDTH / 2, attackerY + PLAYER_HEIGHT - 2);
    ctx.lineTo(attackerX + 5, attackerY + PLAYER_HEIGHT - 8);
    ctx.fill();
    ctx.fillStyle = '#ffd966';
    ctx.beginPath();
    ctx.rect(attackerX + 10, attackerY + 5, 10, 12);
    ctx.fill();
    ctx.restore();
  }

  render(ctx: CanvasRenderingContext2D) {
    // 绘制
    this.drawLight(ctx);
    this.drawPlayer(ctx);


    for (let i = 0; i < this.bullets.length; i++) {
      const b = this.bullets[i];
      b.render(ctx);
    }
  }

  // 绘制光罩
  drawLight(ctx: CanvasRenderingContext2D) {
    const { PLAYER_WIDTH, cx, cy } = this;
    if(!this.offScreenCanvas){
      this.offScreenCanvas = document.createElement('canvas');
    }
    this.offScreenCanvas.width = PLAYER_WIDTH*2
    this.offScreenCanvas.height = PLAYER_WIDTH
    const offScreenCtx = this.offScreenCanvas.getContext('2d');
    if(!offScreenCtx)return
    offScreenCtx.clearRect(0, 0, PLAYER_WIDTH*2, PLAYER_WIDTH);


    // 做一个线性渐变，从内到外，颜色从透明到不透明
    const gradient = ctx.createLinearGradient(
      0,
      0,
      PLAYER_WIDTH * 2,
      0
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    // 绘制护盾主体
    offScreenCtx.beginPath();
    offScreenCtx.fillStyle = gradient;
    offScreenCtx.fillRect(
      0,
      0,
      PLAYER_WIDTH * 2,
      PLAYER_WIDTH
    );
    offScreenCtx.fill();

    offScreenCtx.globalCompositeOperation = "source-in";
    offScreenCtx.beginPath();
    offScreenCtx.moveTo(PLAYER_WIDTH, PLAYER_WIDTH);
    offScreenCtx.arc(PLAYER_WIDTH, PLAYER_WIDTH, PLAYER_WIDTH, Math.PI, 2 * Math.PI);
    offScreenCtx.closePath();
    const outerGlowGrad = offScreenCtx.createRadialGradient(
      PLAYER_WIDTH,
      PLAYER_WIDTH,
      PLAYER_WIDTH - 10,
      PLAYER_WIDTH,
      PLAYER_WIDTH,
      PLAYER_WIDTH
    );
    outerGlowGrad.addColorStop(0, 'rgba(0, 180, 240, 0)');
    outerGlowGrad.addColorStop(0.8, 'rgba(0, 200, 255, 0.35)');
    outerGlowGrad.addColorStop(1, 'rgba(0, 210, 255, 0.92)');
    offScreenCtx.fillStyle = outerGlowGrad;
    offScreenCtx.fill();
    ctx.drawImage(this.offScreenCanvas, cx - PLAYER_WIDTH , cy - PLAYER_WIDTH,);
  }
  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = (p: IMiniActParams) => {
    const { x } = p;
    this.updatePosX(x);
  };
}
