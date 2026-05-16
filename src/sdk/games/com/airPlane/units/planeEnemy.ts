import type {
  IMiniActParams,
  IMiniGam,
  IMiniGameParams,
} from '../../../../type';
import { MiniPlaneEnemyType } from '../../../../utils/common';
import { PlaneEnemyUnit } from './planeEnemyUnit';
export class PlaneEnemy implements IMiniGam {
  private PLAYER_WIDTH = 30;
  private PLAYER_HEIGHT = 30;
  attackerX: number = 0;
  attackerY: number = 0;
  gameParams: IMiniGameParams;

  // 所有敌人列表
  enemyList: PlaneEnemyUnit[] = [];

  constructor(params: IMiniGameParams) {
    this.gameParams = params;
    for (let i = 0; i < 10; i++) {
      this.spawnEnemy();
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    // 绘制
    for (let i = 0; i < this.enemyList.length; i++) {
      if (this.enemyList[i]) {
        this.enemyList[i].render(ctx);
      }
    }
  }

  spawnEnemy() {
    const { canvasWidth, canvasHeight } = this.gameParams;
    let type: any = Math.floor(Math.random() * 3);

    if (type == 0) {
      type = MiniPlaneEnemyType.LEVEL1;
    } else if (type == 1) {
      type = MiniPlaneEnemyType.LEVEL2;
    } else if (type == 2) {
      type = MiniPlaneEnemyType.LEVEL3;
    }
    const unit = new PlaneEnemyUnit(type, canvasWidth, canvasHeight,this);

    this.enemyList.push(unit);
  }

  // 移除敌机 todo:现在同屏敌机少，后续优化
  removeUnit(unit: PlaneEnemyUnit) {
    const ind = this.enemyList.indexOf(unit);
    console.log('ind', ind);
    
    if (ind > -1) {
      this.enemyList.splice(ind, 1);

      // 此时随机生成一个新的敌机
      this.spawnEnemy();
    }
  }

  actionStart = (p: IMiniActParams) => {};
  actionEnd = (p: IMiniActParams) => {};
  actionDoing = (p: IMiniActParams) => {};
}
