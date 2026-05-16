import type {
  IMiniActParams,
  IMiniGam,
  IMiniPlaneEnemy,
  IMiniPlaneEnemyInfo,
} from '../../../../type';
import { MiniPlaneEnemyType } from '../../../../utils/common';
import { enemyConfig1, enemyConfig2, enemyConfig3 } from '../config';
import type { PlaneEnemy } from './planeEnemy';

export class PlaneEnemyUnit implements IMiniGam {
  enemyUnit: IMiniPlaneEnemy;
  lastTime: number;
  canvasWidth: number;
  canvasHeight: number;
  type: MiniPlaneEnemyType;
  enemyInfo: IMiniPlaneEnemyInfo;
  planeEnemy: PlaneEnemy;

  constructor(
    type: MiniPlaneEnemyType,
    canvasWidth: number,
    canvasHeight: number,
    planeEnemy:PlaneEnemy
  ) {
    this.planeEnemy = planeEnemy;
    this.enemyInfo = {
      type,
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    };
    this.lastTime = Date.now();
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.type = type;
    this.enemyUnit = this.buildEnemyUnit();
  }

  buildEnemyUnit() {
    const x = 20 + Math.random() * (this.canvasWidth - 50);
    let eConfig: IMiniPlaneEnemy = enemyConfig1;
    if (this.type === MiniPlaneEnemyType.LEVEL2) {
      eConfig = enemyConfig2;
    } else if (this.type === MiniPlaneEnemyType.LEVEL3) {
      eConfig = enemyConfig3;
    } else {
    }
    eConfig = JSON.parse(JSON.stringify(eConfig));
    eConfig.x = x;
    this.enemyInfo.x = x;
    this.enemyInfo.y = eConfig.y;
    this.enemyInfo.w = eConfig.w;
    this.enemyInfo.h = eConfig.h;
    return eConfig;
  }
  updatePos() {
    const temp = Date.now();
    const diff = temp - this.lastTime;
    this.lastTime = temp;
    this.enemyUnit.y += (this.enemyUnit.speedY * diff) / 100;
  }

  updateSate() {
    if (this.enemyUnit.y > this.canvasHeight) {
      // 此时 需要移除当前单位
      this.planeEnemy.removeUnit(this);
    }
  }
  /**
   * 渲染敌方单位
   * @param ctx Canvas的2D渲染上下文
   */
  render(ctx: CanvasRenderingContext2D) {
    const e = this.enemyUnit;
    ctx.strokeStyle = e.color;
    ctx.shadowBlur = 6;
    ctx.shadowColor = 'red';
    ctx.strokeRect(e.x, e.y, e.w, e.h);
    this.updatePos();
    this.updateSate()
  }
  actionStart = (p: IMiniActParams) => {};
  actionEnd = (p: IMiniActParams) => {};
  actionDoing = (p: IMiniActParams) => {};
}
