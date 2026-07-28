import { Matrix3 } from '../../../../../utils/Matrix3';
import { PlaneBase } from '../../base/planeBase';
import { TextAline, type textSnapshot } from './type';

export class TextUnit extends PlaneBase {
  text: string = '';
  color: string = '#ffffff';
  fontSize: number = 20;
  fontFamily: string = 'Arial';
  x: number = 0;
  y: number = 0;
  aline: TextAline = TextAline.CENTER;
  constructor(snapshot: textSnapshot) {
    super();
    this.text = snapshot.text;
    this.color = snapshot.color;
    this.fontSize = snapshot.fontSize;
    this.x = snapshot.x;
    this.y = snapshot.y;
    if (snapshot.fontFamily) {
      this.fontFamily = snapshot.fontFamily;
    }

    if (snapshot.aline) {
      this.aline = snapshot.aline;
    }

    this.matrix.makeTranslation(this.x, this.y);
  }

  render(ctx: CanvasRenderingContext2D) {
    const { text, color, fontSize, fontFamily } = this;
    // const text = '✦✦ 无敌状态 ✦✦'
    const font = `${fontSize}px ${fontFamily}`;
    ctx.save();
    ctx.transform(...this.matrix.toCanvasTransform());
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.font = font;

    const width = ctx.measureText(text).width;

    if (this.aline === TextAline.CENTER) {
      ctx.fillText(text, -width / 2, 0);
    }
    ctx.restore();
  }
}
