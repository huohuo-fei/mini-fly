import type { MiniFly } from '../..';
import type {
  IMiniActParams,
  IMiniGam,
  IMiniGameParams,
} from '../../../../../type';
import { IMiniPlaneEffectType, MiniPlaneEnemyType } from '../../type';
import type { PlaneBullet } from '../attacker/planeBullet';
import { PlaneEnemyBullet } from './planeEnemyBullet';
import { PlaneEnemyUnit } from './planeEnemyUnit';
export class PlaneEnemy implements IMiniGam {
  miniFly: MiniFly;
  gameParams: IMiniGameParams;

  // 所有敌人列表
  enemyList: PlaneEnemyUnit[] = [];

  // 子弹列表
  bulletList: PlaneEnemyBullet[] = [];

  constructor(params: IMiniGameParams,miniFly:MiniFly) {
    this.miniFly = miniFly;
    this.gameParams = params;
    for (let i = 0; i < 10; i++) {
      this.spawnEnemy();
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    // 绘制逻辑待优化:相同敌机 或者相同的子弹可否一笔绘制
    ctx.beginPath()
    for (let i = 0; i < this.enemyList.length; i++) {
      if (this.enemyList[i]) {
        this.enemyList[i].render(ctx);
      }
    }
    ctx.beginPath()
    for (let i = 0; i < this.bulletList.length; i++) {
      if (this.bulletList[i]) {
        this.bulletList[i].render(ctx);
      }
    }
  }

  // 生成敌机
  spawnEnemy() {
    const { canvasWidth, canvasHeight } = this.gameParams;
    let type: any = Math.floor(Math.random() * 3);
    // let type: any = 0;

    if (type == 0) {
      type = MiniPlaneEnemyType.LEVEL1;
    } else if (type == 1) {
      type = MiniPlaneEnemyType.LEVEL2;
    } else if (type == 2) {
      type = MiniPlaneEnemyType.LEVEL3;
    }
    const unit = new PlaneEnemyUnit(type, canvasWidth, canvasHeight, this);

    this.enemyList.push(unit);
  }

  // 添加子弹
  addBullet(type: MiniPlaneEnemyType, planeEnemyUnit: PlaneEnemyUnit) {
    const bulletInstance = new PlaneEnemyBullet(type, planeEnemyUnit);
    this.bulletList.push(bulletInstance);
  }

  // 移除敌机 todo:现在同屏敌机少，后续优化
  removeUnit(unit: PlaneEnemyUnit) {
    const ind = this.enemyList.indexOf(unit);
    if (ind > -1) {
      this.enemyList.splice(ind, 1);

      // 此时随机生成一个新的敌机
      this.spawnEnemy();
    }
  }

  // 判断是否命中敌机
  isHitEnemy(bullet:PlaneBullet){
    for (let i = 0; i < this.enemyList.length; i++) {
      if (this.enemyList[i]) {
        if (this.enemyList[i].isHit(bullet)) {
          this.enemyList[i].updateHp(bullet);
          const dead = this.enemyList[i].isDead();
          let score = 0;
          if(dead){
            // 敌机死亡
            score = this.enemyList[i].enemyUnit.deadScore;
            const enemyCenterArr = this.enemyList[i].getPos()
            this.miniFly.createEffect(IMiniPlaneEffectType.EXPLODE,enemyCenterArr[0],enemyCenterArr[1]);
            // 需要将敌机从列表中移除
            this.removeUnit(this.enemyList[i]);
          }else{
            // 敌机未死亡
            score = this.enemyList[i].enemyUnit.score;
          }

          this.miniFly.updateScore(score);

          return true;
        }
      }
    }

    return false

  }

  removeBullet(bullet: PlaneEnemyBullet) {
    const ind = this.bulletList.indexOf(bullet);
    if (ind > -1) {
      this.bulletList.splice(ind, 1);
    }
  }

  actionStart = (p: IMiniActParams) => {};
  actionEnd = (p: IMiniActParams) => {};
  actionDoing = (p: IMiniActParams) => {};
}
