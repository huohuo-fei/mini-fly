import type { IMiniG } from "../../../../type";
import type { Matrix3 } from "../../../../utils/Matrix3";

export interface IPlaneBase extends IMiniG {
  matrix: Matrix3
}

// 子弹
export interface IPlaneBullet extends IPlaneBase {
  
}