import type { IMiniActParams } from "../../../../type";
import type { IPlaneBase } from "./interface";

export class PlaneBase implements IPlaneBase{
  render(ctx: CanvasRenderingContext2D){
    throw new Error("Method not implemented.");
  };
  actionStart (p: IMiniActParams){
    throw new Error("Method not implemented.");
  }
  actionEnd(p: IMiniActParams){
    throw new Error("Method not implemented.");
  };
  actionDoing (p: IMiniActParams){
    throw new Error("Method not implemented.");
  };
  events: Map<string, Set<Function>> = new Map();
  on(eventName: string, callback: Function) {
    const set = this.events.get(eventName) || new Set();
    set.add(callback);
    this.events.set(eventName, set);
  }

  emit(eventName: string, ...args: any[]){
    const set = this.events.get(eventName);
    if(set) {
      set.forEach((callback) => {
        callback(...args);
      });
    }
  }


  
}