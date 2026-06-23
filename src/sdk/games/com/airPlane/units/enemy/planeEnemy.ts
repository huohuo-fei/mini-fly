import type { MiniFly } from '../..';
import type {
  IMiniActParams,
  IMiniGam,
  IMiniGameParams,
} from '../../../../../type';
import {
  IMiniPlaneEffectType,
  MiniPlaneEnemyType,
  type IBigEnemyConfig,
  type IBossConfig,
  type ISquadronConfig,
} from '../../type';
import { PlaneEnemySquadron } from './squadron';
import { bigEnemyConfig, bossConfig, planeSquadronConfig } from '../../config';
import { BigEnemyUnit } from './bigUnit';
import { EnemyBoss } from './boss';
import type { PlaneBullet } from '../../base/planeBullet';
import { EnemyJoker } from './joker';
export class PlaneEnemy implements IMiniGam {
  miniFly: MiniFly;
  gameParams: IMiniGameParams;

  // 所有普通敌人列表
  enemyList: EnemyJoker[] = [];

  // 编队
  squadron: PlaneEnemySquadron[] = [];

  // 大敌机
  bigEnemyList: BigEnemyUnit[] = [];

  // boss
  bossList: EnemyBoss[] = [];

  constructor(params: IMiniGameParams, miniFly: MiniFly) {
    this.miniFly = miniFly;
    this.gameParams = params;
    for (let i = 0; i < 10; i++) {
      this.spawnEnemy();
    }

    this.buildSquadron();
    this.buildBigEnemy();
    this.buildBoss();
  }

  buildSquadron() {
    const c1 = JSON.parse(
      JSON.stringify(planeSquadronConfig)
    ) as ISquadronConfig;

    const newS = new PlaneEnemySquadron(
      {
        unitWidth: 80,
        unitHeight: 60,
        unitX: 0,
        unitY: 0,
        speedX: 1,
        speedY: 1,
        shootCooldown: 10,
        canvasHeight: this.gameParams.canvasHeight,
        canvasWidth: this.gameParams.canvasWidth,
        health: 10,
        score: 100,
      },
      c1,
      this
    );

    this.squadron.push(newS);
  }

  buildBigEnemy() {
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

  buildBoss() {
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

    for (let i = 0; i < this.enemyList.length; i++) {
      if (this.enemyList[i]) {
        this.enemyList[i].render(ctx);
      }
    }
    return;

    for (let i = 0; i < this.bigEnemyList.length; i++) {
      this.bigEnemyList[i].render(ctx);
    }
    for (let i = 0; i < this.squadron.length; i++) {
      this.squadron[i].render(ctx);
    }
    return;

    for (let i = 0; i < this.bossList.length; i++) {
      this.bossList[i].render(ctx);
    }

    for (let i = 0; i < this.enemyList.length; i++) {
      if (this.enemyList[i]) {
        this.enemyList[i].render(ctx);
      }
    }
  }

  // 生成敌机
  spawnEnemy() {
    let type: any = Math.floor(Math.random() * 3);
    // let type: any = 0;

    if (type == 0) {
      type = MiniPlaneEnemyType.LEVEL1;
    } else if (type == 1) {
      type = MiniPlaneEnemyType.LEVEL2;
    } else if (type == 2) {
      type = MiniPlaneEnemyType.LEVEL3;
    }

    const joker = new EnemyJoker(
      {
        unitWidth: 80,
        unitHeight: 60,
        unitX: 0,
        unitY: 0,
        speedX: 0,
        speedY: 0,
        shootCooldown: 10,
        canvasHeight: this.gameParams.canvasHeight,
        canvasWidth: this.gameParams.canvasWidth,
        health: 1000,
        score: 2000,
      },
      type,
      this
    );
    this.enemyList.push(joker);
  }

  // 移除敌机 todo:现在同屏敌机少，后续优化
  removeJoker(unit: EnemyJoker) {
    const ind = this.enemyList.indexOf(unit);
    if (ind > -1) {
      this.enemyList.splice(ind, 1);
      // 此时随机生成一个新的敌机  todo 后续加游戏流程控制器 进行控制
      // this.spawnEnemy();
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
    for (let i = 0; i < this.enemyList.length; i++) {
      const hitInfo = this.enemyList[i].isHitUnit(bullet);
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
    // 判断是否命中编队
    for (let i = 0; i < this.squadron.length; i++) {
      const hitInfo = this.squadron[i].isHitUnit(bullet);
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

  // 移除编队
  removeSquadron(squadron: PlaneEnemySquadron) {
    const ind = this.squadron.indexOf(squadron);
    if (ind > -1) {
      this.squadron.splice(ind, 1);
    }
  }

  // 移除大头兵
  removeBigEnemy(bigEnemy: BigEnemyUnit) {
    const ind = this.bigEnemyList.indexOf(bigEnemy);
    if (ind > -1) {
      this.bigEnemyList.splice(ind, 1);
    }
  }

  requestEffect(effectType: IMiniPlaneEffectType, x: number, y: number) {
    this.miniFly.createEffect(effectType, x, y);
  }

  actionStart = (p: IMiniActParams) => {};
  actionEnd = (p: IMiniActParams) => {};
  actionDoing = (p: IMiniActParams) => {};
}
