import type { MiniFly } from '../..';
import type {
  IMiniActParams,
  IMiniGam,
  IMiniGameParams,
} from '../../../../../type';
import {
  IMiniPlaneEffectType,
  MiniPlaneEnemyType,
  type IMiniSquadronConfig,
  type IBigEnemyConfig,
} from '../../type';
import type { PlaneBullet } from '../attacker/planeBullet';
import { PlaneEnemyBullet } from './planeEnemyBullet';
import { PlaneEnemyUnit } from './planeEnemyUnit';
import { PlaneEnemySquadron } from './squadron';
import { enemySquadronConfig, bigEnemyConfig } from '../../config';
import { BigEnemyUnit } from './bigUnit';
export class PlaneEnemy implements IMiniGam {
  miniFly: MiniFly;
  gameParams: IMiniGameParams;

  // 所有敌人列表
  enemyList: PlaneEnemyUnit[] = [];

  // 子弹列表
  bulletList: PlaneEnemyBullet[] = [];

  // 编队
  squadron: PlaneEnemySquadron[] = [];

  // 大敌机
  bigEnemyList: BigEnemyUnit[] = [];

  constructor(params: IMiniGameParams, miniFly: MiniFly) {
    this.miniFly = miniFly;
    this.gameParams = params;
    for (let i = 0; i < 10; i++) {
      this.spawnEnemy();
    }

    this.buildSquadron();
    this.buildBigEnemy();
  }

  buildSquadron() {
    const c1 = JSON.parse(
      JSON.stringify(enemySquadronConfig)
    ) as IMiniSquadronConfig;
    const c2 = JSON.parse(
      JSON.stringify(enemySquadronConfig)
    ) as IMiniSquadronConfig;
    const c3 = JSON.parse(
      JSON.stringify(enemySquadronConfig)
    ) as IMiniSquadronConfig;
    const c4 = JSON.parse(
      JSON.stringify(enemySquadronConfig)
    ) as IMiniSquadronConfig;
    c1.angle = Math.PI / 6;
    c1.enterHeight = 350;
    c2.angle = -Math.PI / 6;
    c2.direction = 'l';
    c2.enterHeight = 50;
    c2.enterHeight = 350;

    c3.angle = -Math.PI / 6;
    c3.enterHeight = 50;
    c4.angle = Math.PI / 6;
    c4.direction = 'l';
    c4.enterHeight = 50;
    this.squadron.push(new PlaneEnemySquadron(c1, this));
    this.squadron.push(new PlaneEnemySquadron(c2, this));
    this.squadron.push(new PlaneEnemySquadron(c3, this));
    this.squadron.push(new PlaneEnemySquadron(c4, this));
  }

  buildBigEnemy() {
    const bc1 = JSON.parse(JSON.stringify(bigEnemyConfig)) as IBigEnemyConfig;
    bc1.x = 60;
    bc1.targetHeight = 100;
    const b1 = new BigEnemyUnit(this, bc1);
    this.bigEnemyList.push(b1);

    const bc2 = JSON.parse(JSON.stringify(bigEnemyConfig)) as IBigEnemyConfig;
    bc2.x = 400;
    bc2.targetHeight = 100;
    const b2 = new BigEnemyUnit(this, bc2);
    this.bigEnemyList.push(b2);
  }

  render(ctx: CanvasRenderingContext2D) {
    // 绘制逻辑待优化:相同敌机 或者相同的子弹可否一笔绘制

    for (let i = 0; i < this.bigEnemyList.length; i++) {
      this.bigEnemyList[i].render(ctx);
    }

    return;
    for (let i = 0; i < this.squadron.length; i++) {
      this.squadron[i].render(ctx);
    }
    for (let i = 0; i < this.enemyList.length; i++) {
      if (this.enemyList[i]) {
        this.enemyList[i].render(ctx);
      }
    }
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

  // 判断是否命中普通敌机
  isHitEnemy(bullet: PlaneBullet) {
    for (let i = 0; i < this.enemyList.length; i++) {
      if (this.enemyList[i]) {
        if (this.enemyList[i].isHit(bullet)) {
          this.enemyList[i].updateHp(bullet);
          const dead = this.enemyList[i].isDead();
          let score = 0;
          if (dead) {
            // 敌机死亡
            score = this.enemyList[i].enemyUnit.deadScore;
            const enemyCenterArr = this.enemyList[i].getPos();
            this.miniFly.createEffect(
              IMiniPlaneEffectType.EXPLODE,
              enemyCenterArr[0],
              enemyCenterArr[1]
            );

            // 依据各种条件，生成装备
            this.miniFly.updateToolBox(this.enemyList[i]);
            // 需要将敌机从列表中移除
            this.removeUnit(this.enemyList[i]);
          } else {
            // 敌机未死亡
            score = this.enemyList[i].enemyUnit.score;
          }

          this.miniFly.updateScore(score);

          return true;
        }
      }
    }

    if (this.isHitSquadron(bullet)) {
      return true;
    }

    if (this.isHitBigEnemy(bullet)) {
      return true;
    }

    return false;
  }

  // 判断是否命中编队
  isHitSquadron(bullet: PlaneBullet) {
    // 判断是否命中编队
    for (let i = 0; i < this.squadron.length; i++) {
      const res = this.squadron[i].isHit(bullet);
      if (res.flag) {
        if (res.isDead) {
          // 敌机死亡
          this.miniFly.createEffect(IMiniPlaneEffectType.EXPLODE, res.x, res.y);
        }

        this.miniFly.updateScore(res.score);
        return true;
      }
    }

    return false;
  }

  // 判断是否命中大头兵
  isHitBigEnemy(bullet: PlaneBullet) {
    // 判断是否命中编队
    for (let i = 0; i < this.bigEnemyList.length; i++) {
      const res = this.bigEnemyList[i].isHit(bullet);
      if (res.flag) {
        if (res.isDead) {
          // 敌机死亡
          this.miniFly.createEffect(IMiniPlaneEffectType.DAMAGE, res.x, res.y);
        }else{
          // 敌机未死亡
          this.miniFly.createEffect(IMiniPlaneEffectType.DAMAGE, res.x, res.y);

        }

        this.miniFly.updateScore(res.score);
        return true;
      }
    }

    return false;
  }

  removeBullet(bullet: PlaneEnemyBullet) {
    const ind = this.bulletList.indexOf(bullet);
    if (ind > -1) {
      this.bulletList.splice(ind, 1);
    }
  }

  // 将屏幕中所有的敌机扣一条血，并移除所有子弹
  clearEnemy() {
    for (let i = 0; i < this.enemyList.length; i++) {
      if (this.enemyList[i]) {
        this.enemyList[i].updateHpByNum(1);
        const dead = this.enemyList[i].isDead();
        let score = 0;
        const enemyCenterArr = this.enemyList[i].getPos();
        this.miniFly.createEffect(
          IMiniPlaneEffectType.EXPLODE,
          enemyCenterArr[0],
          enemyCenterArr[1]
        );
        if (dead) {
          // 敌机死亡
          score = this.enemyList[i].enemyUnit.deadScore;
          this.removeUnit(this.enemyList[i]);
        } else {
          // 敌机未死亡
          score = this.enemyList[i].enemyUnit.score;
        }

        this.miniFly.updateScore(score);
      }
    }

    this.bulletList = [];
  }

  // 获取战机的位置
  getPlanePos() {
    return this.miniFly.planeAttacker.getPos();
  }

  // 移除编队
  removeSquadron(squadron: PlaneEnemySquadron) {
    const ind = this.squadron.indexOf(squadron);
    if (ind > -1) {
      this.squadron.splice(ind, 1);
    }
  }

  actionStart = (p: IMiniActParams) => {};
  actionEnd = (p: IMiniActParams) => {};
  actionDoing = (p: IMiniActParams) => {};
}
