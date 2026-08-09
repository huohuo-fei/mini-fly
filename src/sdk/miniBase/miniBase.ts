import type {  IMiniActParams, IMiniGam } from '..';
import { Matrix3 } from '../utils/Matrix3';
import { EventBus } from './eventBus';

export abstract class MiniBase extends EventBus implements IMiniGam {
  matrix: Matrix3 = new Matrix3();
  render(ctx: CanvasRenderingContext2D) {}
  actionStart(p: IMiniActParams) {}
  actionEnd(p: IMiniActParams) {}
  actionDoing(p: IMiniActParams) {}
  pauseRender() {}
  exportGameInfo (){
    return {
      score:0,
      time:0,
      des:''
    }
  };
}
