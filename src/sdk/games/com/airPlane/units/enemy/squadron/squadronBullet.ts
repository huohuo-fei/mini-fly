import type { PlaneUnit } from "../../../base/planeUnit";
import type { PlaneBulletParams, PlaneBulletType } from "../../../base/type";
import { PlaneBulletBox } from "../../../base/PlaneBulletBox";
export class SquadronBullet extends PlaneBulletBox {

  constructor(type:PlaneBulletType,params:PlaneBulletParams,planeUnit:PlaneUnit){
    super(type,params,planeUnit);
  }
}