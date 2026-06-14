import { PlaneBulletBox } from "../../../base/PlaneBulletBox";
import type { PlaneUnit } from "../../../base/planeUnit";
import type { PlaneBulletParams, PlaneBulletType, PlaneUnitParams } from "../../../base/type";

export class BossBullet extends PlaneBulletBox{
  constructor(type:PlaneBulletType,params:PlaneBulletParams,planeUnit:PlaneUnit){
    super(type,params,planeUnit);
  }
}