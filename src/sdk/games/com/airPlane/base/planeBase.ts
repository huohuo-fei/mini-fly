import type { IMiniActParams } from '../../../../type';
import { Matrix3 } from '../../../../utils/Matrix3';
import type { IPlaneBase } from './interface';

export class PlaneBase implements IPlaneBase {
  matrix: Matrix3 = new Matrix3();
  events: Map<string, Set<Function>> = new Map();
  render(ctx: CanvasRenderingContext2D) {
    throw new Error('Method not implemented.');
  }
  actionStart(p: IMiniActParams) {
    throw new Error('Method not implemented.');
  }
  actionEnd(p: IMiniActParams) {
    throw new Error('Method not implemented.');
  }
  actionDoing(p: IMiniActParams) {
    throw new Error('Method not implemented.');
  }
  on(eventName: string, callback: Function) {
    const set = this.events.get(eventName) || new Set();
    set.add(callback);
    this.events.set(eventName, set);
  }

  emit(eventName: string, ...args: any[]) {
    const set = this.events.get(eventName);
    if (set) {
      set.forEach((callback) => {
        callback(...args);
      });
    }
  }
}
