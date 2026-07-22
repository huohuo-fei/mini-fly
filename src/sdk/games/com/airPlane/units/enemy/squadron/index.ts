import { Vector2 } from '../../../../../../utils/Matrix3';
import type { PlaneEnemy } from '../planeEnemy';
import { EnemyType, type ISquadronConfig } from '../../../type';
import { PlaneUnit } from '../../../base/planeUnit';
import {
  PlaneBulletType,
  type PlaneBulletParams,
  type PlaneUnitParams,
  type HitInfo,
} from '../../../base/type';
import { SquadronBody } from './squadronBody';
import { planeSquadronBullet } from '../../../config';
import { SquadronBullet } from './squadronBullet';
import type { PlaneBullet } from '../../../base/planeBullet';

export class PlaneEnemySquadron extends PlaneUnit {
  config: ISquadronConfig;
  planeEnemy: PlaneEnemy;
  planeBody: SquadronBody | null = null;
  type: EnemyType = EnemyType.SQUADRON;
  constructor(
    params: PlaneUnitParams,
    config: ISquadronConfig,
    planeEnemy: PlaneEnemy
  ) {
    super(params);
    this.config = JSON.parse(JSON.stringify(config)) as ISquadronConfig;
    this.planeEnemy = planeEnemy;
    this.updateParams();
    this.updateAttackerPos();

    this.planeBody = new SquadronBody(
      {
        bodyWidth: this.unitWidth,
        bodyHeight: this.unitHeight,
        bodyX: this.unitX,
        bodyY: this.unitY,
        speedX: this.speedX,
        speedY: this.speedY,
      },
      this
    );

    this.buildBullet();
  }

  updateParams() {
    const { w, h, count, gap, angle, startX, startY } = this.config;
    const totalW = w * count + gap * (count - 1);
    const totalH = h;
    this.unitWidth = totalW;
    this.unitHeight = totalH;
    const ox = startX - totalW / 2;
    const oy = startY - totalH / 2;
    this.matrix.translate(ox, oy).rotate(angle);
  }

  buildBullet() {
    if (!this.planeBody) return;
    const bulletParams = JSON.parse(
      JSON.stringify(planeSquadronBullet)
    ) as PlaneBulletParams;

    for (const enemy of this.planeBody.enemyList) {
      const cx = enemy.cx;
      const cy = enemy.cy;

      const vec = new Vector2(cx, cy);
      vec.applyMatrix3(this.matrix);
      bulletParams.bulletX = vec.x;
      bulletParams.bulletY = vec.y;
      const angle1 = Math.PI / 3;
      const x1 = Math.cos(angle1);
      const y1 = Math.sin(angle1);
      bulletParams.direction = [x1, y1];
      const bullet1 = new SquadronBullet(
        PlaneBulletType.Trace,
        bulletParams,
        this
      );

      this.bulletBoxList.push(bullet1);
    }
  }

  updateAttackerPos() {
    const planePos = this.planeEnemy.getPlanePos();
    this.attackerX = planePos.x;
    this.attackerY = planePos.y;
  }

  // 更新编队中的敌人位置
  updateEnemyPos() {
    if (!this.planeBody) return;
    for (let i = 0; i < this.planeBody.enemyList.length; i++) {
      const enemy = this.planeBody.enemyList[i];
      const vec = new Vector2(enemy.cx, enemy.cy);
      vec.applyMatrix3(this.matrix);
      const bullet = this.bulletBoxList[i];
      bullet.updatePos(vec.x, vec.y);
    }
  }

  // 更新编队 世界坐标
  updateWorldPos() {
    this.unitX = this.matrix.elements[6];
    this.unitY = this.matrix.elements[7];
  }

  isHitUnit(bullet: PlaneBullet): HitInfo | null {
    if (!this.planeBody || !this.planeBody.enable) return null;
    const {
      bulletX: bx,
      bulletY: by,
      combat,
      bulletWidth,
      bulletHeight,
    } = bullet.params;

    for (let i = 0; i < this.planeBody.enemyList.length; i++) {
      const enemy = this.planeBody.enemyList[i];
      const { cx, cy, w, h, health, dead } = enemy;
      if (dead) continue;
      const vec2 = new Vector2(cx, cy);
      vec2.applyMatrix3(this.matrix);
      const halfW = w / 2 + bulletWidth / 2;
      const halfH = h / 2 + bulletHeight / 2;

      const invert = this.matrix.clone().invert();
      const vec = new Vector2(bx, by);
      vec.applyMatrix3(invert);

      if (Math.abs(cx - vec.x) < halfW && Math.abs(cy - vec.y) < halfH) {
        const newHealth = health - combat;
        enemy.health = newHealth;
        if (newHealth <= 0) {
          enemy.dead = true;
          const bullet = this.bulletBoxList[i];
          bullet.stopBullet();
        }
        return {
          x: vec2.x,
          y: vec2.y,
          score: this.score,
          dead: enemy.dead,
        };
      }
    }

    return null;
  }

  beforeRender(){
    const { speedX } = this;
    this.matrix.translate(speedX, 0);
    this.updateAttackerPos();
    this.updateEnemyPos();
  }

  render(ctx: CanvasRenderingContext2D) {
    super.render(ctx);
    this.updateWorldPos()
  }

  invisible() {
    // 判断当前编队是否在屏幕内
    const { unitWidth, canvasHeight, canvasWidth } = this;

    const w = unitWidth;
    const posX = this.matrix.elements[6];
    const posY = this.matrix.elements[7];

    const h = Math.abs(Math.sin(this.config.angle) * w);

    if (
      posX < 0 - w / 2 ||
      posX > canvasWidth + w / 2 ||
      posY < -h ||
      posY > canvasHeight + h
    ) {
      this.destroy();
    } else {
    }
  }

  removeUnit(){
    this.planeEnemy.removeSquadron(this);
  }
}
