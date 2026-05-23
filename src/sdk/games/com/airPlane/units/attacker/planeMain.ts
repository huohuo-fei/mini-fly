import type {
  IMiniActParams,
  IMiniGam,
} from '../../../../../type';
import {type IMiniPlaneMainParams } from '../../type';


export class PlaneMain implements IMiniGam {
  planeWidth:number = 0;
  planeHeight:number = 0;

  planeParams: IMiniPlaneMainParams;

  shootCooldown:number = 0;
  attackerX: number = 0;
  attackerY: number = 0;



  constructor(params: IMiniPlaneMainParams) {
    this.planeParams = JSON.parse(JSON.stringify(params)) as IMiniPlaneMainParams;
    this.planeWidth = params.w;
    this.planeHeight = params.h;
    this.shootCooldown = params.shootCooldown;
    this.attackerX = params.x;
    this.attackerY = params.y
  }

  updatePosX(x: number) {
    // 更新玩家位置 (平滑跟随鼠标/手指)
    this.attackerX = x;
  }

  render(ctx: CanvasRenderingContext2D) {
    const { attackerX, attackerY ,planeWidth,planeHeight} = this;

    ctx.save();
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#0af';
    ctx.fillStyle = '#7df9ff';
    ctx.beginPath();
    ctx.moveTo(attackerX + planeWidth / 2, attackerY - 5);
    ctx.lineTo(attackerX + planeWidth - 5, attackerY + planeHeight - 8);
    ctx.lineTo(attackerX + planeWidth / 2, attackerY + planeHeight - 2);
    ctx.lineTo(attackerX + 5, attackerY + planeHeight - 8);
    ctx.fill();
    ctx.fillStyle = '#ffd966';
    ctx.beginPath();
    ctx.rect(attackerX + 10, attackerY + 5, 10, 12);
    ctx.fill();
    ctx.restore();
  }

  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = (p: IMiniActParams) => {
    const { x } = p;
    this.updatePosX(x);
  };
}
