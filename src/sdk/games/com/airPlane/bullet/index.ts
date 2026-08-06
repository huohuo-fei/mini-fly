import type { MiniFly } from '..';
import type {
  IMiniActParams,
  IMiniGam,
  IMiniGameParams,
} from '../../../../type';
import { PlaneBullet } from '../base/planeBullet';
import {
  BulletCamp,
  type PlaneBulletParams,
  type PlaneBulletType,
} from '../base/type';

export class PlaneBullets implements IMiniGam {
  miniFly: MiniFly;
  gameParams: IMiniGameParams;
  bullets: PlaneBullet[] = [];
  buttlesMap: Map<BulletCamp, Set<PlaneBullet>> = new Map();

  constructor(gameParams: IMiniGameParams, miniFly: MiniFly) {
    this.miniFly = miniFly;
    this.gameParams = gameParams;
  }
  addBulletByParams(
    type: PlaneBulletType,
    camp: BulletCamp,
    params: PlaneBulletParams
  ) {
    const bullet = new PlaneBullet(type, camp, this, params);
    // this.bullets.push(bullet);
    const set = this.buttlesMap.get(camp);
    if (!set) {
      this.buttlesMap.set(camp, new Set([bullet]));
    } else {
      set.add(bullet);
    }
  }

  // 检测子弹是否击中敌人
  checkHitEnemy(cb: (bullet: PlaneBullet) => boolean) {
    const enemySet = this.buttlesMap.get(BulletCamp.Player);
    if (!enemySet) return;
    const removeButtles = [];

    for (const bullet of enemySet) {
      const flag = cb(bullet);
      if (flag) {
        bullet.removeTag = true;
        removeButtles.push(bullet);
      }
    }

    for (let i = 0; i < removeButtles.length; i++) {
      enemySet.delete(removeButtles[i]);
    }
  }

  checkHitPlayer(cb: (bullet: PlaneBullet) => boolean) {
    const enemySet = this.buttlesMap.get(BulletCamp.Enemy);
    if (!enemySet) return;
    const removeButtles = [];

    for (const bullet of enemySet) {
      const flag = cb(bullet);
      if (flag) {
        bullet.removeTag = true;
        removeButtles.push(bullet);
      }
    }

    for (let i = 0; i < removeButtles.length; i++) {
      enemySet.delete(removeButtles[i]);
    }
  }

  beforeRender() {
    // 每次渲染之前，需要过滤掉已经不在可视区域的子弹
    for (const [_, set] of this.buttlesMap) {
      for (const bullet of set) {
        if (bullet.removeTag) {
          set.delete(bullet);
        }
      }
    }
  }
  render(ctx: CanvasRenderingContext2D) {
    this.beforeRender();

    // 渲染确定的子弹
    for (const [_, set] of this.buttlesMap) {
      // if(_ == BulletCamp.Enemy){
      //   console.log('bullets:',set.size);
      // }
      for (const bullet of set) {
        bullet.render(ctx);
        this.checkOutside(bullet);
      }
    }
  }

  // 检测当前子弹是否在可视区域
  checkOutside(bullet: PlaneBullet) {
    const x = bullet.matrix.elements[6];
    const y = bullet.matrix.elements[7];

    const { bulletHeight, bulletWidth } = bullet.params;
    const { canvasHeight, canvasWidth } = this.gameParams;

    const radio = 2;

    const l = 0 - bulletWidth * radio;
    const r = canvasWidth + bulletWidth;

    const t = 0 - bulletHeight * radio;
    const b = canvasHeight + bulletHeight;

    if (x < l || x > r || y < t || y > b) {
      // 在外部 需要移除引用
      bullet.removeTag = true;
    } else {
    }
  }

  // 移除阵营中的子弹
  removeBulletsByCamp(camp: BulletCamp, bullet: PlaneBullet) {
    const set = this.buttlesMap.get(camp);
    if (set) {
      set.delete(bullet);
    }
  }

  actionStart(p: IMiniActParams) {}
  actionEnd(p: IMiniActParams) {}
  actionDoing(p: IMiniActParams) {}
}
