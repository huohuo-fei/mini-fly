// 贯穿整个游戏的生命周期
// 依据 时间 分数 控制游戏内的各种行为

import type { MiniFly } from '../..';
import { PlaneBase } from '../../base/planeBase';
import type { PlaneWave } from '../../base/planeWave';
import { EnemyType } from '../../type';
import type { PlaneEnemy } from '../enemy/planeEnemy';
import {
  WAVE_1_CONFIG,
  WAVE_2_CONFIG,
} from '../wave/config';
import { Wave_1 } from '../wave/wave1';
import { Wave_2 } from '../wave/wave2';

export class PlaneControl extends PlaneBase {
  initFlag: boolean = false;

  minifly: MiniFly;
  planeEnemy: PlaneEnemy;

  // 游戏时间
  startTime: number = 0;
  gamingTime: number = 0;

  // 游戏分数
  currentScore: number = 0;

  // 当前画布敌机类型 数量
  unLockedEnemy: { [EnemyType: string]: number } = {
    [EnemyType.BIG]: 0,
    [EnemyType.JOKER]: 0,
    [EnemyType.SQUADRON]: 0,
    [EnemyType.BOSS]: 0,
  };

  // 波次结构树
  waveTree: PlaneWave | null = null;

  // 当前激活的波次
  activeWave: PlaneWave | null = null;

  constructor(minifly: MiniFly, planeEnemy: PlaneEnemy) {
    super();
    this.minifly = minifly;
    this.planeEnemy = planeEnemy;

    this.init();
  }

  init() {
    this.startTime = Date.now();
    this.initWave();
  }

  // 初始化波次
  initWave() {
    const wave1 = new Wave_1(this.planeEnemy.gameParams, this, WAVE_1_CONFIG)
    const wave2 = new Wave_2(this.planeEnemy.gameParams, this, WAVE_2_CONFIG)

    wave1.appendNextWave(wave2);

    // todo : 后续追加波次结构
    this.waveTree = wave1;
    this.activeWave = wave1;
  }

  // 依据当前的波次 生成敌机
  createEnemy() {
    if (!this.activeWave) {
      return;
    }
    const enemyConfigArr = this.activeWave.createEnemy();

    if (enemyConfigArr.length) {
      for (const enemyConfig of enemyConfigArr) {
        this.planeEnemy.buildEnemyByConfig(enemyConfig);
        const type = enemyConfig.type;
        this.unLockedEnemy[type] += 1;
      }
    }
  }

  // 更新数量
  updateEnemyCountSub(type: EnemyType) {
    this.unLockedEnemy[type] -= 1;
  }

  // 更新分数
  updateScore(score: number) {
    this.currentScore = score
  }

  updateWave() {
    if (this.activeWave) {
      const info = {
        startTime: this.startTime,
        gameTime: this.gamingTime,
        currentScore: this.currentScore,
      };
      const newWave = this.activeWave.updateWave(info);
      if (newWave) {
        this.activeWave = newWave;
      } else {
        // todo : 游戏结束
        // console.log('游戏结束');
      }
      this.createEnemy();
    }
  }

  render(): void {
    const now = Date.now();
    this.gamingTime = now - this.startTime;
    this.updateWave();
  }
}
