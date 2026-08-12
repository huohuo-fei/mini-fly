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
