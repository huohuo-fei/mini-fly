// 飞机大战
import type { IMiniActParams, IMiniGam, IMiniGameParams }from "../../../type";
export class MiniFly implements IMiniGam {
  constructor(gameParams: IMiniGameParams) {
    console.log(gameParams);
  }

  // render 方法
  render(ctx: CanvasRenderingContext2D) {
    console.log('render game fly', ctx);
    ctx.clearRect(0, 0, 800, 600);
    ctx.strokeStyle = 'white';
    ctx.strokeRect(0, 0, 800 * Math.random(), 600 * Math.random());
  }

  actionStart(action: IMiniActParams) {
    console.log('action', action);
  }

  actionEnd(p: IMiniActParams) {
    console.log('p', p);
  }
  actionDoing(p: IMiniActParams) {
    console.log('p', p);
  }
}
