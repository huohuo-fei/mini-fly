import { type IMiniPlaneToolInfo, MiniPlaneToolType } from '../../type';
import type { IMiniGam, IMiniGameParams } from '../../../../../type';
import type { PlaneBullet } from '../attacker/planeBullet';

export class PlaneTool implements IMiniGam {
  lastTime: number;
  type: MiniPlaneToolType;
  toolInfo: IMiniPlaneToolInfo;
  gameParams: IMiniGameParams;
  resource: HTMLImageElement | null;

  constructor(
    toolInfo: IMiniPlaneToolInfo,
    img: HTMLImageElement | null,
    gameParams: IMiniGameParams
  ) {
    this.type = toolInfo.type;
    this.toolInfo = toolInfo;
    this.lastTime = Date.now();
    this.gameParams = gameParams;
    this.resource = img;
  }

  updatePos() {
    const temp = Date.now();
    const diff = temp - this.lastTime;
    this.lastTime = temp;
    this.toolInfo.y += (this.toolInfo.speedY * diff) / 100;
  }

  updateSate() {
    // if (this.toolInfo.y > this.canvasHeight) {
    //   // 此时 需要移除当前单位
    //   this.planeEnemy.removeUnit(this);
    // }
  }

  // 碰撞检测
  isHit(bullet: PlaneBullet) {
    const { x, y, w, h } = this.toolInfo;
    const { x: bx, y: by, w: bw, h: bh } = bullet.config;

    if (x < bx + bw && x + w > bx && y < by + bh && y + h > by) {
      // 碰撞
      return true;
    } else {
      return false;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this.toolInfo;
    ctx.beginPath();
    ctx.save();
    if (this.resource) {
      ctx.drawImage(this.resource, x, y, w, h);
    }
    // switch (this.type) {
    //   case MiniPlaneToolType.LIFE:
    //     this.drawLife(ctx);
    //     break;
    //   case MiniPlaneToolType.SHIELD:
    //     this.drawShield(ctx);
    //     break;
    //   case MiniPlaneToolType.BOMB:
    //     this.drawBomb(ctx);
    //     break;
    //   case MiniPlaneToolType.DOUBLE:
    //     this.drawDouble(ctx);
    // }
    ctx.restore();
    this.updatePos();
    this.updateSate();
  }

  drawLife(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this.toolInfo;

    if (this.resource) {
      ctx.drawImage(this.resource, x, y, w, h);
    }
  }

  drawShield(ctx: CanvasRenderingContext2D) {}

  drawBomb(ctx: CanvasRenderingContext2D) {}

  drawDouble(ctx: CanvasRenderingContext2D) {}

  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = () => {};
}
