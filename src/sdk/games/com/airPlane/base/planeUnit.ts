import { PlaneBase } from './planeBase';
import type { PlaneBody } from './planeBody';
import type { PlaneBullet } from './planeBullet';

export class PlaneUnit extends PlaneBase {
  planeBody: PlaneBody | null = null
  bulletList: PlaneBullet[] = [];
  constructor() {
    super();
    // this.planeBody = planeBody;
  }
}
