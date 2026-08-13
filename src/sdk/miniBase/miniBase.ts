import type { IMiniActParams, IMiniGam } from '..';
import { Matrix3 } from '../utils/Matrix3';
import { EventBus } from './eventBus';

export abstract class MiniBase extends EventBus implements IMiniGam {
  matrix: Matrix3 = new Matrix3();
  update(deltaTime: number) {
    // console.log(deltaTime);
  }
  render(ctx: CanvasRenderingContext2D) {
    console.log(ctx);
  }

  actionStart(p: IMiniActParams) {
    console.log(p);
  }
  actionEnd(p: IMiniActParams) {
    console.log(p);
  }
  actionDoing(p: IMiniActParams) {
    console.log(p);
  }
  pauseRender() {}
  exportGameInfo() {
    return {
      score: 0,
      time: 0,
      des: '',
    };
  }
}
