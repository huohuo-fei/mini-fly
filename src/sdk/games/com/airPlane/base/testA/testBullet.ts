import { PlaneBullet } from "../planeBullet";

export class TestBullet extends PlaneBullet{
  size:number = 0
  constructor(size:number){
    super();
    this.size = size
  }
}