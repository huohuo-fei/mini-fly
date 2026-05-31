import type { IMiniActParams, IMiniGam } from '../../../../../../type';
import { Matrix3 } from '../../../../../../utils/Matrix3';

export class SquadronsUnit implements IMiniGam {
  matrix: Matrix3 = new Matrix3();
  w: number = 50;
  h: number = 50;
  radius: number = 25;
  health:number = 20;
  score:number = 100;
  deadScore:number = 200

  constructor(x: number, y: number, w: number, h: number) {
    this.matrix.makeTranslation(x, y);
    this.w = w;
    this.h = h;
    this.radius = w / 2;
  }

  render(ctx: CanvasRenderingContext2D) {
    const { radius } = this;
    ctx.save();
    ctx.translate(this.matrix.elements[6], this.matrix.elements[7]);
    ctx.strokeStyle = 'aqua';
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  getPos() {
    return {
      x: this.matrix.elements[6],
      y: this.matrix.elements[7],
    };
  }

  updateState(combat:number){
    this.health -= combat;
    if(this.health <= 0){
      this.health = 0;
      return true;
    }
    return false;
  }

  actionStart = () => {};
  actionEnd = () => {};
  actionDoing = () => {};
}
