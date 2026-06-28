import type { MiniFly } from '../..';
import type {
  IMiniActParams,
  IMiniGam,
  IMiniGameParams,
} from '../../../../../type';
import {
  IMiniPlaneEffectType,
  type IBigEnemyConfig,
  type IBossConfig,
  type ISquadronConfig,
  EnemyType,
  type IMiniPlaneEnemy,
} from '../../type';
import { PlaneEnemySquadron } from './squadron';
import { bigEnemyConfig, bossConfig } from '../../config';
import { BigEnemyUnit } from './bigUnit';
import { EnemyBoss } from './boss';
import type { PlaneBullet } from '../../base/planeBullet';
import { EnemyJoker } from './joker';
import type { PlaneUnitParams } from '../../base/type';
import type { PlaneUnit } from '../../base/planeUnit';
export class PlaneEnemy implements IMiniGam {
  miniFly: MiniFly;
  gameParams: IMiniGameParams;

  // 所有类型的敌机
  enemyMap: { [EnemyType: string]: PlaneUnit[] } = {
    [EnemyType.JOKER]: [],
    [EnemyType.SQUADRON]: [],
    [EnemyType.BIG]: [],
    [EnemyType.BOSS]: [],
  };
  // 大敌机
  bigEnemyList: BigEnemyUnit[] = [];

  // boss
  bossList: EnemyBoss[] = [];

  constructor(params: IMiniGameParams, miniFly: MiniFly) {
    this.miniFly = miniFly;
    this.gameParams = params;
  }

  buildEnemyByConfig(config: any) {
    const type = config.type as EnemyType;

    switch (type) {
      case EnemyType.JOKER:
        this.buildJoker(config);
        return;
      case EnemyType.SQUADRON:
        this.buildSquadron(config);
        return;
      case EnemyType.BIG:
        this.buildBigEnemy(config);
        return;
      case EnemyType.BOSS:
        this.buildBoss(config);
        return;
    }
  }

  buildJoker(info: any) {
    const unitParams = info.params as PlaneUnitParams;
    const config = info.config as IMiniPlaneEnemy;
    const joker = new EnemyJoker(unitParams, config.type, this);
    this.enemyMap[EnemyType.JOKER].push(joker);
  }

  buildSquadron(info: any) {
    const unitParams = info.params as PlaneUnitParams;
    const config = info.config as ISquadronConfig;
    const squadron = new PlaneEnemySquadron(unitParams, config, this);
    this.enemyMap[EnemyType.SQUADRON].push(squadron);
  }

  buildBigEnemy(info: any) {
    const unitParams = info.params as PlaneUnitParams;
    const config = info.config as IBigEnemyConfig;

    const bigEnemy = new BigEnemyUnit(unitParams, config, this);
    this.bigEnemyList.push(bigEnemy);
    this.enemyMap[EnemyType.BIG].push(bigEnemy);

    return;

    const bc = JSON.parse(JSON.stringify(bigEnemyConfig)) as IBigEnemyConfig;
    bc.x = 60;
    bc.targetHeight = 100;
    const b1 = new BigEnemyUnit(
      {
        unitWidth: 0,
        unitHeight: 0,
        unitX: 0,
        unitY: 0,
        speedX: 1,
        speedY: 1,
        shootCooldown: 600,
        canvasHeight: this.gameParams.canvasHeight,
        canvasWidth: this.gameParams.canvasWidth,
        health: 10,
        score: 200,
      },
      bc,
      this
    );
    this.bigEnemyList.push(b1);

    bc.x = 400;
    const b2 = new BigEnemyUnit(
      {
        unitWidth: 0,
        unitHeight: 0,
        unitX: 0,
        unitY: 0,
        speedX: 1,
        speedY: 1,
        shootCooldown: 600,
        canvasHeight: this.gameParams.canvasHeight,
        canvasWidth: this.gameParams.canvasWidth,
        health: 100,
        score: 200,
      },
      bc,
      this
    );
    this.bigEnemyList.push(b2);
  }

  buildBoss(info: any) {
    const unitParams = info.params as PlaneUnitParams;
    const config = info.config as IBossConfig;

    const b = new EnemyBoss(unitParams, config);
    this.bossList.push(b);
    this.enemyMap[EnemyType.BOSS].push(b);

    return;

    const b1 = JSON.parse(JSON.stringify(bossConfig)) as IBossConfig;

    const cx = this.gameParams.canvasWidth / 2;
    const boss = new EnemyBoss(
      {
        unitWidth: 80,
        unitHeight: 60,
        unitX: cx,
        unitY: 0,
        speedX: 0,
        speedY: 0,
        shootCooldown: 10,
        canvasHeight: this.gameParams.canvasHeight,
        canvasWidth: this.gameParams.canvasWidth,
        health: 1000,
        score: 2000,
      },
      b1
    );
    this.bossList.push(boss);
  }

  render(ctx: CanvasRenderingContext2D) {
    // 绘制逻辑待优化:相同敌机 或者相同的子弹可否一笔绘制

    for (const key in this.enemyMap) {
      const list = this.enemyMap[key];
      // if (key === EnemyType.JOKER) {
      //   console.log(list.length,'joker');
      // }
      for (let i = 0; i < list.length; i++) {
        if (list[i]) {
          list[i].render(ctx);
        }
      }
    }
  }

  // 判断是否命中普通敌机
  isHitEnemy(bullet: PlaneBullet) {
    if (this.isHitJoker(bullet)) {
      return true;
    }

    if (this.isHitSquadron(bullet)) {
      return true;
    }

    if (this.isHitBigEnemy(bullet)) {
      return true;
    }

    if (this.isHitBoss(bullet)) {
      return true;
    }

    return false;
  }

  // 判断是否命中普通的joker
  isHitJoker(bullet: PlaneBullet) {
    const jokerList = this.enemyMap[EnemyType.JOKER];
    for (let i = 0; i < jokerList.length; i++) {
      const hitInfo = jokerList[i].isHitUnit(bullet);
      if (hitInfo) {
        // 命中
        if (hitInfo.dead) {
          // boss死亡
          this.miniFly.createEffect(
            IMiniPlaneEffectType.EXPLODE,
            hitInfo.x,
            hitInfo.y
          );
        } else {
          // boss未死亡
          this.miniFly.createEffect(
            IMiniPlaneEffectType.DAMAGE,
            hitInfo.x,
            hitInfo.y
          );
        }

        this.miniFly.updateScore(hitInfo.score);
        return true;
      }
    }

    return false;
  }

  // 判断是否命中编队
  isHitSquadron(bullet: PlaneBullet) {
    
    const squadronList = this.enemyMap[EnemyType.SQUADRON];
    // 判断是否命中编队
    for (let i = 0; i < squadronList.length; i++) {
      const hitInfo = squadronList[i].isHitUnit(bullet);
      if (hitInfo) {
        // 命中
        if (hitInfo.dead) {
          // boss死亡
          this.miniFly.createEffect(
            IMiniPlaneEffectType.EXPLODE,
            hitInfo.x,
            hitInfo.y
          );
        } else {
          // boss未死亡
          this.miniFly.createEffect(
            IMiniPlaneEffectType.DAMAGE,
            hitInfo.x,
            hitInfo.y
          );
        }

        this.miniFly.updateScore(hitInfo.score);
        return true;
      }
    }

    return false;
  }

  // 判断是否命中大头兵
  isHitBigEnemy(bullet: PlaneBullet) {
    for (let i = 0; i < this.bigEnemyList.length; i++) {
      const hitInfo = this.bigEnemyList[i].isHitUnit(bullet);
      if (hitInfo) {
        // 命中
        if (hitInfo.dead) {
          // boss死亡
          this.miniFly.createEffect(
            IMiniPlaneEffectType.EXPLODE,
            hitInfo.x,
            hitInfo.y
          );
        } else {
          // boss未死亡
          this.miniFly.createEffect(
            IMiniPlaneEffectType.DAMAGE,
            hitInfo.x,
            hitInfo.y
          );
        }

        this.miniFly.updateScore(hitInfo.score);
        return true;
      }
    }

    return false;
  }

  // 判断是否命中boss
  isHitBoss(bullet: PlaneBullet) {
    for (let i = 0; i < this.bossList.length; i++) {
      const hitInfo = this.bossList[i].isHitUnit(bullet);
      if (hitInfo) {
        // 命中
        if (hitInfo.dead) {
          // boss死亡
          this.miniFly.createEffect(
            IMiniPlaneEffectType.EXPLODE,
            hitInfo.x,
            hitInfo.y
          );
        } else {
          // boss未死亡
          this.miniFly.createEffect(
            IMiniPlaneEffectType.DAMAGE,
            hitInfo.x,
            hitInfo.y
          );
        }

        this.miniFly.updateScore(hitInfo.score);
        return true;
      }
    }

    return false;
  }

  // 将屏幕中所有的敌机扣一条血，并移除所有子弹
  clearEnemy() {
    // for (let i = 0; i < this.enemyList.length; i++) {
    //   if (this.enemyList[i]) {
    //     this.enemyList[i].updateHpByNum(1);
    //     const dead = this.enemyList[i].isDead();
    //     let score = 0;
    //     const enemyCenterArr = this.enemyList[i].getPos();
    //     this.miniFly.createEffect(
    //       IMiniPlaneEffectType.EXPLODE,
    //       enemyCenterArr[0],
    //       enemyCenterArr[1]
    //     );
    //     if (dead) {
    //       // 敌机死亡
    //       score = this.enemyList[i].enemyUnit.deadScore;
    //       this.removeUnit(this.enemyList[i]);
    //     } else {
    //       // 敌机未死亡
    //       score = this.enemyList[i].enemyUnit.score;
    //     }
    //     this.miniFly.updateScore(score);
    //   }
    // }
    // this.bulletList = [];
  }

  // 获取战机的位置
  getPlanePos() {
    return this.miniFly.planeAttacker.getPos();
  }

  // 移除敌机 todo:现在同屏敌机少，后续优化
  removeJoker(unit: EnemyJoker) {
    const jokerList = this.enemyMap[EnemyType.JOKER];
    const ind = jokerList.indexOf(unit);
    if (ind > -1) {
      jokerList.splice(ind, 1);
      this.removeEnemyByType(EnemyType.JOKER);
    }
  }

  // 移除编队
  removeSquadron(squadron: PlaneEnemySquadron) {
    const squadronList = this.enemyMap[EnemyType.SQUADRON];
    const ind = squadronList.indexOf(squadron);
    if (ind > -1) {
      squadronList.splice(ind, 1);
      this.removeEnemyByType(EnemyType.SQUADRON);

    }
  }

  // 移除大头兵
  removeBigEnemy(bigEnemy: BigEnemyUnit) {
    const ind = this.bigEnemyList.indexOf(bigEnemy);
    if (ind > -1) {
      this.bigEnemyList.splice(ind, 1);
      this.removeEnemyByType(EnemyType.BIG);

    }
  }

  removeEnemyByType(type: EnemyType) {
    this.miniFly.removeControlEnemyByType(type);
  }

  requestEffect(effectType: IMiniPlaneEffectType, x: number, y: number) {
    this.miniFly.createEffect(effectType, x, y);
  }

  actionStart = (p: IMiniActParams) => {};
  actionEnd = (p: IMiniActParams) => {};
  actionDoing = (p: IMiniActParams) => {};
}
