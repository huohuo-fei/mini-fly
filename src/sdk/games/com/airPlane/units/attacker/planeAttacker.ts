import type {
  IMiniActParams,
  IMiniGam,
  IMiniGameParams,
} from '../../../../../type';
import { MyBulletType, type MyBulletConfig } from '../../type';
import { PlaneBullet } from './planeBullet';
import { myBulletConfig } from '../../config';

export class PlaneAttacker implements IMiniGam {
  private PLAYER_WIDTH = 30;
  private PLAYER_HEIGHT = 30;
  private shootCooldown = 160;
  attackerX: number = 0;
  attackerY: number = 0;
  gameParams: IMiniGameParams;

  // 子弹
  bullets: PlaneBullet[] = [];
  bulletType = MyBulletType.NORMAL;
  bulletTimer: number | null = null;

  // 分数
  score: number = 0;

  constructor(params: IMiniGameParams) {
    const playerX = params.canvasWidth / 2 - 15;
    const playerY = params.canvasHeight - 70;
    this.gameParams = params;
    this.updatePos(playerX, playerY);
    this.buildBullet();
  }

  // 生成子弹
  buildBullet() {
    if (!this.bulletTimer) {
      this.bulletTimer = setInterval(() => {
        const config = JSON.parse(
          JSON.stringify(myBulletConfig)
        ) as MyBulletConfig;
        config.x = this.attackerX + this.PLAYER_WIDTH / 2 - config.w / 2;
        config.y = this.attackerY - this.PLAYER_HEIGHT;
        const bullet = new PlaneBullet(this.bulletType, this, config);
        this.bullets.push(bullet);
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
  }

  updateScore(val:number) {
    this.score += val;
    console.log(this.score,'score');
    
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
    this.drawPlayer(ctx);

    for (let i = 0; i < this.bullets.length; i++) {
      const b = this.bullets[i];
      b.render(ctx);
    }
  }
  actionStart = (p: IMiniActParams) => {};
  actionEnd = (p: IMiniActParams) => {};
  actionDoing = (p: IMiniActParams) => {
    const { x } = p;
    this.updatePosX(x);
  };
}
