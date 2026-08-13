import type { MiniFly } from '../..';
import type { IMiniGameParams } from '../../../../../type';
import {
  IMiniPlaneEffectType,
  type IBigEnemyConfig,
  type IBossConfig,
  type ISquadronConfig,
  EnemyType,
  type IMiniPlaneEnemy,
} from '../../type';
import { PlaneEnemySquadron } from './squadron';
import { BigEnemyUnit } from './bigUnit';
import { EnemyBoss } from './boss';
import type { PlaneBullet } from '../../base/planeBullet';
import { EnemyJoker } from './joker';
import type { PlaneUnitParams } from '../../base/type';
import type { PlaneUnit } from '../../base/planeUnit';
import { DamageValueNumber } from '../../config';
import { MiniBase } from '../../../../../miniBase/miniBase';
import { MINI_GAME_OVER, type MiniScreen } from '../../../../..';
import { MiniFlyState } from '../../state/flyState';
export class PlaneEnemy extends MiniBase {
  miniFly: MiniFly;
  screen: MiniScreen;
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

  // 缓存的需要删除的敌机索引
  enemyDelMap: { [EnemyType: string]: number[] } = {
    [EnemyType.JOKER]: [],
    [EnemyType.SQUADRON]: [],
    [EnemyType.BIG]: [],
    [EnemyType.BOSS]: [],
  };

  constructor(params: IMiniGameParams, miniFly: MiniFly) {
    super();
    this.miniFly = miniFly;
    this.screen = miniFly.screen;
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
    this.enemyMap[EnemyType.BIG].push(bigEnemy);
  }

  buildBoss(info: any) {
    const unitParams = info.params as PlaneUnitParams;
    const config = info.config as IBossConfig;

    const b = new EnemyBoss(unitParams, config, this);
    this.enemyMap[EnemyType.BOSS].push(b);
  }

  // 剔除del 敌机 只需要在update 里面
  update(deltaTime: number): void {
    for (const key in this.enemyMap) {
      const list = this.enemyMap[key];
      const delList = this.enemyDelMap[key];
      for (let i = delList.length - 1; i >= 0; i--) {
        list.splice(delList[i], 1);
      }
      this.enemyDelMap[key] = [];
      for (let i = 0; i < list.length; i++) {
        const enemy = list[i];
        if (enemy) {
          // 渲染敌机
          enemy.update(deltaTime);
          this.miniFly.planeAttacker.checkHitByEnemyPlane(enemy);
        }
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    // 绘制逻辑待优化:相同敌机 或者相同的子弹可否一笔绘制
    for (const key in this.enemyMap) {
      const list = this.enemyMap[key];
      const delList = this.enemyDelMap[key];
      for (let i = delList.length - 1; i >= 0; i--) {
        list.splice(delList[i], 1);
      }
      this.enemyDelMap[key] = [];

      // if(key === EnemyType.SQUADRON){
      //   console.log('enemy list',list.length);
      // }
      for (let i = 0; i < list.length; i++) {
        const enemy = list[i];
        if (enemy) {
          // 渲染敌机
          enemy.render(ctx);
          this.miniFly.planeAttacker.checkHitByEnemyPlane(enemy);
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
          this.miniFly.updateScore(hitInfo.score);
        } else {
          // boss未死亡
          this.miniFly.createEffect(
            IMiniPlaneEffectType.DAMAGE,
            hitInfo.x,
            hitInfo.y
          );
        }
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
          this.miniFly.updateScore(hitInfo.score);
        } else {
          // boss未死亡
          this.miniFly.createEffect(
            IMiniPlaneEffectType.DAMAGE,
            hitInfo.x,
            hitInfo.y
          );
        }

        return true;
      }
    }

    return false;
  }

  // 判断是否命中大头兵
  isHitBigEnemy(bullet: PlaneBullet) {
    const bigEnemyList = this.enemyMap[EnemyType.BIG];

    for (let i = 0; i < bigEnemyList.length; i++) {
      const hitInfo = bigEnemyList[i].isHitUnit(bullet);
      if (hitInfo) {
        // 命中
        if (hitInfo.dead) {
          // boss死亡
          this.miniFly.createEffect(
            IMiniPlaneEffectType.EXPLODE,
            hitInfo.x,
            hitInfo.y
          );
          this.miniFly.updateScore(hitInfo.score);
        } else {
          // boss未死亡
          this.miniFly.createEffect(
            IMiniPlaneEffectType.DAMAGE,
            hitInfo.x,
            hitInfo.y
          );
        }

        return true;
      }
    }

    return false;
  }

  // 判断是否命中boss
  isHitBoss(bullet: PlaneBullet) {
    const bossList = this.enemyMap[EnemyType.BOSS];
    for (let i = 0; i < bossList.length; i++) {
      const hitInfo = bossList[i].isHitUnit(bullet);
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
    for (const key in this.enemyMap) {
      const enemyList = this.enemyMap[key];

      for (const enemy of enemyList) {
        if (enemy.planeBody?.enable) {
          this.miniFly.createEffect(
            IMiniPlaneEffectType.EXPLODE,
            enemy.unitX,
            enemy.unitY
          );
          enemy.damageWithScore(DamageValueNumber);
        }
      }
    }
    // console.log('子弹清屏 就不再更新分数了');
    this.miniFly.planeBullets.celarAll();
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
      const delArr = this.enemyDelMap[EnemyType.JOKER];
      if (!delArr.length || !delArr.includes(ind)) {
        delArr.push(ind);
        this.removeEnemyByType(EnemyType.JOKER);
      }
    }
  }

  removeBoss(unit: EnemyBoss) {
    const bossList = this.enemyMap[EnemyType.BOSS];
    const ind = bossList.indexOf(unit);
    if (ind > -1) {
      const delArr = this.enemyDelMap[EnemyType.BOSS];
      if (!delArr.length || !delArr.includes(ind)) {
        delArr.push(ind);
        this.removeEnemyByType(EnemyType.BOSS);
      }
    }
  }

  // 移除编队
  removeSquadron(squadron: PlaneEnemySquadron) {
    const squadronList = this.enemyMap[EnemyType.SQUADRON];
    const ind = squadronList.indexOf(squadron);
    if (ind > -1) {
      const delArr = this.enemyDelMap[EnemyType.SQUADRON];
      if (!delArr.length || !delArr.includes(ind)) {
        delArr.push(ind);
        this.removeEnemyByType(EnemyType.SQUADRON);
      }
    }
  }

  // 移除大头兵
  removeBigEnemy(bigEnemy: BigEnemyUnit) {
    const bigList = this.enemyMap[EnemyType.BIG];
    const ind = bigList.indexOf(bigEnemy);
    if (ind > -1) {
      const delArr = this.enemyDelMap[EnemyType.BIG];
      if (!delArr.length || !delArr.includes(ind)) {
        delArr.push(ind);
        this.removeEnemyByType(EnemyType.BIG);
      }
    }
  }

  removeEnemyByType(type: EnemyType) {
    this.miniFly.removeControlEnemyByType(type);
  }

  // 击杀普通的敌机后 概率生成工具
  generateTool(enemy: PlaneUnit) {
    this.miniFly.updateToolBox(enemy);
  }

  requestEffect(effectType: IMiniPlaneEffectType, x: number, y: number) {
    this.miniFly.createEffect(effectType, x, y);
  }

  // 获取当前所有的敌机数量
  getEnemyCount() {
    let count = 0;
    for (const key in this.enemyMap) {
      const enemyList = this.enemyMap[key];
      count += enemyList.length;
    }

    return count;
  }

  // boss 死亡后将剩余的敌机全部移除
  removeEnemyAfterBossDead() {
    // 先终止控制
    this.miniFly.planeControl.enable = false
    for (const key in this.enemyMap) {
      const enemyList = this.enemyMap[key];
      for (const enemy of enemyList) {
        if (enemy.planeBody?.enable) {
          this.miniFly.createEffect(
            IMiniPlaneEffectType.EXPLODE,
            enemy.unitX,
            enemy.unitY
          );
        }
      }
      this.enemyMap[key] = [];
    }

    this.miniFly.createEffect(IMiniPlaneEffectType.TEXT,0,0,{
      text:'游戏胜利',
      type:'suc'
    },() => {
      this.gameOver()
    })

  }

  // boss 出逃
  bossBack(){
    // 获取到boss
    const bossList = this.enemyMap[EnemyType.BOSS];
    const boss = bossList[0]
    if(boss){
      (boss as EnemyBoss).bossRetreat()
    }

  }

  gameOver() {
    this.screen.emit(MINI_GAME_OVER, {
      score: MiniFlyState.score,
      time: MiniFlyState.duration,
      des:'游戏结束'
    });
  }
}
