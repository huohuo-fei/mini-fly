import { type IMiniPlaneToolInfo, MiniPlaneToolType } from '../../type';
import type { IMiniGam, IMiniGameParams } from '../../../../../type';
import type { PlaneToolBox } from './planeToolBox';
import { Matrix3 } from '../../../../../utils/Matrix3';

export class PlaneTool implements IMiniGam {
  lastTime: number;
  type: MiniPlaneToolType;
  toolInfo: IMiniPlaneToolInfo;
  gameParams: IMiniGameParams;
  resource: HTMLImageElement | null;
  toolBox: PlaneToolBox;
  matrix: Matrix3 = new Matrix3();

  constructor(
    toolInfo: IMiniPlaneToolInfo,
    img: HTMLImageElement | null,
    gameParams: IMiniGameParams,
    toolBox: PlaneToolBox
  ) {
    this.type = toolInfo.type;
    this.toolInfo = toolInfo;
    this.lastTime = Date.now();
    this.gameParams = gameParams;
    this.resource = img;
    this.toolBox = toolBox;

    this.matrix.makeTranslation(this.toolInfo.x, this.toolInfo.y);
  }

  updatePos() {
    const temp = Date.now();
    const diff = temp - this.lastTime;
    this.lastTime = temp;
    this.toolInfo.y += (this.toolInfo.speedY * diff) / 100;
    this.matrix.makeTranslation(this.toolInfo.x, this.toolInfo.y);
  }

  updateSate() {
    if (this.toolInfo.y > this.gameParams.canvasHeight) {
      // 此时 需要移除当前单位
      this.toolBox.removeTool(this);
    }
  }

  // 碰撞检测
  isHit(ax: number, ay: number, aw: number, ah: number) {
    const { x, y, w, h } = this.toolInfo;
    if (x < ax + aw && x + w > ax && y < ay + ah && y + h > ay) {
      // 碰撞
      return true;
    } else {
      return false;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    const { w, h } = this.toolInfo;
    ctx.save();
    ctx.beginPath();
    if (this.resource) {
      ctx.translate(this.matrix.elements[6], this.matrix.elements[7]);
      ctx.drawImage(this.resource, -w / 2, -h / 2, w, h);
    }
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
