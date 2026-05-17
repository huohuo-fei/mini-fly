import type { IMiniActParams, IMiniGam } from '../../../../type';

// 飞机大战中需要的各种特效管理
export class PlaneEffect implements IMiniGam {
  render(ctx: CanvasRenderingContext2D) {
  }
  actionStart = (p: IMiniActParams) => {};
  actionEnd = (p: IMiniActParams) => {};
  actionDoing = (p: IMiniActParams) => {};
}
