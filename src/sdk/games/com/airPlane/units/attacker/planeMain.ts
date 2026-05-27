import type { IMiniActParams, IMiniGam } from '../../../../../type';
import { type IMiniPlaneMainParams } from '../../type';
import { Matrix3 } from '../../../../../utils/Matrix3';

export class PlaneMain implements IMiniGam {
  planeWidth: number = 0;
  planeHeight: number = 0;

  planeParams: IMiniPlaneMainParams;

  shootCooldown: number = 0;
  attackerX: number = 0;
  attackerY: number = 0;
  matrix: Matrix3 = new Matrix3();

  constructor(params: IMiniPlaneMainParams) {
    this.planeParams = JSON.parse(
      JSON.stringify(params)
    ) as IMiniPlaneMainParams;
    this.planeWidth = params.w;
    this.planeHeight = params.h;
    this.shootCooldown = params.shootCooldown;
    this.attackerX = params.x;
    this.attackerY = params.y;
    this.updatePosX(this.attackerX);
  }

  updatePosX(x: number) {
    // 更新玩家位置 (平滑跟随鼠标/手指)
    this.attackerX = x;
    this.matrix.makeTranslation(this.attackerX, this.attackerY);
  }

  render(ctx: CanvasRenderingContext2D) {
    const {  planeWidth, planeHeight } = this;
    ctx.save();
    ctx.translate(this.matrix.elements[6], this.matrix.elements[7])
    // 先绘制飞机的外形框
    ctx.strokeStyle = 'red';
    ctx.strokeRect(-planeWidth / 2, -planeHeight / 2, planeWidth, planeHeight);
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#0af';
    ctx.fillStyle = '#7df9ff';
    ctx.beginPath();

    // 绘制一个梭形
    const offsetX = 3;
    const offsetY = 6;
    ctx.moveTo(-planeWidth / 2 + offsetX, offsetY);
    ctx.lineTo(0, -planeHeight / 2);
    ctx.lineTo(planeWidth / 2 - offsetX, offsetY);
    ctx.lineTo(0, planeHeight / 2);
    ctx.fill();
    ctx.fillStyle = '#ffd966';
    ctx.beginPath();
    ctx.rect(-5, -5, 10, 10);
    ctx.fill();

    ctx.restore();
  }

  test(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    ctx.strokeStyle = 'yellow';
    ctx.strokeRect(250, y, 100, 100);
    ctx.restore();
  }

  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = (p: IMiniActParams) => {
    const { x } = p;
    this.updatePosX(x);
  };
}
