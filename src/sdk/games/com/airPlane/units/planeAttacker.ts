import type {
  IMiniActParams,
  IMiniGam,
  IMiniGameParams,
} from '../../../../type';
export class PlaneAttacker implements IMiniGam {
  private PLAYER_WIDTH = 30;
  private PLAYER_HEIGHT = 30;
  attackerX: number = 0;
  attackerY: number = 0;
  gameParams: IMiniGameParams;

  constructor(params: IMiniGameParams) {
    const playerX = params.canvasWidth / 2 - 15;
    const playerY = params.canvasHeight - 70;
    this.gameParams = params;
    this.updatePos(playerX, playerY);
  }

  updatePos(x: number, y: number) {
    this.attackerX = x;
    this.attackerY = y;
  }

  updatePosX(x: number) {
    // 更新玩家位置 (平滑跟随鼠标/手指)
    const {PLAYER_WIDTH,attackerX,gameParams} = this
    let targetX = x - PLAYER_WIDTH / 2;
    targetX = Math.min(Math.max(targetX, 5), gameParams.canvasWidth - PLAYER_WIDTH - 5);
    let resX = attackerX * 0.85 + targetX * 0.15;

    // 边界限制最终
    resX = Math.min(Math.max(resX, 5), gameParams.canvasWidth - PLAYER_WIDTH - 5);
    this.attackerX = resX;
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
  }
  actionStart = (p: IMiniActParams) => {};
  actionEnd = (p: IMiniActParams) => {};
  actionDoing = (p: IMiniActParams) => {};
}
