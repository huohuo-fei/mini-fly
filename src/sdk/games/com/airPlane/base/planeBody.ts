import { PlaneBase } from "./planeBase";
import type { PlaneBodyParams } from "./type";

export class PlaneBody extends PlaneBase {
  bodyWidth: number = 0;
  bodyHeight: number = 0;
  bodyX: number = 0;
  bodyY: number = 0;
  speedX:number = 0;
  speedY: number = 0;

  constructor(bodyParams:PlaneBodyParams){
    super()
    this.parseParams(bodyParams)
  }

  parseParams(bodyParams:PlaneBodyParams){
    this.bodyWidth = bodyParams.bodyWidth;
    this.bodyHeight = bodyParams.bodyHeight;
    this.bodyX = bodyParams.bodyX;
    this.bodyY = bodyParams.bodyY;
    this.speedX = bodyParams.speedX;
    this.speedY = bodyParams.speedY;
  }

}