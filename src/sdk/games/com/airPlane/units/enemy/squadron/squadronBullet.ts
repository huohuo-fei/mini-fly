import type { PlaneUnit } from '../../../base/planeUnit';
import type { PlaneBulletParams, PlaneBulletType } from '../../../base/type';
import { PlaneBulletBox } from '../../../base/PlaneBulletBox';
import type { PlaneEnemySquadron } from '.';
export class SquadronBullet extends PlaneBulletBox {
  constructor(
    type: PlaneBulletType,
    params: PlaneBulletParams,
    planeUnit: PlaneUnit
  ) {
    super(type, params, planeUnit);
  }

  // 在移除子弹之前，需要判断编队整体都在屏幕外面
  beforeRemoveBullet() {
    if (!this.planeUnit.planeBody) return true;
    const {  bodyWidth } = this.planeUnit.planeBody;
    const { canvasHeight, canvasWidth,matrix } = this.planeUnit;
    const x = matrix.elements[6];
    const y = matrix.elements[7];

    const w = bodyWidth;
    const config = (this.planeUnit as PlaneEnemySquadron).config;
    const h = Math.abs(Math.sin(config.angle) * w);

    // 编队的四角
    const t = y - h / 2;
    const b = y + h / 2;
    const l = x - w / 2;
    const r = x + w / 2;

    // 如果编队全在外面或者全在里面，则直接销毁
    // 只有编队横跨屏幕内外，才阻止销毁

    // 编队在里
    if (t > 0 && l > 0 && r < canvasWidth && b < canvasHeight) {
      return true;
    }

    // 编队在外
    if(b<0 || t>canvasHeight || l>canvasWidth || r<0){
      return true;
    }

    // 编队处于屏幕内外的交界处，不销毁
    return false;
  }
}
