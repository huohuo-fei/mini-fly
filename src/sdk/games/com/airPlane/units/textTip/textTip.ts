import type {  IMiniGameParams } from '../../../../../type';
import type { MiniFly } from '../..';
import { TextUnit } from './textUnit';
import type { textSnapshot } from './type';
import { MiniBase } from '../../../../../miniBase/miniBase';

export class PlaneText extends MiniBase {
  miniFly: MiniFly;
  gameParams: IMiniGameParams;

  textList: any[] = [];
  constructor(gameParams:IMiniGameParams,miniFly: MiniFly) {
    super()
    this.miniFly = miniFly;
    this.gameParams = gameParams;
    // this.testText()
  }

  testText() {

    const canvasWidth = this.gameParams.canvasWidth;
    const cx = canvasWidth / 2;
    const h = 100

    // ctx.save();
    // ctx.beginPath();
    // ctx.fillStyle = '#00ff66';
    // ctx.font = `14px Arial`;
    // const width = ctx.measureText(text).width;
    // ctx.fillText(text, canvasWidth / 2 - width / 2, 50);
    // ctx.restore();
    const t1 = new TextUnit({
      text: '✦✦ 无敌 ✦✦',
      x: cx,
      y: h,
      color: '#00ff66',
      fontSize: 14,
    });

    this.textList.push(t1);
  }

  addText(snapshot:textSnapshot) {
    const text = new TextUnit(snapshot);
    this.textList.push(text);
    return text
  }

  removeText(text: TextUnit) {
    const index = this.textList.indexOf(text);
    if (index > -1) {
      this.textList.splice(index, 1);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.textList.length; i++) {
      const text = this.textList[i];
      text.render(ctx);
    }
  }
}
