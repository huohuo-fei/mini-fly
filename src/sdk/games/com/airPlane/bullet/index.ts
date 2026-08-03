import type { MiniFly } from "..";
import type { IMiniActParams, IMiniGam, IMiniGameParams } from "../../../../type";
import type { PlaneBullet } from "../base/planeBullet";

export class PlaneBullets implements IMiniGam{
  miniFly: MiniFly;
  gameParams: IMiniGameParams;
  bullets: PlaneBullet[] = [];
  constructor(gameParams:IMiniGameParams,miniFly:MiniFly){
    this.miniFly = miniFly;
    this.gameParams = gameParams; 
  }
  render(ctx: CanvasRenderingContext2D){};
  actionStart(p: IMiniActParams) {};
  actionEnd(p: IMiniActParams){};
  actionDoing (p: IMiniActParams) {};


}