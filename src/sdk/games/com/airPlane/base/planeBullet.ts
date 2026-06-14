import { Matrix3, Vector2 } from '../../../../utils/Matrix3';
import type { PlaneBulletBox } from './PlaneBulletBox';
import { PlaneBase } from './planeBase';
import type { PlaneUnit } from './planeUnit';
import {
  PlaneBulletType,
  type PlaneBulletParams,
  type PlaneUnitParams,
  PlaneBulletShape,
} from './type';

export class PlaneBullet extends PlaneBase {
  type: PlaneBulletType = PlaneBulletType.Normal;
  params: PlaneBulletParams;
  bulletBox: PlaneBulletBox;
  matrix: Matrix3 = new Matrix3();
  dirVec: Vector2 = new Vector2();
  theat: number = 0;
  constructor(
    type: PlaneBulletType,
    bulletBox: PlaneBulletBox,
    params: PlaneBulletParams,
  ) {
    super();
    this.params = JSON.parse(JSON.stringify(params));
    this.bulletBox = bulletBox;
    this.type = type;
    this.matrix.makeTranslation(this.params.bulletX, this.params.bulletY);
    this.dirVec.set(...this.params.direction).normalize();
    this.theat = Math.atan2(this.dirVec.y, this.dirVec.x);
  }

  updatePos() {
    const { speedX, speedY } = this.params;
    const deltaX = Math.cos(this.theat) * speedX;
    const deltaY = Math.sin(this.theat) * speedY;
    this.params.bulletX += deltaX;
    this.params.bulletY += deltaY;
    this.matrix.makeTranslation(this.params.bulletX, this.params.bulletY);
  }
  render(ctx: CanvasRenderingContext2D) {
    if(!this.isDraw())return
    ctx.save();
    ctx.translate(this.matrix.elements[6], this.matrix.elements[7]);
    ctx.beginPath();

    if (this.params.shape === PlaneBulletShape.Circle) {
      this.drawCircle(ctx);
    } else if (this.params.shape === PlaneBulletShape.Rect) {
      this.drawRect(ctx);
    }

    ctx.restore();
    this.updatePos();
    this.destroy();
  }

  drawCircle(ctx: CanvasRenderingContext2D) {
    const { bulletWidth } = this.params;
    ctx.fillStyle = '#ff8866';
    ctx.arc(0, 0, bulletWidth / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  drawRect(ctx: CanvasRenderingContext2D) {
    const { bulletWidth, bulletHeight } = this.params;
    ctx.shadowColor = 'red';
    ctx.fillStyle = '#ffcc44';
    ctx.shadowBlur = 8;
    ctx.fillRect(
      -bulletWidth / 2,
      -bulletHeight / 2,
      bulletWidth,
      bulletHeight
    );
    ctx.fillRect(
      -bulletWidth / 2,
      -bulletHeight / 2,
      bulletWidth,
      bulletHeight
    );
  }

  isDraw(){
    const x = this.matrix.elements[6];
    const y = this.matrix.elements[7];

    const {bulletHeight,bulletWidth} = this.params
    const {canvasHeight,canvasWidth} = this.bulletBox.planeUnit

    const radio = 2

    const l = 0 - bulletWidth * radio
    const r = canvasWidth + bulletWidth

    const t = 0 - bulletHeight * radio
    const b = canvasHeight + bulletHeight

    if(x < l || x > r || y < t || y > b){
      return false
    }else{
      return true
    }
  }

  destroy(){
    const x = this.matrix.elements[6];
    const y = this.matrix.elements[7];

    const {bulletHeight,bulletWidth} = this.params
    const {canvasHeight,canvasWidth} = this.bulletBox.planeUnit

    const radio = 2

    const l = 0 - bulletWidth * radio
    const r = canvasWidth + bulletWidth

    const t = 0 - bulletHeight * radio
    const b = canvasHeight + bulletHeight

    if(x < l || x > r || y < t || y > b){
      this.bulletBox.removeBullet(this)
    }
  }
}
